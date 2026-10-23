import { expect, test } from '@playwright/test';
import { AuthenticationActions } from '../helpers/AuthenticationActions.js';
import { DashboardPage } from '../pages/orangehrm/DashboardPage.js';
import { PimPage } from '../pages/orangehrm/PimPage.js';
import { commonTestData } from '../test-data/commonTestData.js';

const { employee } = commonTestData;
const employeeFullName = `${employee.firstName} ${employee.lastName}`;

 test.describe.serial('OrangeHRM user flows', () => {
// test.describe('OrangeHRM user flows', () => {
  test('logs in and displays the Dashboard', async ({ page }) => {
    await new AuthenticationActions(page).login();

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('logs out and returns to the Login page', async ({ page }) => {
    const authentication = new AuthenticationActions(page);
    await authentication.login();
    await authentication.logout();

    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('adds an employee and displays the employee details', async ({ page }) => {
    await new AuthenticationActions(page).login();

    await new DashboardPage(page).openPim();
    const pimPage = new PimPage(page);
    await pimPage.openAddEmployee();
    await pimPage.addEmployee(employee.firstName, employee.lastName);

    await expect(page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
  });

  test('searches for the employee created in the previous flow', async ({ page }) => {
    await new AuthenticationActions(page).login();

    await new DashboardPage(page).openPim();
    const pimPage = new PimPage(page);
    await pimPage.openEmployeeList();
    await pimPage.searchEmployee(employeeFullName);

    await expect(
      page.getByRole('row').filter({ hasText: employeeFullName }),
    ).toBeVisible();
  });
});
