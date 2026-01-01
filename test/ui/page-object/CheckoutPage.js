/**
 * CheckoutPage.js
 * Page Object for Checkout Page
 * 
 * Mapped from: cellex-web/src/features/clients/pages/Checkout/CheckoutPage.tsx
 * 
 * Elements identified:
 * - Page title: "Thanh toán"
 * - Order summary card
 * - Payment method radio buttons: COD, VNPAY
 * - Confirm & Pay button: "Xác nhận & Thanh toán"
 * - Error messages
 */

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class CheckoutPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Page URL
        this.url = '/checkout';
        
        // ============================================
        // LOCATORS - Based on CheckoutPage.tsx analysis
        // ============================================
        
        // Main container
        this.mainContainer = By.css('.max-w-3xl.mx-auto');
        
        // Page title
        // From: <Title level={2}>Thanh toán</Title>
        this.pageTitle = By.xpath('//h2[contains(text(), "Thanh toán")]');
        
        // Order summary card
        // From: <Card title="Tóm tắt đơn hàng">
        this.orderSummaryCard = By.xpath('//div[contains(@class, "ant-card")]//span[contains(text(), "Tóm tắt đơn hàng")]/..');
        
        // Product count
        this.productCount = By.xpath('//span[contains(text(), "Số sản phẩm")]/following-sibling::strong');
        
        // Total amount
        // From: <Statistic title="Tổng cộng" value={totalPrice} suffix="₫" />
        this.totalAmount = By.css('.ant-statistic-content-value');
        
        // Payment method card
        // From: <Card title="Phương thức thanh toán">
        this.paymentMethodCard = By.xpath('//div[contains(@class, "ant-card")]//span[contains(text(), "Phương thức thanh toán")]/..');
        
        // Payment method radio buttons
        // From: <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
        //       <Radio value="VNPAY">VNPay</Radio>
        this.codRadio = By.xpath('//span[contains(text(), "COD") or contains(text(), "Thanh toán khi nhận hàng")]/../input[@type="radio"] | //input[@value="COD"]');
        this.codLabel = By.xpath('//span[contains(text(), "Thanh toán khi nhận hàng")]');
        
        this.vnpayRadio = By.xpath('//span[contains(text(), "VNPay")]/../input[@type="radio"] | //input[@value="VNPAY"]');
        this.vnpayLabel = By.xpath('//span[contains(text(), "VNPay")]');
        
        // Radio group
        this.paymentRadioGroup = By.css('.ant-radio-group');
        
        // Confirm button
        // From: <Button type="primary" ... onClick={handleCheckout}>Xác nhận & Thanh toán</Button>
        this.confirmButton = By.xpath('//button[contains(., "Xác nhận") and contains(., "Thanh toán")]');
        
        // Error message
        this.errorMessage = By.css('.ant-typography-danger, .text-red-500');
        
        // Success message
        this.successMessage = By.css('.ant-message-success');
        
        // Loading spinner
        this.loadingSpinner = By.css('.ant-spin, .ant-btn-loading');
        
        // Empty cart warning
        this.emptyCartWarning = By.xpath('//*[contains(text(), "Giỏ hàng trống")]');
    }

    /**
     * Navigate to checkout page
     */
    async open() {
        await this.navigate(this.url);
        await this.sleep(1000);
    }

    /**
     * Select COD payment method
     */
    async selectCOD() {
        await this.click(this.codLabel);
        await this.sleep(300);
    }

    /**
     * Select VNPay payment method
     */
    async selectVNPay() {
        await this.click(this.vnpayLabel);
        await this.sleep(300);
    }

    /**
     * Get selected payment method
     * @returns {Promise<string>} - 'COD' or 'VNPAY'
     */
    async getSelectedPaymentMethod() {
        const codChecked = await this.driver.findElement(By.css('input[value="COD"]')).isSelected();
        if (codChecked) return 'COD';
        return 'VNPAY';
    }

    /**
     * Get total amount displayed
     * @returns {Promise<string>}
     */
    async getTotalAmount() {
        return await this.getText(this.totalAmount);
    }

    /**
     * Get product count
     * @returns {Promise<string>}
     */
    async getProductCount() {
        return await this.getText(this.productCount);
    }

    /**
     * Click confirm and pay button
     */
    async confirmPayment() {
        await this.click(this.confirmButton);
    }

    /**
     * Complete checkout with COD
     */
    async checkoutWithCOD() {
        await this.selectCOD();
        await this.confirmPayment();
    }

    /**
     * Complete checkout with VNPay
     */
    async checkoutWithVNPay() {
        await this.selectVNPay();
        await this.confirmPayment();
    }

    /**
     * Check if checkout page is displayed
     * @returns {Promise<boolean>}
     */
    async isCheckoutPageDisplayed() {
        return await this.isDisplayed(this.pageTitle);
    }

    /**
     * Check if confirm button is enabled
     * @returns {Promise<boolean>}
     */
    async isConfirmButtonEnabled() {
        const button = await this.waitForElement(this.confirmButton);
        const disabled = await button.getAttribute('disabled');
        return disabled !== 'true';
    }

    /**
     * Check if page is loading
     * @returns {Promise<boolean>}
     */
    async isLoading() {
        return await this.isDisplayed(this.loadingSpinner);
    }

    /**
     * Check if error message is displayed
     * @returns {Promise<boolean>}
     */
    async isErrorDisplayed() {
        await this.sleep(500);
        return await this.isDisplayed(this.errorMessage);
    }

    /**
     * Get error message text
     * @returns {Promise<string>}
     */
    async getErrorMessage() {
        return await this.getText(this.errorMessage);
    }

    /**
     * Check if success message is displayed
     * @returns {Promise<boolean>}
     */
    async isSuccessDisplayed() {
        await this.sleep(1000);
        return await this.isDisplayed(this.successMessage);
    }

    /**
     * Wait for redirect to orders page after successful COD checkout
     */
    async waitForOrderSuccess() {
        await this.waitForUrlContains('/account');
    }

    /**
     * Wait for VNPay redirect
     */
    async waitForVNPayRedirect() {
        await this.driver.wait(async () => {
            const url = await this.getCurrentUrl();
            return url.includes('vnpay') || url.includes('sandbox');
        }, 15000);
    }
}

module.exports = CheckoutPage;
