const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

/**
 * Cart Page Object
 * Handles shopping cart functionality
 */
class CartPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Locators - Updated to match CartPage.tsx (Ant Design components)
        this.cartIcon = By.xpath('//a[@href="/cart"]');
        this.cartItemsList = By.css('.ant-list-item');
        this.cartItemName = By.css('.ant-typography');
        this.cartItemPrice = By.css('.ant-statistic-content-value');
        this.quantityInput = By.css('.ant-input-number-input');
        this.removeItemButton = By.css('button.ant-btn-text.ant-btn-dangerous');
        this.clearAllButton = By.xpath('//button[contains(text(), "Xóa tất cả")]');
        this.cartTotal = By.xpath('//div[contains(@class, "ant-statistic")]//span[contains(@class, "ant-statistic-content-value")]');
        this.checkoutButton = By.xpath('//button[contains(text(), "Thanh toán") or contains(text(), "Tiến hành thanh toán")]');
        this.continueShoppingButton = By.xpath('//button[contains(text(), "Tiếp tục mua sắm")]');
        this.emptyCartMessage = By.css('.ant-empty-description');
        this.cartBadge = By.css('.ant-badge-count');
        this.cartTitle = By.xpath('//h2[contains(text(), "Giỏ hàng")]');
    }

    /**
     * Navigate to cart page
     */
    async navigateToCart() {
        await this.navigate('/cart');
    }

    /**
     * Open cart by clicking cart icon
     */
    async openCart() {
        await this.click(this.cartIcon);
        await this.sleep(1000);
    }

    /**
     * Get number of items in cart
     * @returns {Promise<number>}
     */
    async getCartItemCount() {
        try {
            const items = await this.findElements(this.cartItemsList);
            return items.length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Get cart badge count
     * @returns {Promise<number>}
     */
    async getCartBadgeCount() {
        try {
            const badgeText = await this.getText(this.cartBadge);
            return parseInt(badgeText) || 0;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Get cart total amount
     * @returns {Promise<string>}
     */
    async getCartTotal() {
        return await this.getText(this.cartTotal);
    }

    /**
     * Remove item from cart by index
     * @param {number} index - Item index (0-based)
     */
    async removeItemByIndex(index = 0) {
        const removeButtons = await this.findElements(this.removeItemButton);
        if (removeButtons.length > index) {
            await removeButtons[index].click();
            await this.sleep(1000);
        }
    }

    /**
     * Clear all items from cart
     */
    async clearCart() {
        try {
            await this.click(this.clearAllButton);
            await this.sleep(500);
            
            // Confirm in modal
            await this.click(this.confirmDeleteButton);
            await this.sleep(2000);
        } catch (error) {
            console.error('Failed to clear cart:', error.message);
        }
    }

    /**
     * Set quantity using Ant Design InputNumber
     * @param {number} index - Item index (0-based)
     * @param {number} quantity - Desired quantity
     */
    async setQuantity(index, quantity) {
        const inputs = await this.findElements(this.quantityInput);
        if (inputs.length > index) {
            const input = inputs[index];
            
            // Clear and type new value
            await input.click();
            await this.sleep(200);
            
            // Select all and replace
            await input.sendKeys(this.driver.Key.CONTROL, 'a');
            await input.sendKeys(quantity.toString());
            
            // Press Enter or blur to trigger change
            await input.sendKeys(this.driver.Key.ENTER);
            await this.sleep(1500);
        }
    }

    /**
     * Get item details by index
     * @param {number} index - Item index (0-based)
     * @returns {Promise<Object>}
     */
    async getItemDetails(index = 0) {
        const items = await this.findElements(this.cartItemsList);
        if (items.length <= index) {
            return null;
        }

        const item = items[index];
        const name = await item.findElement(By.css('.item-name, [data-testid="item-name"]')).getText();
        const price = await item.findElement(By.css('.item-price, [data-testid="item-price"]')).getText();
        const quantity = await item.findElement(By.css('.item-quantity, [data-testid="item-quantity"]')).getText();

        return { name, price, quantity };
    }

    /**
     * Proceed to checkout
     */
    async proceedToCheckout() {
        await this.click(this.checkoutButton);
        await this.sleep(2000);
    }

    /**
     * Continue shopping
     */
    async continueShopping() {
        await this.click(this.continueShoppingButton);
        await this.sleep(1000);
    }

    /**
     * Check if cart is empty
     * @returns {Promise<boolean>}
     */
    async isCartEmpty() {
        try {
            return await this.isDisplayed(this.emptyCartMessage);
        } catch (error) {
            const itemCount = await this.getCartItemCount();
            return itemCount === 0;
        }
    }

    /**
     * Check if checkout button is enabled
     * @returns {Promise<boolean>}
     */
    async isCheckoutEnabled() {
        return await this.isEnabled(this.checkoutButton);
    }
}

module.exports = CartPage;
