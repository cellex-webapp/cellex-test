/**
 * auth_validation.spec.js
 * Group 1: Authentication & Account Validation (40 Cases)
 * 
 * Data-Driven API Testing for Cellex E-commerce Application
 * Tests validation logic and error codes as defined in SRS & ErrorCode.java
 * 
 * Framework: Mocha + Chai + Axios
 * Pattern: Data-Driven Testing
 * 
 * Error Codes Reference (from backend ErrorCode.java):
 * - 1002: USER_EXISTED - "Người dùng đã tồn tại"
 * - 1003: USERNAME_INVALID - "Tên đăng nhập phải có ít nhất 3 ký tự"  
 * - 1004: PASSWORD_INVALID - "Mật khẩu phải có ít nhất 8 ký tự"
 * - 1005: USER_NOT_FOUND - "Không tìm thấy email hoặc mật khẩu"
 * - 1006: UNAUTHENTICATED - "Email hoặc mật khẩu không chính xác"
 * - 1008: PASSWORDS_DO_NOT_MATCH - "Mật khẩu nhập lại không khớp"
 * - 5004: INVALID_EMAIL_FORMAT - "Định dạng email không hợp lệ"
 * - 6001: ACCOUNT_BANNED - "Tài khoản đã bị khóa"
 */

const { expect } = require('chai');
const { apiClient, clearAuthToken } = require('../helpers/apiClient');
require('dotenv').config();

// ============================================
// TEST DATA: 40 Authentication Validation Cases
// ============================================

