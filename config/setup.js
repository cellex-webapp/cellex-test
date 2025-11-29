const { expect } = require('chai');
const config = require('./env');
const DriverManager = require('../drivers/driverManager');
const fs = require('fs');
const path = require('path');

/**
 * Global setup and teardown for Mocha tests
 * Using Root Hook Plugin pattern
 */

// Create necessary directories
const createDirectories = () => {
    const dirs = [
        config.screenshotsPath,
        config.reportsPath
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

// Root Hook Plugin
exports.mochaHooks = {
    // Global before hook - runs once before all tests
    beforeAll: async function() {
        this.timeout(60000);
        console.log('\n========================================');
        console.log('Starting Test Suite');
        console.log('========================================');
        console.log(`Environment: ${config.baseUrl}`);
        console.log(`Browser: ${config.browser}`);
        console.log(`Headless: ${config.headless}`);
        console.log('========================================\n');
        
        // Create necessary directories
        createDirectories();
    },

    // Global after hook - runs once after all tests
    afterAll: async function() {
        this.timeout(30000);
        console.log('\n========================================');
        console.log('Test Suite Completed');
        console.log('========================================\n');
    },

    // Before each test
    beforeEach: async function() {
        this.timeout(60000);
        
        // Initialize driver for each test
        const driverManager = new DriverManager();
        this.driver = await driverManager.getDriver();
        
        // Set page load timeout
        await this.driver.manage().setTimeouts({
            implicit: config.implicitWait,
            pageLoad: config.pageLoadTimeout
        });
        
        // Maximize window or set specific size
        await this.driver.manage().window().setRect({
            width: config.windowSize.width,
            height: config.windowSize.height
        });
        
        console.log(`\n▶ Running test: ${this.currentTest.title}`);
    },

    // After each test
    afterEach: async function() {
        this.timeout(30000);
        
        const testPassed = this.currentTest.state === 'passed';
        
        // Take screenshot on failure or if enabled
        if (!testPassed || config.enableScreenshots) {
            try {
                const screenshot = await this.driver.takeScreenshot();
                const testName = this.currentTest.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const timestamp = new Date().getTime();
                const screenshotPath = path.join(
                    config.screenshotsPath,
                    `${testName}_${timestamp}.png`
                );
                
                fs.writeFileSync(screenshotPath, screenshot, 'base64');
                console.log(`Screenshot saved: ${screenshotPath}`);
            } catch (error) {
                console.error('Failed to take screenshot:', error.message);
            }
        }
        
        // Print test result
        if (testPassed) {
            console.log(`✓ Test passed: ${this.currentTest.title}`);
        } else {
            console.log(`✗ Test failed: ${this.currentTest.title}`);
            if (this.currentTest.err) {
                console.log(`  Error: ${this.currentTest.err.message}`);
            }
        }
        
        // Quit driver
        if (this.driver) {
            try {
                await this.driver.quit();
            } catch (error) {
                console.error('Failed to quit driver:', error.message);
            }
        }
    }
};

// Export utilities for tests
module.exports.expect = expect;
module.exports.config = config;
