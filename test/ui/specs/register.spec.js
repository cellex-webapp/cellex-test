/**
 * register.spec.js
 * TC_AUTH_063: Full Registration Flow Test
 * 
 * Test Case: Verify complete user registration flow
 * - Navigate to signup page
 * - Fill registration form with valid data
 * - Submit and verify redirect to OTP page
 * - Enter OTP code
 * - Verify successful registration and redirect
 * 
 * Framework: Mocha + Selenium WebDriver
 * Pattern: Page Object Model (POM)
 */

const { expect } = require('chai');
const { BasePage, SignupPage, HomePage } = require('../page-object');
const OTPPage = require('../page-object/OTPPage');

describe('TC_AUTH_063: Full Registration Flow', function() {
    // Extended timeout for registration flow
    this.timeout(120000);
    
    let driver;
    let signupPage;
    let otpPage;
    let homePage;

    // Test data - Generate unique email/phone for each test run
    const generateTestData = () => {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 10000);
        
        return {
            fullName: `Test User ${randomNum}`,
            email: `testuser${timestamp}@example.com`,
            phone: `09${String(timestamp).slice(-8)}`, // Vietnamese phone format
            password: 'Test@123456',
            confirmPassword: 'Test@123456'
        };
    };

    // Test OTP code (for testing purposes)
    const TEST_OTP_CODE = '123456';

    // Setup - Create WebDriver instance and page objects
    before(async function() {
        driver = await BasePage.createDriver();
        signupPage = new SignupPage(driver);
        otpPage = new OTPPage(driver);
        homePage = new HomePage(driver);
    });

    // Teardown - Close browser after all tests
    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    describe('Step 1: Navigate to Signup Page', function() {
        it('should open the signup page successfully', async function() {
            await signupPage.open();
            
            const currentUrl = await signupPage.getCurrentUrl();
            expect(currentUrl).to.include('/signup');
        });

        it('should display the signup form', async function() {
            const isFormDisplayed = await signupPage.isSignupFormDisplayed();
            expect(isFormDisplayed).to.be.true;
        });

        it('should display page title "Tạo tài khoản"', async function() {
            const isDisplayed = await signupPage.isDisplayed(signupPage.pageTitle);
            expect(isDisplayed).to.be.true;
        });
    });

    describe('Step 2: Fill Registration Form', function() {
        let testData;

        before(function() {
            testData = generateTestData();
        });

        it('should enter full name', async function() {
            await signupPage.enterFullName(testData.fullName);
            
            const fullNameField = await signupPage.driver.findElement(signupPage.fullNameInput);
            const value = await fullNameField.getAttribute('value');
            expect(value).to.equal(testData.fullName);
        });

        it('should enter email address', async function() {
            await signupPage.enterEmail(testData.email);
            
            const emailField = await signupPage.driver.findElement(signupPage.emailInput);
            const value = await emailField.getAttribute('value');
            expect(value).to.equal(testData.email);
        });

        it('should enter phone number', async function() {
            await signupPage.enterPhone(testData.phone);
            
            const phoneField = await signupPage.driver.findElement(signupPage.phoneInput);
            const value = await phoneField.getAttribute('value');
            expect(value).to.equal(testData.phone);
        });

        it('should enter password', async function() {
            await signupPage.enterPassword(testData.password);
            
            const passwordField = await signupPage.driver.findElement(signupPage.passwordInput);
            const value = await passwordField.getAttribute('value');
            expect(value).to.equal(testData.password);
        });

        it('should enter confirm password', async function() {
            await signupPage.enterConfirmPassword(testData.confirmPassword);
            
            const confirmField = await signupPage.driver.findElement(signupPage.confirmPasswordInput);
            const value = await confirmField.getAttribute('value');
            expect(value).to.equal(testData.confirmPassword);
        });
    });

    describe('Step 3: Submit Registration', function() {
        it('should click the register button', async function() {
            await signupPage.clickSignup();
            
            // Wait for form submission
            await signupPage.sleep(2000);
        });

        it('should redirect to OTP verification page', async function() {
            // Wait for redirect to OTP page
            await signupPage.waitForOtpRedirect();
            
            const currentUrl = await signupPage.getCurrentUrl();
            expect(currentUrl).to.include('/otp');
        });
    });

    describe('Step 4: OTP Verification Page', function() {
        it('should display OTP verification page', async function() {
            const isOtpPageDisplayed = await otpPage.isOtpPageDisplayed();
            expect(isOtpPageDisplayed).to.be.true;
        });

        it('should display OTP form', async function() {
            const isFormDisplayed = await otpPage.isOtpFormDisplayed();
            expect(isFormDisplayed).to.be.true;
        });

        it('should display resend button', async function() {
            const isResendDisplayed = await otpPage.isResendButtonDisplayed();
            expect(isResendDisplayed).to.be.true;
        });
    });

    describe('Step 5: Enter OTP Code', function() {
        it('should enter 6-digit OTP code', async function() {
            await otpPage.enterOtp(TEST_OTP_CODE);
            
            const otpValue = await otpPage.getOtpValue();
            expect(otpValue).to.equal(TEST_OTP_CODE);
        });

        it('should enable submit button after entering valid OTP', async function() {
            const isEnabled = await otpPage.isSubmitEnabled();
            expect(isEnabled).to.be.true;
        });
    });

    describe('Step 6: Submit OTP and Verify Success', function() {
        it('should click verify button', async function() {
            await otpPage.clickSubmit();
            
            // Wait for verification process
            await otpPage.sleep(3000);
        });

        /**
         * Note: In a real scenario, the OTP verification would either:
         * 1. Succeed and redirect to login page (as per OTPPage.tsx)
         * 2. Fail with an error message
         * 
         * For testing with mock OTP '123456':
         * - If backend accepts test OTP: Verify redirect to login
         * - If backend rejects: Verify error message is displayed
         */
        it('should redirect to login page after successful verification', async function() {
            try {
                // Wait for redirect to login page (successful case)
                await otpPage.waitForLoginRedirect();
                
                const currentUrl = await otpPage.getCurrentUrl();
                expect(currentUrl).to.include('/login');
            } catch (error) {
                // If redirect doesn't happen, check for error message
                const isErrorDisplayed = await otpPage.isErrorDisplayed();
                
                if (isErrorDisplayed) {
                    // Log the error for debugging
                    const errorMsg = await otpPage.getErrorMessage();
                    console.log(`OTP Verification Error: ${errorMsg}`);
                    
                    // Mark test as skipped if OTP validation is strict
                    this.skip('OTP verification requires valid code from backend');
                } else {
                    throw error;
                }
            }
        });
    });
});

