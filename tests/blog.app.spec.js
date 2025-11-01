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


describe('When logged in', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Teppo Testaaja',
        username: 'testaaja',
        password: 'salainen'
      }
    })
    await page.goto('http://localhost:3003')

    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('testaaja')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {

    await page.getByRole('button', { name: 'new blog' }).click()

    const textboxes = await page.getByRole('textbox').all()
    await textboxes[0].fill('Lion Whisperer')
    await textboxes[1].fill('Max Luther')
    await textboxes[2].fill('www.lion-whisperer.com')
    await textboxes[3].fill('12')
    await page.getByRole('button', { name: 'add' }).click()
    await expect(page.locator('tr').nth(1).getByText('Max Luther')).toBeVisible()
  })
})