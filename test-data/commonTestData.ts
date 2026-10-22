import { randomUUID } from 'node:crypto';

function createEmployeeData() {
  return {
    firstName: 'Playwright',
    lastName: `Employee${randomUUID().slice(0, 8)}`,
  };
}

export const commonTestData = {
  orangeHrm: {
    get baseUrl(): string {
      return process.env.ORANGEHRM_BASE_URL?.trim() || 'https://opensource-demo.orangehrmlive.com';
    },
    get username(): string {
      return process.env.ORANGEHRM_USERNAME?.trim() || 'Admin';
    },
    get password(): string {
      return process.env.ORANGEHRM_PASSWORD || 'admin123';
    },
  },
  employee: createEmployeeData(),
};
