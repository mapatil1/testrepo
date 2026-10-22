import { expect, type Page } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  async openPim(): Promise<void> {
    await this.page.getByRole('link', { name: 'PIM', exact: true }).click();
  }

  async logout(): Promise<void> {
    await this.page.locator('.oxd-userdropdown-tab').click();
    const userMenu = this.page.locator('.oxd-dropdown-menu');
    await expect(userMenu).toBeVisible();
    await userMenu.getByRole('menuitem', { name: 'Logout' }).click();
 //   await userMenu.getByRole('link', { name: 'Logout' }).click();
  }
}
