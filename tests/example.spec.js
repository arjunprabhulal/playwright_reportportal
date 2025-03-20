// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('DemoBlaze website tests', () => {
  test('Homepage loads successfully', async ({ page }) => {
    // Navigate to the website
    await page.goto('/');
    
    // Verify the page loaded successfully
    await expect(page).toHaveTitle(/STORE/);
    
    // Take a screenshot for the report
    await page.screenshot({ path: 'homepage.png' });
  });
  
  test('Has correct navigation menu', async ({ page }) => {
    await page.goto('/');
    
    // Check the navigation menu
    const navMenu = page.locator('#navbarExample');
    await expect(navMenu).toBeVisible();
    
    // Check Home link exists
    const homeLink = page.locator('a:has-text("Home")');
    await expect(homeLink).toBeVisible();
  });
  
  test('Contains product categories', async ({ page }) => {
    await page.goto('/');
    
    // Check that the product categories exist
    const categories = page.locator('.list-group');
    await expect(categories).toBeVisible();
    
    // Check specific category
    const phonesCategory = page.locator('.list-group a:has-text("Phones")');
    await expect(phonesCategory).toBeVisible();
    
    // Log information for Report Portal
    console.log('Product categories are visible');
  });
}); 