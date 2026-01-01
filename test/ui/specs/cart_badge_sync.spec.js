/**
 * cart_badge_sync.spec.js
 * Test Case: TC_CL_078 - Real-time Cart Badge Sync
 * 
 * Target: CartPage.tsx and Header.tsx
 * 
 * Steps:
 * 1. Navigate to a product page
 * 2. Click "Add to Cart" button
 * 3. Verify the cart icon badge in the Header updates its count immediately without page refresh
 */

const { expect } = require('chai');
const { BasePage, LoginPage, HomePage, HeaderComponent } = require('../page-object');

describe('TC_CL_078: Real-time Cart Badge Sync', function() {
    this.timeout(60000); // Longer timeout for this test suite
    
    let driver;
    let loginPage;
    let homePage;
    let headerComponent;
    
    // Test credentials - UPDATE WITH ACTUAL TEST USER
    const testUser = {
        email: process.env.TEST_USER_EMAIL || 'user@gmail.com',
        password: process.env.TEST_USER_PASSWORD || 'password123'
    };

    before(async function() {
        console.log('🚀 Starting TC_CL_078: Real-time Cart Badge Sync test...');
        driver = await BasePage.createDriver();
        loginPage = new LoginPage(driver);
        homePage = new HomePage(driver);
        headerComponent = new HeaderComponent(driver);
    });

    after(async function() {
        if (driver) {
            console.log('🧹 Cleaning up...');
            await driver.quit();
        }
    });

    describe('Cart Badge Synchronization', function() {
        
        it('Step 1: Should login successfully', async function() {
            console.log('   📝 Logging in as client user...');
            await loginPage.open();
            await loginPage.login(testUser.email, testUser.password);
            
            // Wait for redirect to home page
            await driver.sleep(3000);
            
            // Verify user is authenticated
            const isAuthenticated = await headerComponent.isUserAuthenticated();
            expect(isAuthenticated, 'User should be authenticated').to.be.true;
        });

        it('Step 2: Should display initial cart badge count', async function() {
            console.log('   📝 Checking initial cart badge...');
            await homePage.open();
            await driver.sleep(2000);
            
            // Get initial cart badge count
            const initialCount = await headerComponent.getCartBadgeCount();
            console.log(`   ✓ Initial cart badge count: ${initialCount}`);
            
            // Store for comparison (could be 0 or more)
            this.initialCartCount = initialCount;
        });

        it('Step 3: Should navigate to a product page', async function() {
            console.log('   📝 Navigating to first product...');
            
            // Click on first product in the list
            await homePage.clickFirstProduct();
            await driver.sleep(2000);
            
            // Verify we're on product detail page
            const currentUrl = await driver.getCurrentUrl();
            // Accept both /product/ and /products/ routes
            expect(currentUrl, 'Should be on product detail page').to.match(/\/products?\//);
            console.log(`   ✓ Navigated to: ${currentUrl}`);
        });

        it('Step 4: Should add product to cart and verify badge updates immediately', async function() {
            console.log('   📝 Adding product to cart...');
            
            // Get current cart count before adding
            const countBefore = await headerComponent.getCartBadgeCount();
            console.log(`   ℹ Cart count before: ${countBefore}`);
            
            // Find and click "Add to Cart" button
            // From ProductDetailCard.tsx: <button aria-label="Thêm vào giỏ">
            const addToCartButton = await driver.findElement({ css: 'button[aria-label="Thêm vào giỏ"]' });
            await addToCartButton.click();
            
            console.log('   ⏳ Waiting for cart badge to update...');
            
            // Wait for success message
            await driver.sleep(2000);
            
            // Verify cart badge updates immediately (without page refresh)
            const expectedCount = countBefore + 1;
            const badgeUpdated = await headerComponent.waitForCartBadgeCount(expectedCount, 10000);
            expect(badgeUpdated, 'Cart badge should update to new count').to.be.true;
            
            // Get final count
            const countAfter = await headerComponent.getCartBadgeCount();
            console.log(`   ✓ Cart count after: ${countAfter}`);
            
            // Verify the count increased by 1
            expect(countAfter, 'Cart count should increase by 1').to.equal(expectedCount);
            
            console.log('   ✅ Cart badge synchronized in real-time without page refresh!');
        });

        it('Step 5: Should verify cart badge persists after navigation', async function() {
            console.log('   📝 Verifying cart badge persistence...');
            
            // Navigate back to home page
            await homePage.open();
            await driver.sleep(2000);
            
            // Verify badge still shows correct count
            const cartCount = await headerComponent.getCartBadgeCount();
            expect(cartCount, 'Cart badge should persist after navigation').to.be.greaterThan(0);
            console.log(`   ✓ Cart badge shows: ${cartCount} items`);
        });

        it('Step 6: Should verify cart page shows correct items', async function() {
            console.log('   📝 Verifying cart page content...');
            
            // Click on cart button in header
            await headerComponent.clickCart();
            await driver.sleep(2000);
            
            // Verify we're on cart page
            const currentUrl = await driver.getCurrentUrl();
            expect(currentUrl, 'Should be on cart page').to.include('/cart');
            
            // Verify cart has items
            const cartItems = await driver.findElements({ css: '.ant-list-item' });
            expect(cartItems.length, 'Cart should contain items').to.be.greaterThan(0);
            console.log(`   ✓ Cart contains ${cartItems.length} item(s)`);
        });
    });
});