const authTestData = [
    // ========================================
    // GROUP 1: Email Format Validation (TC_AUTH_001-015)
    // Expected Error: 1003 (USERNAME_INVALID) or 400/5004 (validation error)
    // ========================================
    {
        id: 'TC_AUTH_001',
        group: 'Email Format',
        description: 'Empty email field',
        endpoint: '/auth/login',
        payload: { email: '', password: 'ValidPass123' },
        expectedCode: 1003,
        expectedMessage: 'Tên đăng nhập phải có ít nhất 3 ký tự'
    },
    {
        id: 'TC_AUTH_002',
        group: 'Email Format',
        description: 'Email with only whitespace',
        endpoint: '/auth/login',
        payload: { email: '   ', password: 'ValidPass123' },
        expectedCode: 1003,
        expectedMessage: 'Tên đăng nhập phải có ít nhất 3 ký tự'
    },
    {
        id: 'TC_AUTH_003',
        group: 'Email Format',
        description: 'Email without @ symbol',
        endpoint: '/auth/login',
        payload: { email: 'invalidemail.com', password: 'ValidPass123' },
        expectedCode: 1003,
        expectedMessage: 'Tên đăng nhập phải có ít nhất 3 ký tự'
    },
    {
        id: 'TC_AUTH_004',
        group: 'Email Format',
        description: 'Email without domain',
        endpoint: '/auth/login',
        payload: { email: 'test@', password: 'ValidPass123' },
        expectedCode: 1003,
        expectedMessage: 'Tên đăng nhập phải có ít nhất 3 ký tự'
    },
    {
        id: 'TC_AUTH_005',
        group: 'Email Format',
        description: 'Email without local part',
        endpoint: '/auth/login',
        payload: { email: '@gmail.com', password: 'ValidPass123' },
        expectedCode: 1003,
        expectedMessage: 'Tên đăng nhập phải có ít nhất 3 ký tự'
    },
    {
        id: 'TC_AUTH_006',
        group: 'Email Format',
        description: 'Email with multiple @ symbols',
        endpoint: '/auth/login',
        payload: { email: 'test@@gmail.com', password: 'ValidPass123' },
        expectedCode: 1003,
        expectedMessage: 'Tên đăng nhập phải có ít nhất 3 ký tự'
    },
    {
        id: 'TC_AUTH_007',
        group: 'Email Format',
        description: 'Email with special characters only',
        endpoint: '/auth/login',
        payload: { email: '!#$%^&*()', password: 'ValidPass123' },
        expectedCode: 1003,
        expectedMessage: 'Tên đăng nhập phải có ít nhất 3 ký tự'
    },
    {
        id: 'TC_AUTH_008',
        group: 'Email Format',
        description: 'Email too short (less than 3 chars)',
        endpoint: '/auth/login',
        payload: { email: 'a@', password: 'ValidPass123' },
        expectedCode: 1003,
        expectedMessage: 'Tên đăng nhập phải có ít nhất 3 ký tự'
    },
    {
        id: 'TC_AUTH_009',
        group: 'Email Format',
        description: 'Email with spaces in local part',
        endpoint: '/auth/login',
        payload: { email: 'test user@gmail.com', password: 'ValidPass123' },
        expectedCode: 1003,
        expectedMessage: 'Tên đăng nhập phải có ít nhất 3 ký tự'
    },
    {
        id: 'TC_AUTH_010',
        group: 'Email Format',
        description: 'Email with invalid TLD',
        endpoint: '/auth/login',
        payload: { email: 'test@gmail', password: 'ValidPass123' },
        expectedCode: 1003,
        expectedMessage: 'Tên đăng nhập phải có ít nhất 3 ký tự'
    },
    {
        id: 'TC_AUTH_011',
        group: 'Email Format',
        description: 'Null email value',
        endpoint: '/auth/login',
        payload: { email: null, password: 'ValidPass123' },
        expectedCode: 1003,
        expectedStatus: 400
    },
    {
        id: 'TC_AUTH_012',
        group: 'Email Format',
        description: 'Email with leading/trailing spaces',
        endpoint: '/auth/login',
        payload: { email: '  test@gmail.com  ', password: 'ValidPass123' },
        expectedCode: 1005,
        expectedMessage: 'Email hoặc mật khẩu không hợp lệ.'
    },
    {
        id: 'TC_AUTH_013',
        group: 'Email Format',
        description: 'Email with Unicode characters',
        endpoint: '/auth/login',
        payload: { email: 'tëst@gmail.com', password: 'ValidPass123' },
        expectedCode: 1003,
        expectedMessage: 'Tên đăng nhập phải có ít nhất 3 ký tự'
    },
    {
        id: 'TC_AUTH_014',
        group: 'Email Format',
        description: 'Missing email field entirely',
        endpoint: '/auth/login',
        payload: { password: 'ValidPass123' },
        expectedStatus: 400
    },
    {
        id: 'TC_AUTH_015',
        group: 'Email Format',
        description: 'Email with consecutive dots',
        endpoint: '/auth/login',
        payload: { email: 'test..user@gmail.com', password: 'ValidPass123' },
        expectedCode: 1003,
        expectedMessage: 'Tên đăng nhập phải có ít nhất 3 ký tự'
    },

    // ========================================
    // GROUP 2: Password Format Validation (TC_AUTH_024-035)
    // Expected Error: 1004 (PASSWORD_INVALID)
    // ========================================
    {
        id: 'TC_AUTH_024',
        group: 'Password Format',
        description: 'Empty password field',
        endpoint: '/auth/login',
        payload: { email: 'test@gmail.com', password: '' },
        expectedCode: 1004,
        expectedMessage: 'Mật khẩu không hợp lệ'
    },
    {
        id: 'TC_AUTH_025',
        group: 'Password Format',
        description: 'Password with only whitespace',
        endpoint: '/auth/login',
        payload: { email: 'test@gmail.com', password: '        ' },
        expectedCode: 1004,
        expectedMessage: 'Mật khẩu không hợp lệ'
    },
    {
        id: 'TC_AUTH_026',
        group: 'Password Format',
        description: 'Password too short (1 char)',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: `test${Date.now()}@gmail.com`, 
            fullName: 'Test User',
            phoneNumber: '0987654321',
            password: 'a', 
            confirmPassword: 'a' 
        },
        expectedCode: 1004,
        expectedMessage: 'Mật khẩu không hợp lệ'
    },
    {
        id: 'TC_AUTH_027',
        group: 'Password Format',
        description: 'Password too short (7 chars - boundary)',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: `test${Date.now()}@gmail.com`, 
            fullName: 'Test User',
            phoneNumber: '0987654321',
            password: 'Pass123', 
            confirmPassword: 'Pass123' 
        },
        expectedCode: 1004,
        expectedMessage: 'Mật khẩu không hợp lệ'
    },
    {
        id: 'TC_AUTH_028',
        group: 'Password Format',
        description: 'Password exactly 8 chars (valid boundary)',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: `testvalid${Date.now()}@gmail.com`, 
            fullName: 'Test User',
            phoneNumber: '0987654321',
            password: 'Pass1234', 
            confirmPassword: 'Pass1234' 
        },
        expectedCode: null, // Should pass validation (may fail on other logic)
        shouldSucceed: true
    },
    {
        id: 'TC_AUTH_029',
        group: 'Password Format',
        description: 'Password 5 chars',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: `test${Date.now()}@gmail.com`, 
            fullName: 'Test User',
            phoneNumber: '0987654321',
            password: 'Pa123', 
            confirmPassword: 'Pa123' 
        },
        expectedCode: 1004,
        expectedMessage: 'Mật khẩu không hợp lệ'
    },
    {
        id: 'TC_AUTH_030',
        group: 'Password Format',
        description: 'Null password value',
        endpoint: '/auth/login',
        payload: { email: 'test@gmail.com', password: null },
        expectedCode: 1004,
        expectedStatus: 400
    },
    {
        id: 'TC_AUTH_031',
        group: 'Password Format',
        description: 'Missing password field entirely',
        endpoint: '/auth/login',
        payload: { email: 'test@gmail.com' },
        expectedStatus: 400
    },
    {
        id: 'TC_AUTH_032',
        group: 'Password Format',
        description: 'Password with only special characters (short)',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: `test${Date.now()}@gmail.com`, 
            fullName: 'Test User',
            phoneNumber: '0987654321',
            password: '!@#$%', 
            confirmPassword: '!@#$%' 
        },
        expectedCode: 1004,
        expectedMessage: 'Mật khẩu không hợp lệ'
    },
    {
        id: 'TC_AUTH_033',
        group: 'Password Format',
        description: 'Password with only numbers (short)',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: `test${Date.now()}@gmail.com`, 
            fullName: 'Test User',
            phoneNumber: '0987654321',
            password: '123456', 
            confirmPassword: '123456' 
        },
        expectedCode: 1004,
        expectedMessage: 'Mật khẩu không hợp lệ'
    },
    {
        id: 'TC_AUTH_034',
        group: 'Password Format',
        description: 'Password 6 chars',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: `test${Date.now()}@gmail.com`, 
            fullName: 'Test User',
            phoneNumber: '0987654321',
            password: 'Pass12', 
            confirmPassword: 'Pass12' 
        },
        expectedCode: 1004,
        expectedMessage: 'Mật khẩu không hợp lệ'
    },
    {
        id: 'TC_AUTH_035',
        group: 'Password Format',
        description: 'Very long password (>100 chars)',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: `test${Date.now()}@gmail.com`, 
            fullName: 'Test User',
            phoneNumber: '0987654321',
            password: 'A'.repeat(150), 
            confirmPassword: 'A'.repeat(150) 
        },
        expectedStatus: 400 // May fail on length constraint
    },

    // ========================================
    // GROUP 3: Confirm Password Validation (TC_AUTH_045-050)
    // Expected Error: 1008 (PASSWORDS_DO_NOT_MATCH)
    // ========================================
    {
        id: 'TC_AUTH_045',
        group: 'Confirm Password',
        description: 'Passwords do not match (different values)',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: `test${Date.now()}@gmail.com`, 
            fullName: 'Test User',
            phoneNumber: '0987654321',
            password: 'Password123', 
            confirmPassword: 'Password456' 
        },
        expectedCode: 1008,
        expectedMessage: 'Mật khẩu xác nhận không trùng khớp'
    },
    {
        id: 'TC_AUTH_046',
        group: 'Confirm Password',
        description: 'Confirm password empty while password has value',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: `test${Date.now()}@gmail.com`, 
            fullName: 'Test User',
            phoneNumber: '0987654321',
            password: 'Password123', 
            confirmPassword: '' 
        },
        expectedCode: 1008,
        expectedMessage: 'Mật khẩu xác nhận không trùng khớp'
    },
    {
        id: 'TC_AUTH_047',
        group: 'Confirm Password',
        description: 'Case sensitivity test - different case',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: `test${Date.now()}@gmail.com`, 
            fullName: 'Test User',
            phoneNumber: '0987654321',
            password: 'Password123', 
            confirmPassword: 'PASSWORD123' 
        },
        expectedCode: 1008,
        expectedMessage: 'Mật khẩu xác nhận không trùng khớp'
    },
    {
        id: 'TC_AUTH_048',
        group: 'Confirm Password',
        description: 'Confirm password with extra space',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: `test${Date.now()}@gmail.com`, 
            fullName: 'Test User',
            phoneNumber: '0987654321',
            password: 'Password123', 
            confirmPassword: 'Password123 ' 
        },
        expectedCode: 1008,
        expectedMessage: 'Mật khẩu xác nhận không trùng khớp'
    },
    {
        id: 'TC_AUTH_049',
        group: 'Confirm Password',
        description: 'Confirm password with leading space',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: `test${Date.now()}@gmail.com`, 
            fullName: 'Test User',
            phoneNumber: '0987654321',
            password: 'Password123', 
            confirmPassword: ' Password123' 
        },
        expectedCode: 1008,
        expectedMessage: 'Mật khẩu xác nhận không trùng khớp'
    },
    {
        id: 'TC_AUTH_050',
        group: 'Confirm Password',
        description: 'Null confirm password',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: `test${Date.now()}@gmail.com`, 
            fullName: 'Test User',
            phoneNumber: '0987654321',
            password: 'Password123', 
            confirmPassword: null 
        },
        expectedStatus: 400
    },

    // ========================================
    // GROUP 4: Existing Email Validation (TC_AUTH_056-061)
    // Expected Error: 1002 (USER_EXISTED)
    // ========================================
    {
        id: 'TC_AUTH_056',
        group: 'Existing Email',
        description: 'Register with existing admin email',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: 'admin@gmail.com', // Known existing email
            fullName: 'Test Admin',
            phoneNumber: '0987654321',
            password: 'Password123', 
            confirmPassword: 'Password123' 
        },
        expectedCode: 1002,
        expectedMessage: 'Email này đã được đăng ký trong hệ thống'
    },
    {
        id: 'TC_AUTH_057',
        group: 'Existing Email',
        description: 'Register with existing user email',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: 'user@gmail.com', // Known existing email from .env
            fullName: 'Test User',
            phoneNumber: '0987654321',
            password: 'Password123', 
            confirmPassword: 'Password123' 
        },
        expectedCode: 1002,
        expectedMessage: 'Email này đã được đăng ký trong hệ thống'
    },
    {
        id: 'TC_AUTH_058',
        group: 'Existing Email',
        description: 'Register with existing email - case insensitive test',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: 'ADMIN@GMAIL.COM', // Upper case of existing email
            fullName: 'Test Admin',
            phoneNumber: '0987654321',
            password: 'Password123', 
            confirmPassword: 'Password123' 
        },
        expectedCode: 1002,
        expectedMessage: 'Email này đã được đăng ký trong hệ thống'
    },
    {
        id: 'TC_AUTH_059',
        group: 'Existing Email',
        description: 'Register with existing email - mixed case',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: 'Admin@Gmail.Com',
            fullName: 'Test Admin',
            phoneNumber: '0987654321',
            password: 'Password123', 
            confirmPassword: 'Password123' 
        },
        expectedCode: 1002,
        expectedMessage: 'Email này đã được đăng ký trong hệ thống'
    },
    {
        id: 'TC_AUTH_060',
        group: 'Existing Email',
        description: 'Register with new unique email',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: `newuser${Date.now()}@gmail.com`,
            fullName: 'New User',
            phoneNumber: '0987654321',
            password: 'Password123', 
            confirmPassword: 'Password123' 
        },
        shouldSucceed: true,
        expectedCode: null
    },
    {
        id: 'TC_AUTH_061',
        group: 'Existing Email',
        description: 'Register with vendor email if exists',
        endpoint: '/auth/send-signup-code',
        payload: { 
            email: 'vendor@gmail.com', 
            fullName: 'Test Vendor',
            phoneNumber: '0987654321',
            password: 'Password123', 
            confirmPassword: 'Password123' 
        },
        expectedCode: 1002,
        expectedMessage: 'Email này đã được đăng ký trong hệ thống'
    },

    // ========================================
    // GROUP 5: Account Status - Banned (TC_AUTH_091-094)
    // Expected Error: 6001 (ACCOUNT_BANNED)
    // ========================================
    {
        id: 'TC_AUTH_091',
        group: 'Account Status',
        description: 'Login with non-existent email',
        endpoint: '/auth/login',
        payload: { 
            email: 'nonexistent@gmail.com', 
            password: 'Password123' 
        },
        expectedCode: 1005,
        expectedMessage: 'Email hoặc mật khẩu không hợp lệ.'
    },
    {
        id: 'TC_AUTH_092',
        group: 'Account Status',
        description: 'Login with wrong password',
        endpoint: '/auth/login',
        payload: { 
            email: 'admin@gmail.com', 
            password: 'WrongPassword123' 
        },
        expectedCode: 1006,
        expectedMessage: 'Email hoặc mật khẩu không hợp lệ.'
    },
    {
        id: 'TC_AUTH_093',
        group: 'Account Status',
        description: 'Login with banned account (if exists)',
        endpoint: '/auth/login',
        payload: { 
            email: 'banned@gmail.com', 
            password: 'Password123' 
        },
        expectedCode: 6001,
        expectedMessage: 'Tài khoản của bạn đã bị khóa',
        skipIfNotExists: true
    },
    
];

