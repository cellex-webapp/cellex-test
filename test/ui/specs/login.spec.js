/**
 * login.spec.js
 * Sample test spec for Login functionality
 * 
 * This is a sample test file to demonstrate how to use the Page Objects
 */

const { expect } = require('chai');
const { BasePage, LoginPage } = require('../page-object');

describe('Login Page Tests', function() {
    // Set timeout for all tests in this suite
    this.timeout(10000);
    
    let driver;
    let loginPage;

    // Setup - runs before all tests
    before(async function() {
        driver = await BasePage.createDriver();
        loginPage = new LoginPage(driver);
    });

    // Teardown - runs after all tests
    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    // Reset state before each test
    beforeEach(async function() {
        await loginPage.open();
    });

    describe('UI Elements', function() {
        it('should display login form', async function() {
            const isDisplayed = await loginPage.isLoginFormDisplayed();
            expect(isDisplayed).to.be.true;
        });

        it('should have email input field', async function() {
            const isDisplayed = await loginPage.isDisplayed(loginPage.emailInput);
            expect(isDisplayed).to.be.true;
        });

        it('should have password input field', async function() {
            const isDisplayed = await loginPage.isDisplayed(loginPage.passwordInput);
            expect(isDisplayed).to.be.true;
        });

        it('should have login button', async function() {
            const buttonText = await loginPage.getLoginButtonText();
            expect(buttonText).to.include('Đăng nhập');
        });
    });

    describe('Login Functionality', function() {
        it('should show error with invalid credentials', async function() {
            await loginPage.login('invalid@email.com', 'wrongpassword');
            
            // Wait for error message
            const isErrorDisplayed = await loginPage.isErrorDisplayed();
            expect(isErrorDisplayed).to.be.true;
        });

        it('should navigate to signup page when clicking signup link', async function() {
            await loginPage.clickSignup();
            await loginPage.waitForUrlContains('/signup');
            
            const currentUrl = await loginPage.getCurrentUrl();
            expect(currentUrl).to.include('/signup');
        });

        // Uncomment and update with valid credentials to test successful login
        // it('should login successfully with valid credentials', async function() {
        //     const email = process.env.TEST_USER_EMAIL;
        //     const password = process.env.TEST_USER_PASSWORD;
        //     
        //     await loginPage.login(email, password);
        //     await loginPage.waitForLoginSuccess();
        //     
        //     const currentUrl = await loginPage.getCurrentUrl();
        //     expect(currentUrl).to.not.include('/login');
        // });
    });
});
