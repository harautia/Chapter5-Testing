const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3003')
  })

  test('user can log in', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
  })
/*
test('front page can be opened', async ({ page }) => {
  await page.goto('http://localhost:3003')

  const locator = page.getByText('The Blog Listing')
  await expect(locator).toBeVisible()
  await expect(page.getByText('Blog app , Hannu Rautiainen, 2025')).toBeVisible()
})
*/
})