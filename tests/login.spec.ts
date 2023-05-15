import { test, expect } from '@playwright/test'
import { WebURL } from './support/constants'

test('login', async ({ page }) => {
  await page.goto(`${WebURL}/sign-in`)
  await page.locator('input[type="text"]').click()
  await page.locator('input[type="text"]').fill('user1@e.com')
  await page.locator('input[type="password"]').click()
  await page.locator('input[type="password"]').fill('pass000')
  await page.getByRole('main').getByRole('button', { name: 'ログイン' }).click()

  await expect(page).toHaveURL(/dashboard/)
})
