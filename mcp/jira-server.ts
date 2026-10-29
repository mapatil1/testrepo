import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

const jiraBaseUrl = process.env.JIRA_BASE_URL?.replace(/\/+$/, "");
const jiraEmail = process.env.JIRA_EMAIL;
const jiraApiToken = process.env.JIRA_API_TOKEN;

if (!jiraBaseUrl || !jiraEmail || !jiraApiToken) {
  throw new Error(
    "JIRA_BASE_URL, JIRA_EMAIL, and JIRA_API_TOKEN must be configured.",
  );
}

const parsedBaseUrl = new URL(jiraBaseUrl);
if (parsedBaseUrl.protocol !== "https:") {
  throw new Error("JIRA_BASE_URL must use HTTPS.");
}

const authorization = `Basic ${Buffer.from(
  `${jiraEmail}:${jiraApiToken}`,
).toString("base64")}`;

const server = new McpServer({ name: "jira", version: "1.0.0" });

async function jiraRequest<T>(
  path: string,
  options: { method?: "GET" | "POST"; body?: unknown } = {},
): Promise<T> {
  const response = await fetch(new URL(path, `${jiraBaseUrl}/`), {
    method: options.method ?? "GET",
    headers: {
      Authorization: authorization,
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Jira API request failed (${response.status}): ${details || response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

server.registerTool(
  "jira_search_issues",
  {
    description: "Search Jira issues using JQL.",
    inputSchema: z.object({
      jql: z.string().min(1).max(2000),
      maxResults: z.number().int().min(1).max(50).default(10),
    }),
  },
  async ({ jql, maxResults }) => {
    const result = await jiraRequest<{
      issues: Array<{
        key: string;
        fields: {
          summary?: string;
          status?: { name: string };
          assignee?: { displayName: string } | null;
          updated?: string;
        };
      }>;
    }>("/rest/api/3/search/jql", {
      method: "POST",
      body: {
        jql,
        maxResults,
        fields: ["summary", "status", "assignee", "updated"],
      },
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            result.issues.map(({ key, fields }) => ({
              key,
              summary: fields.summary,
              status: fields.status?.name,
              assignee: fields.assignee?.displayName ?? null,
              updated: fields.updated,
            })),
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.registerTool(
  "jira_get_issue",
  {
    description: "Get the summary and details of a Jira issue by its key.",
    inputSchema: z.object({
      issueKey: z.string().regex(/^[A-Z][A-Z0-9_]*-\d+$/),
    }),
  },
  async ({ issueKey }) => {
    const issue = await jiraRequest<{
      key: string;
      fields: {
        summary?: string;
        description?: unknown;
        status?: { name: string };
        assignee?: { displayName: string } | null;
        priority?: { name: string } | null;
        updated?: string;
      };
    }>(
      `/rest/api/3/issue/${encodeURIComponent(issueKey)}?fields=summary,description,status,assignee,priority,updated`,
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              key: issue.key,
              ...issue.fields,
              assignee: issue.fields.assignee?.displayName ?? null,
              priority: issue.fields.priority?.name ?? null,
              status: issue.fields.status?.name,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

async function main(): Promise<void> {
  await server.connect(new StdioServerTransport());
}

main().catch((error: unknown) => {
  console.error("Failed to start Jira MCP server:", error);
  process.exitCode = 1;
});
