import type { Page } from '@playwright/test';
import { DashboardPage } from '../pages/orangehrm/DashboardPage.js';
import { LoginPage } from '../pages/orangehrm/LoginPage.js';

export class AuthenticationActions {
  private readonly loginPage: LoginPage;
  private readonly dashboardPage: DashboardPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
  }

  async login(): Promise<void> {
    await this.loginPage.open();
    await this.loginPage.login();
  }

  async logout(): Promise<void> {
    await this.dashboardPage.logout();
  }
}
