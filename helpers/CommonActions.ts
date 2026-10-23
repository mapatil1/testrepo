import { expect, type Page } from '@playwright/test';

export class CommonActions {
  constructor(private readonly page: Page) {}

  async clickButton(name: string): Promise<void> {
    await this.page.getByRole('button', { name, exact: true }).click();
  }

  async verifySuccessMessage(message = 'Successfully Saved'): Promise<void> {
    await this.verifyToastMessage(message);
  }

  async verifyUpdateMessage(message = 'Successfully Updated'): Promise<void> {
    await this.verifyToastMessage(message);
  }

  async verifyDeleteMessage(message = 'Successfully Deleted'): Promise<void> {
    await this.verifyToastMessage(message);
  }

  private async verifyToastMessage(message: string): Promise<void> {
    const toastMessage = this.page.getByText(message, { exact: true });
    await expect(toastMessage).toBeVisible();
  }
}