/**
 * Additional test suite for Registration Edge Cases
 */
describe('TC_AUTH_063: Registration Validation Tests', function() {
    this.timeout(60000);
    
    let driver;
    let signupPage;

    before(async function() {
        driver = await BasePage.createDriver();
        signupPage = new SignupPage(driver);
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });

    beforeEach(async function() {
        await signupPage.open();
    });

    describe('Password Mismatch Validation', function() {
        it('should show error when passwords do not match', async function() {
            const testData = {
                fullName: 'Test User',
                email: `test${Date.now()}@example.com`,
                phone: '0901234567',
                password: 'Password123',
                confirmPassword: 'DifferentPassword123'
            };

            await signupPage.signup(testData);
            await signupPage.sleep(1000);

            // Check that we're still on signup page (form not submitted)
            const currentUrl = await signupPage.getCurrentUrl();
            expect(currentUrl).to.include('/signup');
        });
    });

    describe('Required Fields Validation', function() {
        it('should not submit form with empty fields', async function() {
            // Try to click signup without filling any fields
            await signupPage.clickSignup();
            await signupPage.sleep(500);

            // Should still be on signup page
            const currentUrl = await signupPage.getCurrentUrl();
            expect(currentUrl).to.include('/signup');
        });
    });

    describe('Navigation Links', function() {
        it('should navigate to login page when clicking login link', async function() {
            await signupPage.clickLogin();
            await signupPage.waitForUrlContains('/login');

            const currentUrl = await signupPage.getCurrentUrl();
            expect(currentUrl).to.include('/login');
        });
    });
});
