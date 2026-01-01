/**
 * SignupPage.js
 * Page Object for Signup/Registration Page
 * 
 * Mapped from: cellex-web/src/features/auth/components/SignupForm.tsx
 * 
 * Elements identified:
 * - Full name input: placeholder="Nhập họ và tên"
 * - Email input: placeholder="Nhập email"
 * - Phone input: placeholder="Nhập số điện thoại"
 * - Password input: placeholder="Tạo mật khẩu"
 * - Confirm password input: placeholder="Xác nhận mật khẩu"
 * - Submit button: contains "Đăng ký"
 * - Login link: contains "Đăng nhập"
 */

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class SignupPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Page URL
        this.url = '/signup';
        
        // ============================================
        // LOCATORS - Based on SignupForm.tsx analysis
        // ============================================
        
        // Form container
        this.signupForm = By.css('form.w-full.max-w-sm');
        
        // Full name input
        // From: <input type="text" placeholder="Nhập họ và tên" />
        this.fullNameInput = By.css('input[placeholder="Nhập họ và tên"]');
        
        // Email input
        // From: <input type="text" placeholder="Nhập email" />
        this.emailInput = By.css('input[placeholder="Nhập email"]');
        
        // Phone number input
        // From: <input type="tel" placeholder="Nhập số điện thoại" />
        this.phoneInput = By.css('input[placeholder="Nhập số điện thoại"]');
        
        // Password input
        // From: <input type="password" placeholder="Tạo mật khẩu" />
        this.passwordInput = By.css('input[placeholder="Tạo mật khẩu"]');
        
        // Confirm password input
        // From: <input type="password" placeholder="Xác nhận mật khẩu" />
        this.confirmPasswordInput = By.css('input[placeholder="Xác nhận mật khẩu"]');
        
        // Toggle password visibility buttons
        this.togglePasswordBtn = By.xpath('(//button[@aria-label])[1]');
        this.toggleConfirmPasswordBtn = By.xpath('(//button[@aria-label])[2]');
        
        // Signup submit button
        // From: <button type="submit">Đăng ký</button>
        this.signupButton = By.css('button[type="submit"]');
        
        // Login link (already have account)
        this.loginLink = By.xpath('//button[contains(text(), "Đăng nhập")]');
        
        // Page title
        this.pageTitle = By.xpath('//h2[contains(text(), "Tạo tài khoản")]');
        
        // Error message
        this.errorMessage = By.css('.text-red-500');
        
        // Ant Design error message
        this.antErrorMessage = By.css('.ant-message-error');
    }

    /**
     * Navigate to signup page
     */
    async open() {
        await this.navigate(this.url);
        await this.waitForElement(this.signupForm);
    }

    /**
     * Enter full name
     * @param {string} fullName - Full name to enter
     */
    async enterFullName(fullName) {
        await this.type(this.fullNameInput, fullName);
    }

    /**
     * Enter email
     * @param {string} email - Email to enter
     */
    async enterEmail(email) {
        await this.type(this.emailInput, email);
    }

    /**
     * Enter phone number
     * @param {string} phone - Phone number to enter
     */
    async enterPhone(phone) {
        await this.type(this.phoneInput, phone);
    }

    /**
     * Enter password
     * @param {string} password - Password to enter
     */
    async enterPassword(password) {
        await this.type(this.passwordInput, password);
    }

    /**
     * Enter confirm password
     * @param {string} confirmPassword - Confirm password to enter
     */
    async enterConfirmPassword(confirmPassword) {
        await this.type(this.confirmPasswordInput, confirmPassword);
    }

    /**
     * Click signup button
     */
    async clickSignup() {
        await this.click(this.signupButton);
    }

    /**
     * Perform complete signup action
     * @param {Object} userData - User registration data
     * @param {string} userData.fullName - Full name
     * @param {string} userData.email - Email address
     * @param {string} userData.phone - Phone number
     * @param {string} userData.password - Password
     * @param {string} userData.confirmPassword - Confirm password
     */
    async signup({ fullName, email, phone, password, confirmPassword }) {
        await this.enterFullName(fullName);
        await this.enterEmail(email);
        await this.enterPhone(phone);
        await this.enterPassword(password);
        await this.enterConfirmPassword(confirmPassword || password);
        await this.clickSignup();
    }

    /**
     * Click login link
     */
    async clickLogin() {
        await this.click(this.loginLink);
    }

    /**
     * Check if signup form is displayed
     * @returns {Promise<boolean>}
     */
    async isSignupFormDisplayed() {
        return await this.isDisplayed(this.signupForm);
    }

    /**
     * Check if error message is displayed
     * @returns {Promise<boolean>}
     */
    async isErrorDisplayed() {
        await this.sleep(500);
        const inlineError = await this.isDisplayed(this.errorMessage);
        const antError = await this.isDisplayed(this.antErrorMessage);
        return inlineError || antError;
    }

    /**
     * Get error message text
     * @returns {Promise<string>}
     */
    async getErrorMessage() {
        await this.sleep(500);
        if (await this.isDisplayed(this.errorMessage)) {
            return await this.getText(this.errorMessage);
        }
        if (await this.isDisplayed(this.antErrorMessage)) {
            return await this.getText(this.antErrorMessage);
        }
        return '';
    }

    /**
     * Get signup button text
     * @returns {Promise<string>}
     */
    async getSignupButtonText() {
        return await this.getText(this.signupButton);
    }

    /**
     * Wait for redirect to OTP page after successful signup
     */
    async waitForOtpRedirect() {
        await this.waitForUrlContains('/otp');
    }
}

module.exports = SignupPage;
