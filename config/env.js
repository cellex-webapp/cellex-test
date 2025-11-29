require('dotenv').config();

/**
 * Environment configuration for test automation
 * Manages different environments (dev, staging, production)
 */
const config = {
    // Browser configuration
    browser: process.env.BROWSER || 'chrome',
    headless: process.env.HEADLESS === 'true',
    
    // Base URLs for different environments
    baseUrl: process.env.BASE_URL || 'http://localhost:5173',
    apiUrl: process.env.API_URL || 'http://localhost:8088/api/v1',
    
    // Timeout configuration
    defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT) || 30000,
    pageLoadTimeout: parseInt(process.env.PAGE_LOAD_TIMEOUT) || 60000,
    implicitWait: parseInt(process.env.IMPLICIT_WAIT) || 10000,
    
    // Test user credentials
    testUsers: {
        admin: {
            email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
            password: process.env.ADMIN_PASSWORD || '123'
        },
        vendor: {
            email: process.env.VENDOR_EMAIL || 'vendor@gmail.com',
            password: process.env.VENDOR_PASSWORD || '123'
        },
        customer: {
            email: process.env.CUSTOMER_EMAIL || 'customer@gmail.com',
            password: process.env.CUSTOMER_PASSWORD || '123'
        }
    },
    
    // Screenshots and reports
    screenshotsPath: process.env.SCREENSHOTS_PATH || './screenshots',
    reportsPath: process.env.REPORTS_PATH || './reports',
    
    // WebDriver options
    windowSize: {
        width: parseInt(process.env.WINDOW_WIDTH) || 1920,
        height: parseInt(process.env.WINDOW_HEIGHT) || 1080
    },
    
    // Retry configuration
    maxRetries: parseInt(process.env.MAX_RETRIES) || 2,
    
    // Feature flags
    enableScreenshots: process.env.ENABLE_SCREENSHOTS !== 'false',
    enableVideos: process.env.ENABLE_VIDEOS === 'true'
};

module.exports = config;
