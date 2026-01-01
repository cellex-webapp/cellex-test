/**
 * auth.api.spec.js
 * Sample API test spec for Authentication endpoints
 * 
 * This is a sample test file to demonstrate how to use the API client
 */

const { expect } = require('chai');
const { login, signup, getProfile, clearAuthToken, get } = require('../helpers/apiClient');

describe('Authentication API Tests', function() {
    // Set timeout for all tests
    this.timeout(30000);

    // Clear auth token before each test
    beforeEach(function() {
        clearAuthToken();
    });

    describe('POST /auth/login', function() {
        it('should return error for invalid credentials', async function() {
            try {
                await login('invalid@email.com', 'wrongpassword');
                // If no error thrown, fail the test
                expect.fail('Expected error to be thrown');
            } catch (error) {
                expect(error.response).to.exist;
                expect(error.response.status).to.be.oneOf([400, 401, 403]);
            }
        });

        // Uncomment and update with valid credentials to test successful login
        // it('should return token for valid credentials', async function() {
        //     const email = process.env.TEST_USER_EMAIL;
        //     const password = process.env.TEST_USER_PASSWORD;
        //     
        //     const response = await login(email, password);
        //     
        //     expect(response).to.have.property('result');
        //     expect(response.result).to.have.property('token');
        // });
    });

    describe('POST /auth/signup', function() {
        it('should return error for invalid signup data', async function() {
            try {
                await signup({
                    fullName: '',
                    email: 'invalid-email',
                    phoneNumber: '123',
                    password: '123',
                    confirmPassword: '456'
                });
                expect.fail('Expected error to be thrown');
            } catch (error) {
                expect(error.response).to.exist;
                expect(error.response.status).to.be.oneOf([400, 422]);
            }
        });
    });

    describe('GET /users/me', function() {
        it('should return 401 without authentication', async function() {
            try {
                await getProfile();
                expect.fail('Expected error to be thrown');
            } catch (error) {
                expect(error.response).to.exist;
                expect(error.response.status).to.equal(401);
            }
        });
    });
});
