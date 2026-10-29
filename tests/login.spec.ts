import { expect, test } from '@playwright/test';
import { AuthenticationActions } from '../helpers/AuthenticationActions.js';
import { DashboardPage } from '../pages/orangehrm/DashboardPage.js';
import { PimPage } from '../pages/orangehrm/PimPage.js';
import { commonTestData } from '../test-data/commonTestData.js';

const { employee } = commonTestData;
const employeeFullName = `${employee.firstName} ${employee.lastName}`;

test.describe.serial('OrangeHRM user flows', () => {
  test('logs in and displays the Dashboard', async ({ page }) => {
    await new AuthenticationActions(page).login();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/dashboard\/index/);
    // await new DashboardPage(page).expectDashboardLoaded();
  });

});
