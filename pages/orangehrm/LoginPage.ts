import type { Page } from '@playwright/test';
import { CommonActions } from '../../helpers/CommonActions.js';
import { commonTestData } from '../../test-data/commonTestData.js';

export class LoginPage {
  private readonly actions: CommonActions;

  constructor(private readonly page: Page) {
    this.actions = new CommonActions(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
  }

  async login(): Promise<void> {
    await this.page.getByPlaceholder('Username').fill(commonTestData.orangeHrm.username);
    await this.page.getByPlaceholder('Password').fill(commonTestData.orangeHrm.password);
    await this.actions.clickButton('Login');
  }
}
