/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';
const outputDir = path.join(process.cwd(), 'output', 'playwright');
const storageStatePath = path.join(outputDir, 'storageState.json');
const hasStorageState = fs.existsSync(storageStatePath);

async function closePickerIfOpen(page: any) {
  const searchInput = page.locator('input[placeholder="Search by Name"]').first();
  if (await searchInput.count()) {
    const modal = page.locator(
      'xpath=//input[@placeholder="Search by Name"]/ancestor::div[contains(@class,"fixed")][1]'
    );
    const closeButton = modal
      .locator('div.flex.items-center.justify-between.mb-4 div.cursor-pointer')
      .first();
    if (await closeButton.count()) {
      await closeButton.scrollIntoViewIfNeeded();
      await closeButton.click({ force: true });
    } else {
      await page.keyboard.press('Escape');
    }
    await searchInput.waitFor({ state: 'detached', timeout: 10000 });
  }
}

async function selectFirstPlayer(page: any) {
  await page.waitForSelector('[data-tutorial="player-picker-first-row"]', { timeout: 60000 });
  const modal = page.locator(
    'xpath=//input[@placeholder="Search by Name"]/ancestor::div[contains(@class,"fixed")][1]'
  );
  const rows = modal.locator('tr');
  const rowCount = await rows.count();
  let picked = false;
  for (let i = 0; i < rowCount; i += 1) {
    const row = rows.nth(i);
    if (await row.getByText("Can't Afford this Player").isVisible()) {
      continue;
    }
    const button = row.locator('button').first();
    if (!(await button.count())) {
      continue;
    }
    await button.scrollIntoViewIfNeeded();
    if (!(await button.isVisible())) {
      continue;
    }
    await button.click();
    picked = true;
    break;
  }
  if (!picked) {
    await page.locator('[data-tutorial="player-picker-first-row"] button').first().click();
  }
  // Wait for picker to close after selection
  await closePickerIfOpen(page);
  await page.locator('[data-tutorial="player-picker-first-row"]').waitFor({ state: 'hidden', timeout: 60000 });
}

test.use(hasStorageState ? { storageState: storageStatePath } : {});

test('create team tutorial walkthrough (full team)', async ({ page }) => {
  test.skip(!hasStorageState, 'No storage state found. Create output/playwright/storageState.json with a logged-in session.');
  test.setTimeout(120000);

  fs.mkdirSync(outputDir, { recursive: true });

  await page.goto(`${baseUrl}/dashboard?tutorial=create-team`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  await page.waitForSelector('[data-tutorial="dashboard-pick-team-cta"]', { timeout: 60000 });
  await page.screenshot({ path: path.join(outputDir, '01-dashboard-cta.png'), fullPage: true });

  await page.click('[data-tutorial="dashboard-pick-team-cta"]');

  await page.waitForURL(/\/my-team/, { timeout: 60000 });
  await page.waitForSelector('[data-tutorial="my-team-intro"]', { timeout: 60000 });
  await page.screenshot({ path: path.join(outputDir, '02-my-team-intro.png'), fullPage: true });

  const nextButton = page.getByRole('button', { name: 'Next' });
  if (await nextButton.isVisible()) {
    await nextButton.click();
  }

  await page.waitForSelector('[data-tutorial="team-slot-1-empty"]', { timeout: 60000 });
  await page.screenshot({ path: path.join(outputDir, '03-slot-1-empty.png'), fullPage: true });

  await page.click('[data-tutorial="team-slot-1-empty"]');
  await page.waitForSelector('[data-tutorial="player-picker-first-row"]', { timeout: 60000 });
  await page.screenshot({ path: path.join(outputDir, '04-player-picker.png'), fullPage: true });

  await selectFirstPlayer(page);

  await page.waitForSelector('[data-tutorial="team-slot-1-player"]', { timeout: 60000 });
  await page.screenshot({ path: path.join(outputDir, '05-slot-1-player.png'), fullPage: true });

  await page.click('[data-tutorial="team-slot-1-player"]');
  await page.waitForSelector('[data-tutorial="player-action-modal"]', { timeout: 60000 });
  await page.screenshot({ path: path.join(outputDir, '06-action-modal.png'), fullPage: true });

  // Close the action modal to enter free roam
  await page.locator('[data-tutorial="player-action-modal"] button').first().click();
  await page.getByText('Pick the rest of your team').waitFor({ state: 'visible', timeout: 60000 });
  await page.screenshot({ path: path.join(outputDir, '07-free-roam.png'), fullPage: true });

  const positions = ['Second Row', 'Back Row', 'Half Back', 'Back'];
  for (const position of positions) {
    await page.getByText(position, { exact: false }).first().click();
    await selectFirstPlayer(page);
  }

  // Super sub
  await page.getByText('Super Sub', { exact: false }).first().click();
  await selectFirstPlayer(page);

  await page.waitForSelector('[data-tutorial="create-team-button"]', { timeout: 60000 });
  await page.screenshot({ path: path.join(outputDir, '08-ready-create-team.png'), fullPage: true });

  await page.click('[data-tutorial="create-team-button"]');
  await page.getByText('Team Submitted!').waitFor({ state: 'visible', timeout: 60000 });
  await page.screenshot({ path: path.join(outputDir, '09-team-submitted.png'), fullPage: true });
});
