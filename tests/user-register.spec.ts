import { test, expect } from '@playwright/test'
import { WebURL } from './support/constants'
import { createRNDMSignUpUser } from './fixtures/user'

test('user register', async ({ page }) => {
  const signUpUser = createRNDMSignUpUser()

  await page.goto(`${WebURL}/sign-up`)
  await page.locator('input[type="text"]').click()
  await page.locator('input[type="text"]').fill(signUpUser.email)
  await page.locator('input[type="password"]').click()
  await page.locator('input[type="password"]').fill(signUpUser.password)
  await page.getByRole('button', { name: '登録', exact: true }).click()

  await expect(page).toHaveURL(/dashboard/)
})
