/**
 * LoginPage.js
 * Page Object for Login Page
 * 
 * Mapped from: cellex-web/src/features/auth/components/LoginForm.tsx
 * 
 * Elements identified:
 * - Email/Phone input: type="text", placeholder="Nhập email hoặc số điện thoại"
 * - Password input: type="password", placeholder="Nhập mật khẩu"
 * - Submit button: type="submit", contains "Đăng nhập"
 * - Forgot password link: contains "Quên mật khẩu?"
 * - Signup link: contains "Đăng ký"
 */

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Page URL
        this.url = '/login';
        
        // ============================================
        // LOCATORS - Based on LoginForm.tsx analysis
        // ============================================
        
        // Form container
        this.loginForm = By.css('form.w-full.max-w-sm');
        
        // Email/Phone input field
        // From: <input type="text" placeholder="Nhập email hoặc số điện thoại" />
        this.emailInput = By.css('input[placeholder="Nhập email hoặc số điện thoại"]');
        
        // Password input field  
        // From: <input type="password" placeholder="Nhập mật khẩu" />
        this.passwordInput = By.css('input[placeholder="Nhập mật khẩu"]');
        
        // Show/Hide password toggle button
        this.togglePasswordBtn = By.css('button[aria-label*="mật khẩu"]');
        
        // Login submit button
        // From: <button type="submit">Đăng nhập</button>
        this.loginButton = By.css('button[type="submit"]');
        
        // Forgot password link
        this.forgotPasswordLink = By.xpath('//button[contains(text(), "Quên mật khẩu")]');
        
        // Signup link
        this.signupLink = By.xpath('//button[contains(text(), "Đăng ký")]');
        
        // Page title/header
        this.pageTitle = By.xpath('//h2[contains(text(), "Đăng nhập")]');
        
        // Error message (from Ant Design message component)
        this.errorMessage = By.css('.ant-message-error');
        
        // Loading spinner on button
        this.loadingSpinner = By.css('button[type="submit"] svg.animate-spin');
    }

    /**
     * Navigate to login page
     */
    async open() {
        await this.navigate(this.url);
        await this.waitForElement(this.loginForm);
    }

    /**
     * Enter email or phone number
     * @param {string} email - Email or phone to enter
     */
    async enterEmail(email) {
        await this.type(this.emailInput, email);
    }

    /**
     * Enter password
     * @param {string} password - Password to enter
     */
    async enterPassword(password) {
        await this.type(this.passwordInput, password);
    }

    /**
     * Click login button
     */
    async clickLogin() {
        await this.click(this.loginButton);
    }

    /**
     * Perform complete login action
     * @param {string} email - Email or phone
     * @param {string} password - Password
     */
    async login(email, password) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickLogin();
    }

    /**
     * Click forgot password link
     */
    async clickForgotPassword() {
        await this.click(this.forgotPasswordLink);
    }

    /**
     * Click signup link
     */
    async clickSignup() {
        await this.click(this.signupLink);
    }

    /**
     * Toggle password visibility
     */
    async togglePasswordVisibility() {
        await this.click(this.togglePasswordBtn);
    }

    /**
     * Check if login form is displayed
     * @returns {Promise<boolean>}
     */
    async isLoginFormDisplayed() {
        return await this.isDisplayed(this.loginForm);
    }

    /**
     * Check if error message is displayed
     * @returns {Promise<boolean>}
     */
    async isErrorDisplayed() {
        await this.sleep(1000); // Wait for message to appear
        return await this.isDisplayed(this.errorMessage);
    }

    /**
     * Get error message text
     * @returns {Promise<string>}
     */
    async getErrorMessage() {
        await this.sleep(1000);
        return await this.getText(this.errorMessage);
    }

    /**
     * Check if loading spinner is visible
     * @returns {Promise<boolean>}
     */
    async isLoading() {
        return await this.isDisplayed(this.loadingSpinner);
    }

    /**
     * Get login button text
     * @returns {Promise<string>}
     */
    async getLoginButtonText() {
        return await this.getText(this.loginButton);
    }

    /**
     * Wait for successful login (redirect away from login page)
     */
    async waitForLoginSuccess() {
        await this.driver.wait(async () => {
            const url = await this.getCurrentUrl();
            return !url.includes('/login');
        }, this.timeout);
    }
}

module.exports = LoginPage;
