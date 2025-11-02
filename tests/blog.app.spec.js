const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog} = require('./helper')

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
    await loginWith(page, 'testaaja', 'salainen')
    await expect(page.getByText('Teppo Testaaja logged in')).toBeVisible()
  })

  test('user unsuccessful log in', async ({ page }) => {
    await loginWith(page, 'tester', 'valid')
    await expect(page.getByText('Wrong Credentials')).toBeVisible()
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
    await loginWith(page, 'testaaja', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
    await createBlog(page, 'Lion Whisperer', 'Max Luther', 'www.lion-whisperer.com', '12')
    await expect(page.locator('tr').nth(1).getByText('Max Luther')).toBeVisible()
    })

    describe('One blog already exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Hippo Whisperer', 'Lea Luther', 'www.hippo-whisperer.com', '24')
      })

      test('Likes is added by one', async ({ page }) => {
      await page.getByRole('button', { name: 'show details' }).click()
      await page.getByRole('button', { name: 'Add Like' }).click()
      await expect(page.getByText('25')).toBeVisible()
      })
    })
  })
})