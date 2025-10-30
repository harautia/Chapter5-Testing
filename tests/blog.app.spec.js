const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {

    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Teppo Testaaja',
        username: 'testaaja',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'tester',
        password: 'invalid'
      }
    })
    await page.goto('http://localhost:3003')
  })

test('front page can be opened', async ({ page }) => {
  await page.goto('http://localhost:3003')

  const locator = page.getByText('The Blog Listing')
  await expect(locator).toBeVisible()
  await expect(page.getByText('Blog app , Hannu Rautiainen, 2025')).toBeVisible()
})

  test('user can log in', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('testaaja')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Teppo Testaaja logged in')).toBeVisible()
  })

  test('user unsuccessful log in', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('tester')
    await page.getByLabel('password').fill('valid')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Wrong Credentials')).toBeVisible()
  })
})