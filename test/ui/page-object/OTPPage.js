/**
 * OTPPage.js
 * Page Object for OTP Verification Page
 * 
 * Mapped from: cellex-web/src/features/auth/pages/OTPPage.tsx
 *              cellex-web/src/features/auth/components/OTPForm.tsx
 * 
 * Elements identified:
 * - OTP input fields: 6 individual input fields using react-otp-input
 * - Submit button: "Xác thực" or "Đang xác thực..."
 * - Resend button: "Gửi lại"
 * - Error message display
 * - Page title: "Xác thực OTP"
 */

const { By, Key } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class OTPPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Page URL
        this.url = '/otp';
        
        // ============================================
        // LOCATORS - Based on OTPPage.tsx and OTPForm.tsx analysis
        // ============================================
        
        // Main container
        this.mainContainer = By.css('.min-h-screen');
        
        // Page title
        // From: <h2>Xác thực OTP</h2>
        this.pageTitle = By.xpath('//h2[contains(text(), "Xác thực OTP")]');
        
        // OTP description text
        this.otpDescription = By.xpath('//*[contains(text(), "Nhập mã 6 số")]');
        
        // OTP Form
        this.otpForm = By.css('form.w-full.max-w-sm');
        
        // OTP Input container (react-otp-input creates 6 individual inputs)
        // From: <OtpInput numInputs={6} ... />
        this.otpInputContainer = By.css('.flex.justify-center');
        
        // Individual OTP input fields (6 inputs)
        this.otpInputs = By.css('.flex.justify-center input');
        
        // First OTP input (for focusing)
        this.firstOtpInput = By.css('.flex.justify-center input:first-child');
        
        // OTP Label
        this.otpLabel = By.xpath('//label[contains(text(), "Mã xác thực")]');
        
        // Submit/Verify button
        // From: <button type="submit">Xác thực</button>
        this.submitButton = By.css('button[type="submit"]');
        
        // Resend OTP button
        // From: <button type="button" onClick={onResend}>Gửi lại</button>
        this.resendButton = By.xpath('//button[contains(text(), "Gửi lại")]');
        
        // "Không nhận được mã?" text
        this.resendPrompt = By.xpath('//*[contains(text(), "Không nhận được mã")]');
        
        // Error message
        // From: {error && <p className="text-red-500 ...">
        this.errorMessage = By.css('.text-red-500');
        
        // Ant Design message (for alerts)
        this.alertMessage = By.css('.ant-message');
        this.successMessage = By.css('.ant-message-success');
        
        // Loading state indicator
        this.loadingButton = By.xpath('//button[contains(text(), "Đang xác thực")]');
    }

    /**
     * Navigate to OTP page
     */
    async open() {
        await this.navigate(this.url);
        await this.sleep(1000);
    }

    /**
     * Check if OTP page is displayed
     * @returns {Promise<boolean>}
     */
    async isOtpPageDisplayed() {
        return await this.isDisplayed(this.pageTitle);
    }

    /**
     * Check if OTP form is displayed
     * @returns {Promise<boolean>}
     */
    async isOtpFormDisplayed() {
        return await this.isDisplayed(this.otpForm);
    }

    /**
     * Enter OTP code digit by digit
     * This handles the react-otp-input component which has 6 separate inputs
     * @param {string} otpCode - 6-digit OTP code
     */
    async enterOtp(otpCode) {
        if (!otpCode || otpCode.length !== 6) {
            throw new Error('OTP code must be exactly 6 digits');
        }

        // Get all OTP input fields
        const inputs = await this.driver.findElements(this.otpInputs);
        
        if (inputs.length >= 6) {
            // Enter each digit into its respective input
            for (let i = 0; i < 6; i++) {
                await inputs[i].clear();
                await inputs[i].sendKeys(otpCode[i]);
                await this.sleep(100); // Small delay between inputs
            }
        } else {
            // Fallback: Try to find and use the first input
            // Some OTP components accept full paste
            const firstInput = await this.waitForElement(this.firstOtpInput);
            await firstInput.click();
            
            // Type each character
            for (const digit of otpCode) {
                await firstInput.sendKeys(digit);
                await this.sleep(100);
            }
        }
    }

    /**
     * Clear all OTP inputs
     */
    async clearOtp() {
        const inputs = await this.driver.findElements(this.otpInputs);
        for (const input of inputs) {
            await input.clear();
        }
    }

    /**
     * Get the current OTP value
     * @returns {Promise<string>} - Combined OTP value
     */
    async getOtpValue() {
        const inputs = await this.driver.findElements(this.otpInputs);
        let otp = '';
        for (const input of inputs) {
            const value = await input.getAttribute('value');
            otp += value || '';
        }
        return otp;
    }

    /**
     * Click submit/verify button
     */
    async clickSubmit() {
        await this.click(this.submitButton);
    }

    /**
     * Click resend OTP button
     */
    async clickResend() {
        await this.click(this.resendButton);
    }

    /**
     * Submit OTP code
     * @param {string} otpCode - 6-digit OTP code
     */
    async submitOtp(otpCode) {
        await this.enterOtp(otpCode);
        await this.sleep(300);
        await this.clickSubmit();
    }

    /**
     * Check if submit button is enabled
     * @returns {Promise<boolean>}
     */
    async isSubmitEnabled() {
        const button = await this.waitForElement(this.submitButton);
        const disabled = await button.getAttribute('disabled');
        return disabled !== 'true';
    }

    /**
     * Check if page is loading (submitting)
     * @returns {Promise<boolean>}
     */
    async isLoading() {
        return await this.isDisplayed(this.loadingButton);
    }

    /**
     * Get submit button text
     * @returns {Promise<string>}
     */
    async getSubmitButtonText() {
        return await this.getText(this.submitButton);
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
        if (await this.isDisplayed(this.errorMessage)) {
            return await this.getText(this.errorMessage);
        }
        return '';
    }

    /**
     * Check if success message/alert is displayed
     * @returns {Promise<boolean>}
     */
    async isSuccessDisplayed() {
        await this.sleep(1000);
        return await this.isDisplayed(this.successMessage);
    }

    /**
     * Wait for redirect to login page after successful verification
     */
    async waitForLoginRedirect() {
        await this.waitForUrlContains('/login');
    }

    /**
     * Wait for redirect to home page (if applicable)
     */
    async waitForHomeRedirect() {
        await this.driver.wait(async () => {
            const url = await this.getCurrentUrl();
            return url.endsWith('/') || url.includes('/home');
        }, this.timeout);
    }

    /**
     * Get page title text
     * @returns {Promise<string>}
     */
    async getPageTitle() {
        return await this.getText(this.pageTitle);
    }

    /**
     * Check if resend button is displayed
     * @returns {Promise<boolean>}
     */
    async isResendButtonDisplayed() {
        return await this.isDisplayed(this.resendButton);
    }
}

module.exports = OTPPage;
