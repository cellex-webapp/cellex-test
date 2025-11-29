const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

/**
 * Authentication Page Object
 * Handles login, register, and logout functionality
 */
class AuthPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Locators for Login page - Updated to match actual HTML
        this.loginEmailInput = By.css('input[placeholder*="email"], input[placeholder*="điện thoại"]');
        this.loginPasswordInput = By.css('input[placeholder*="mật khẩu"]');
        this.loginButton = By.css('button[type="submit"]');
        this.loginErrorMessage = By.css('.error-message, .alert-danger, [role="alert"]');
        
        // Google login button
        this.googleLoginButton = By.xpath('//button[contains(text(), "Google")]');
        
        // Locators for Register page - Updated to match SignupForm.tsx
        this.registerNameInput = By.css('input[placeholder="Nhập họ và tên"]');
        this.registerEmailInput = By.css('input[placeholder="Nhập email"][autocomplete="email"]');
        this.registerPhoneInput = By.css('input[placeholder="Nhập số điện thoại"][type="tel"]');
        this.registerPasswordInput = By.css('input[placeholder="Tạo mật khẩu"][autocomplete="new-password"]');
        this.registerConfirmPasswordInput = By.css('input[placeholder="Xác nhận mật khẩu"][autocomplete="new-password"]');
        this.registerButton = By.xpath('//button[@type="submit"][contains(text(), "Đăng ký")]');
        this.registerLink = By.xpath('//button[contains(text(), "Đăng ký")]');
        
        // Locators for common elements
        this.logoutButton = By.xpath('//button[contains(text(), "Đăng xuất")] | //a[contains(text(), "Đăng xuất")]');
        this.userMenuButton = By.css('[data-testid="user-menu"], .user-menu, button[aria-label*="user"]');
        this.welcomeMessage = By.css('.welcome-message, [data-testid="welcome"]');
    }

    /**
     * Navigate to login page
     */
    async navigateToLogin() {
        await this.navigate('/login');
    }

    /**
     * Navigate to register page
     */
    async navigateToRegister() {
        await this.navigate('/register');
    }

    /**
     * Perform login
     * @param {string} email - User email
     * @param {string} password - User password
     */
    async login(email, password) {
        console.log(`Attempting to login with email: ${email}`);
        
        console.log('Finding email input...');
        await this.type(this.loginEmailInput, email);
        console.log('Email entered successfully');
        
        console.log('Finding password input...');
        await this.type(this.loginPasswordInput, password);
        console.log('Password entered successfully');
        
        console.log('Finding login button...');
        // Try multiple locators for the login button
        const buttonLocators = [
            By.xpath('//button[@type="submit"][contains(text(), "Đăng nhập")]'),
            By.xpath('//button[contains(text(), "Đăng nhập")]'),
            By.css('button[type="submit"]:not([disabled])'),
            this.loginButton
        ];
        
        let buttonFound = false;
        for (const locator of buttonLocators) {
            try {
                console.log('Trying locator:', locator);
                await this.click(locator);
                console.log('Login button clicked successfully');
                buttonFound = true;
                break;
            } catch (error) {
                console.log('Failed with this locator, trying next...');
                continue;
            }
        }
        
        if (!buttonFound) {
            throw new Error('Could not find or click login button');
        }
        
        // Wait for navigation to complete
        console.log('Waiting for navigation...');
        await this.sleep(3000);
        console.log('Login process completed');
    }

    /**
     * Perform registration
     * @param {Object} userData - User registration data
     */
    async register(userData) {
        if (userData.name) {
            await this.type(this.registerNameInput, userData.name);
        }
        await this.type(this.registerEmailInput, userData.email);
        await this.type(this.registerPasswordInput, userData.password);
        if (userData.confirmPassword) {
            await this.type(this.registerConfirmPasswordInput, userData.confirmPassword);
        }
        await this.click(this.registerButton);
        // Wait for navigation to complete
        await this.sleep(2000);
    }

    /**
     * Perform logout
     */
    async logout() {
        try {
            // Try to click user menu first
            if (await this.isDisplayed(this.userMenuButton)) {
                await this.click(this.userMenuButton);
                await this.sleep(500);
            }
        } catch (error) {
            // User menu might not exist
        }
        
        await this.click(this.logoutButton);
        await this.sleep(1000);
    }

    /**
     * Check if user is logged in
     * @returns {Promise<boolean>}
     */
    async isLoggedIn() {
        console.log('Checking if user is logged in...');
        
        try {
            // Wait a bit for page to load after login
            await this.sleep(2000);
            
            // Check for authenticated user indicators
            const indicators = [
                By.xpath('//a[@href="/cart"]'),  // Cart link
                By.xpath('//a[@href="/account"]'),  // Account link
                By.css('button[aria-label*="Thông báo"]'),  // Notification button
                By.xpath('//span[contains(text(), "Giỏ hàng")]')  // Cart text
            ];
            
            for (const locator of indicators) {
                try {
                    const isDisplayed = await this.isDisplayed(locator);
                    if (isDisplayed) {
                        console.log('User is logged in - found indicator');
                        return true;
                    }
                } catch (error) {
                    // Try next indicator
                    continue;
                }
            }
            
            console.log('User is not logged in - no indicators found');
            return false;
        } catch (error) {
            console.error('Error checking login status:', error.message);
            return false;
        }
    }

    /**
     * Get login error message
     * @returns {Promise<string>}
     */
    async getLoginError() {
        try {
            await this.waitForVisible(this.loginErrorMessage, 5000);
            return await this.getText(this.loginErrorMessage);
        } catch (error) {
            return '';
        }
    }

    /**
     * Click on register link from login page
     */
    async clickRegisterLink() {
        await this.click(this.registerLink);
        await this.sleep(1000);
    }

    /**
     * Fill login form without submitting
     * @param {string} email - User email
     * @param {string} password - User password
     */
    async fillLoginForm(email, password) {
        await this.type(this.loginEmailInput, email);
        await this.type(this.loginPasswordInput, password);
    }

    /**
     * Submit login form
     */
    async submitLoginForm() {
        await this.click(this.loginButton);
        await this.sleep(2000);
    }

    /**
     * Check if login button is enabled
     * @returns {Promise<boolean>}
     */
    async isLoginButtonEnabled() {
        return await this.isEnabled(this.loginButton);
    }
}

module.exports = AuthPage;
