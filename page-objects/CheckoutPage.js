const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

/**
 * Checkout Page Object
 * Handles checkout and payment functionality
 */
class CheckoutPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Shipping Information Locators
        this.fullNameInput = By.css('input[name="fullName"], input[name="name"]');
        this.phoneInput = By.css('input[name="phone"], input[name="phoneNumber"]');
        this.addressInput = By.css('input[name="address"], textarea[name="address"]');
        this.cityInput = By.css('input[name="city"], select[name="city"]');
        this.provinceSelect = By.css('select[name="province"], select[name="state"]');
        this.postalCodeInput = By.css('input[name="postalCode"], input[name="zipCode"]');
        
        // Payment Information Locators
        this.paymentMethodRadio = By.css('input[name="paymentMethod"]');
        this.cardNumberInput = By.css('input[name="cardNumber"]');
        this.cardHolderInput = By.css('input[name="cardHolder"]');
        this.expiryDateInput = By.css('input[name="expiryDate"]');
        this.cvvInput = By.css('input[name="cvv"]');
        
        // Order Summary Locators
        this.orderSummary = By.css('.order-summary, [data-testid="order-summary"]');
        this.subtotal = By.css('.subtotal, [data-testid="subtotal"]');
        this.shippingFee = By.css('.shipping-fee, [data-testid="shipping-fee"]');
        this.tax = By.css('.tax, [data-testid="tax"]');
        this.total = By.css('.total, [data-testid="total"]');
        
        // Action Buttons
        this.placeOrderButton = By.css('button:has-text("Place Order"), [data-testid="place-order"]');
        this.continueToPaymentButton = By.css('button:has-text("Continue to Payment")');
        this.backToCartButton = By.css('button:has-text("Back to Cart")');
        
        // Success/Error Messages
        this.successMessage = By.css('.success-message, [data-testid="success-message"]');
        this.errorMessage = By.css('.error-message, [data-testid="error-message"]');
        this.validationError = By.css('.validation-error, .field-error');
    }

    /**
     * Navigate to checkout page
     */
    async navigateToCheckout() {
        await this.navigate('/checkout');
    }

    /**
     * Fill shipping information
     * @param {Object} shippingData - Shipping information
     */
    async fillShippingInfo(shippingData) {
        if (shippingData.fullName) {
            await this.type(this.fullNameInput, shippingData.fullName);
        }
        if (shippingData.phone) {
            await this.type(this.phoneInput, shippingData.phone);
        }
        if (shippingData.address) {
            await this.type(this.addressInput, shippingData.address);
        }
        if (shippingData.city) {
            await this.type(this.cityInput, shippingData.city);
        }
        if (shippingData.province) {
            await this.selectByText(this.provinceSelect, shippingData.province);
        }
        if (shippingData.postalCode) {
            await this.type(this.postalCodeInput, shippingData.postalCode);
        }
    }

    /**
     * Select payment method
     * @param {string} method - Payment method (e.g., 'credit_card', 'paypal', 'cod')
     */
    async selectPaymentMethod(method) {
        const paymentOptions = await this.findElements(this.paymentMethodRadio);
        for (const option of paymentOptions) {
            const value = await option.getAttribute('value');
            if (value === method) {
                await option.click();
                await this.sleep(500);
                break;
            }
        }
    }

    /**
     * Fill payment information (for credit card)
     * @param {Object} paymentData - Payment information
     */
    async fillPaymentInfo(paymentData) {
        if (paymentData.cardNumber) {
            await this.type(this.cardNumberInput, paymentData.cardNumber);
        }
        if (paymentData.cardHolder) {
            await this.type(this.cardHolderInput, paymentData.cardHolder);
        }
        if (paymentData.expiryDate) {
            await this.type(this.expiryDateInput, paymentData.expiryDate);
        }
        if (paymentData.cvv) {
            await this.type(this.cvvInput, paymentData.cvv);
        }
    }

    /**
     * Get order summary details
     * @returns {Promise<Object>}
     */
    async getOrderSummary() {
        const summary = {};
        
        try {
            summary.subtotal = await this.getText(this.subtotal);
        } catch (e) {
            summary.subtotal = '0';
        }
        
        try {
            summary.shippingFee = await this.getText(this.shippingFee);
        } catch (e) {
            summary.shippingFee = '0';
        }
        
        try {
            summary.tax = await this.getText(this.tax);
        } catch (e) {
            summary.tax = '0';
        }
        
        try {
            summary.total = await this.getText(this.total);
        } catch (e) {
            summary.total = '0';
        }
        
        return summary;
    }

    /**
     * Continue to payment step
     */
    async continueToPayment() {
        await this.click(this.continueToPaymentButton);
        await this.sleep(2000);
    }

    /**
     * Place order
     */
    async placeOrder() {
        await this.click(this.placeOrderButton);
        await this.sleep(3000); // Wait for order processing
    }

    /**
     * Complete checkout process
     * @param {Object} shippingData - Shipping information
     * @param {Object} paymentData - Payment information
     */
    async completeCheckout(shippingData, paymentData) {
        await this.fillShippingInfo(shippingData);
        
        if (paymentData.method) {
            await this.selectPaymentMethod(paymentData.method);
        }
        
        // If credit card, fill payment details
        if (paymentData.method === 'credit_card' && paymentData.cardNumber) {
            await this.fillPaymentInfo(paymentData);
        }
        
        await this.placeOrder();
    }

    /**
     * Get success message
     * @returns {Promise<string>}
     */
    async getSuccessMessage() {
        try {
            await this.waitForVisible(this.successMessage, 10000);
            return await this.getText(this.successMessage);
        } catch (error) {
            return '';
        }
    }

    /**
     * Get error message
     * @returns {Promise<string>}
     */
    async getErrorMessage() {
        try {
            await this.waitForVisible(this.errorMessage, 5000);
            return await this.getText(this.errorMessage);
        } catch (error) {
            return '';
        }
    }

    /**
     * Get validation errors
     * @returns {Promise<string[]>}
     */
    async getValidationErrors() {
        try {
            const errorElements = await this.findElements(this.validationError);
            const errors = [];
            for (const element of errorElements) {
                const text = await element.getText();
                if (text) {
                    errors.push(text);
                }
            }
            return errors;
        } catch (error) {
            return [];
        }
    }

    /**
     * Go back to cart
     */
    async backToCart() {
        await this.click(this.backToCartButton);
        await this.sleep(1000);
    }

    /**
     * Check if place order button is enabled
     * @returns {Promise<boolean>}
     */
    async isPlaceOrderEnabled() {
        return await this.isEnabled(this.placeOrderButton);
    }
}

module.exports = CheckoutPage;