// ============================================
// TEST SUITE
// ============================================

describe('Group 1: Authentication & Account Validation (40 Cases)', function() {
    this.timeout(30000);

    // Clear any existing auth token before tests
    before(function() {
        clearAuthToken();
        console.log('\n📋 Running Data-Driven Authentication Tests');
        console.log(`   API Base URL: ${process.env.API_URL || 'http://localhost:8080/api'}`);
        console.log(`   Total Test Cases: ${authTestData.length}\n`);
    });

    // Group test cases by category for better reporting
    const groups = [...new Set(authTestData.map(tc => tc.group))];

    groups.forEach(groupName => {
        describe(`${groupName} Tests`, function() {
            const groupTests = authTestData.filter(tc => tc.group === groupName);

            groupTests.forEach(testCase => {
                it(`${testCase.id}: ${testCase.description}`, async function() {
                    try {
                        // Make API request
                        const response = await apiClient.post(testCase.endpoint, testCase.payload);

                        // If we expect success
                        if (testCase.shouldSucceed) {
                            expect(response.status).to.be.oneOf([200, 201]);
                            console.log(`      ✅ ${testCase.id}: Request succeeded as expected`);
                            return;
                        }

                        // If we got here without error but expected one, fail
                        expect.fail(`Expected error with code ${testCase.expectedCode} but request succeeded`);

                    } catch (error) {
                        // If we expected success but got error
                        if (testCase.shouldSucceed) {
                            // Check if it's a "skip if not exists" case
                            if (testCase.skipIfNotExists && error.response?.status === 404) {
                                this.skip('Account does not exist - skipping test');
                                return;
                            }
                            console.log(`      ❌ ${testCase.id}: Expected success but got error:`, error.response?.data);
                            throw error;
                        }

                        // Validate error response
                        expect(error.response, 'Expected error response').to.exist;

                        const { status, data } = error.response;

                        // Log response for debugging
                        if (process.env.DEBUG === 'true') {
                            console.log(`      Response Status: ${status}`);
                            console.log(`      Response Data:`, JSON.stringify(data, null, 2));
                        }

                        // Check HTTP status if specified
                        if (testCase.expectedStatus) {
                            expect(status).to.equal(testCase.expectedStatus,
                                `Expected HTTP status ${testCase.expectedStatus} but got ${status}`);
                        }

                        // Check error code if specified
                        if (testCase.expectedCode) {
                            expect(data.code).to.equal(testCase.expectedCode,
                                `Expected error code ${testCase.expectedCode} but got ${data.code}`);
                        }

                        // Check error message if specified
                        if (testCase.expectedMessage) {
                            expect(data.message).to.include(testCase.expectedMessage,
                                `Expected message to include "${testCase.expectedMessage}"`);
                        }

                        console.log(`      ✅ ${testCase.id}: Validation error returned correctly (code: ${data.code})`);
                    }
                });
            });
        });
    });

    // Summary after all tests
    after(function() {
        console.log('\n📊 Test Summary:');
        console.log(`   Total Test Cases: ${authTestData.length}`);
        console.log('   Groups Tested:');
        groups.forEach(g => {
            const count = authTestData.filter(tc => tc.group === g).length;
            console.log(`     - ${g}: ${count} cases`);
        });
    });
});

// ============================================
// HELPER FUNCTION: Generate Test Report
// ============================================

/**
 * Export test data for external reporting tools
 */
module.exports = {
    authTestData,
    getTestCaseById: (id) => authTestData.find(tc => tc.id === id),
    getTestCasesByGroup: (group) => authTestData.filter(tc => tc.group === group)
};
