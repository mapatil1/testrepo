import type { Page } from '@playwright/test';
import { CommonActions } from '../../helpers/CommonActions.js';

export class PimPage {
  private readonly actions: CommonActions;

  constructor(private readonly page: Page) {
    this.actions = new CommonActions(page);
  }

  async openAddEmployee(): Promise<void> {
    await this.page.getByRole('link', { name: 'Add Employee' }).click();
  }

  async addEmployee(firstName: string, lastName: string): Promise<void> {
    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);
    await this.actions.clickButton('Save');
    await this.actions.verifySuccessMessage();
  }

  async openEmployeeList(): Promise<void> {
    await this.page.getByRole('link', { name: 'Employee List' }).click();
  }

  async searchEmployee(fullName: string): Promise<void> {
    const employeeNameInput = this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.getByText('Employee Name', { exact: true }) })
      .getByPlaceholder('Type for hints...');
    await employeeNameInput.fill(fullName);
    await this.page
      .locator('.oxd-autocomplete-option')
      .filter({ hasText: fullName })
      .click();
    await this.actions.clickButton('Search');
  }
}
