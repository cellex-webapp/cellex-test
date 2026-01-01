/**
 * CartPage.js
 * Page Object for Shopping Cart Page
 * 
 * Mapped from: cellex-web/src/features/clients/pages/Cart/CartPage.tsx
 * 
 * Elements identified:
 * - Cart title: "Giỏ hàng"
 * - Cart items list with quantity inputs
 * - Delete item buttons
 * - Clear all button: "Xóa tất cả"
 * - Order summary card
 * - Checkout button: "Tiến hành thanh toán"
 * - Empty cart state
 * - Login prompt for unauthenticated users
 */

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class CartPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Page URL
        this.url = '/cart';
        
        // ============================================
        // LOCATORS - Based on CartPage.tsx analysis
        // ============================================
        
        // Main container
        this.mainContainer = By.css('.bg-gray-50.min-h-screen');
        
        // Page title
        // From: <Title level={2}>Giỏ hàng</Title>
        this.pageTitle = By.xpath('//h2[contains(text(), "Giỏ hàng")]');
        
        // Cart card with items
        this.cartCard = By.css('.ant-card.shadow-sm');
        this.cartItemsTitle = By.xpath('//h4[contains(text(), "Giỏ hàng của bạn")]');
        
        // Clear all button
        // From: <Button type="text" danger onClick={handleClearAll}>Xóa tất cả</Button>
        this.clearAllButton = By.xpath('//button[contains(text(), "Xóa tất cả")]');
        
        // Cart items
        this.cartItems = By.css('.ant-list-item');
        this.cartItemImages = By.css('.ant-list-item .ant-image img');
        this.cartItemNames = By.css('.ant-list-item .line-clamp-2');
        this.cartItemPrices = By.css('.ant-list-item .ant-statistic-content-value');
        
        // Quantity input for each item
        // From: <InputNumber min={0} max={availableStock} ... />
        this.quantityInputs = By.css('.ant-input-number input');
        
        // Delete item buttons
        // From: <Button type="text" danger icon={<DeleteOutlined />} />
        this.deleteItemButtons = By.css('.ant-list-item button.ant-btn-dangerous');
        
        // Order summary card
        this.orderSummaryCard = By.xpath('//h4[contains(text(), "Tóm tắt đơn hàng")]/..');
        
        // Total items count
        this.totalItemsText = By.xpath('//span[contains(text(), "Tổng số sản phẩm")]/../span[2]');
        
        // Total price
        // From: <Statistic title="Tổng cộng" value={totalPrice} />
        this.totalPrice = By.css('.ant-statistic-content-value');
        
        // Checkout button
        // From: <Button type="primary" ... icon={<ShoppingCartOutlined />}>Tiến hành thanh toán</Button>
        this.checkoutButton = By.xpath('//button[contains(., "Tiến hành thanh toán")]');
        
        // Empty cart state
        // From: <Empty description="Giỏ hàng của bạn đang trống" />
        this.emptyCartMessage = By.xpath('//*[contains(text(), "Giỏ hàng của bạn đang trống")]');
        this.continueShoppingBtn = By.xpath('//button[contains(text(), "Tiếp tục mua sắm")]');
        
        // Login prompt (for unauthenticated users)
        this.loginPrompt = By.xpath('//*[contains(text(), "Vui lòng đăng nhập")]');
        this.loginButton = By.xpath('//button[contains(text(), "Đăng nhập")]');
        
        // Confirm delete modal
        this.confirmModal = By.css('.ant-modal-confirm');
        this.confirmDeleteBtn = By.xpath('//button[contains(text(), "Xóa")]');
        this.cancelDeleteBtn = By.xpath('//button[contains(text(), "Hủy")]');
        
        // Success message
        this.successMessage = By.css('.ant-message-success');
        
        // Loading spinner
        this.loadingSpinner = By.css('.ant-spin');
    }

    /**
     * Navigate to cart page
     */
    async open() {
        await this.navigate(this.url);
        await this.sleep(1000); // Wait for cart to load
    }

    /**
     * Check if cart is empty
     * @returns {Promise<boolean>}
     */
    async isCartEmpty() {
        return await this.isDisplayed(this.emptyCartMessage);
    }

    /**
     * Check if login is required
     * @returns {Promise<boolean>}
     */
    async isLoginRequired() {
        return await this.isDisplayed(this.loginPrompt);
    }

    /**
     * Get number of items in cart
     * @returns {Promise<number>}
     */
    async getCartItemCount() {
        const items = await this.driver.findElements(this.cartItems);
        return items.length;
    }

    /**
     * Get cart item names
     * @returns {Promise<string[]>}
     */
    async getCartItemNames() {
        const nameElements = await this.driver.findElements(this.cartItemNames);
        const names = [];
        for (const element of nameElements) {
            names.push(await element.getText());
        }
        return names;
    }

    /**
     * Update quantity for item at specific index
     * @param {number} index - Index of item (0-based)
     * @param {number} quantity - New quantity
     */
    async updateQuantity(index, quantity) {
        const inputs = await this.driver.findElements(this.quantityInputs);
        if (inputs.length > index) {
            const input = inputs[index];
            await input.clear();
            await input.sendKeys(quantity.toString());
            // Trigger blur to save
            await input.sendKeys('\t');
            await this.sleep(500);
        } else {
            throw new Error(`Item at index ${index} not found`);
        }
    }

    /**
     * Delete item at specific index
     * @param {number} index - Index of item to delete (0-based)
     */
    async deleteItem(index) {
        const deleteButtons = await this.driver.findElements(this.deleteItemButtons);
        if (deleteButtons.length > index) {
            await deleteButtons[index].click();
            await this.sleep(500);
            // Confirm deletion in modal
            if (await this.isDisplayed(this.confirmDeleteBtn)) {
                await this.click(this.confirmDeleteBtn);
            }
            await this.sleep(500);
        } else {
            throw new Error(`Delete button at index ${index} not found`);
        }
    }

    /**
     * Clear all items from cart
     */
    async clearCart() {
        await this.click(this.clearAllButton);
        await this.sleep(500);
        // Confirm in modal
        if (await this.isDisplayed(this.confirmDeleteBtn)) {
            await this.click(this.confirmDeleteBtn);
        }
        await this.sleep(500);
    }

    /**
     * Get total price displayed
     * @returns {Promise<string>}
     */
    async getTotalPrice() {
        const priceElements = await this.driver.findElements(this.totalPrice);
        // Get the last one which is the grand total
        if (priceElements.length > 0) {
            return await priceElements[priceElements.length - 1].getText();
        }
        return '0';
    }

    /**
     * Click checkout button
     */
    async proceedToCheckout() {
        await this.click(this.checkoutButton);
    }

    /**
     * Click continue shopping button
     */
    async continueShopping() {
        await this.click(this.continueShoppingBtn);
    }

    /**
     * Click login button (when cart requires authentication)
     */
    async clickLoginButton() {
        await this.click(this.loginButton);
    }

    /**
     * Check if checkout button is enabled
     * @returns {Promise<boolean>}
     */
    async isCheckoutEnabled() {
        const button = await this.waitForElement(this.checkoutButton);
        const disabled = await button.getAttribute('disabled');
        return disabled !== 'true';
    }

    /**
     * Wait for cart to load
     */
    async waitForCartLoaded() {
        await this.driver.wait(async () => {
            const loading = await this.isDisplayed(this.loadingSpinner);
            return !loading;
        }, this.timeout);
    }

    /**
     * Check if success message is displayed
     * @returns {Promise<boolean>}
     */
    async isSuccessMessageDisplayed() {
        await this.sleep(500);
        return await this.isDisplayed(this.successMessage);
    }
}

module.exports = CartPage;
