/**
 * BasePage.js
 * Base class for all Page Objects
 * Contains common methods and setup for Selenium WebDriver
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const edge = require('selenium-webdriver/edge');
require('dotenv').config();

class BasePage {
    constructor(driver) {
        this.driver = driver;
        this.baseUrl = process.env.BASE_URL || 'http://localhost:5173';
        this.timeout = parseInt(process.env.IMPLICIT_WAIT) || 10000;
    }

    /**
     * Create a new WebDriver instance
     * @returns {Promise<WebDriver>}
     */
    static async createDriver() {
        const browser = process.env.BROWSER || 'edge'; // Mặc định dùng Edge trên Windows
        console.log('🚀 Khởi tạo WebDriver...');
        console.log(`   Browser: ${browser}`);
        console.log(`   Headless: ${process.env.HEADLESS || 'false'}`);
        console.log(`   Base URL: ${process.env.BASE_URL || 'http://localhost:5173'}`);
        
        try {
            let driver;
            
            if (browser.toLowerCase() === 'edge') {
                // Sử dụng Edge (có sẵn trên Windows 10/11)
                const options = new edge.Options();
                
                if (process.env.HEADLESS === 'true') {
                    options.addArguments('--headless');
                    options.addArguments('--headless=new');
                }
                
                options.addArguments('--no-sandbox');
                options.addArguments('--disable-dev-shm-usage');
                options.addArguments('--disable-gpu');
                options.addArguments('--window-size=1920,1080');
                options.addArguments('--start-maximized');
                options.addArguments('--disable-extensions');
                options.excludeSwitches('enable-logging');
                
                console.log('   Đang build Edge WebDriver...');
                driver = await new Builder()
                    .forBrowser('MicrosoftEdge')
                    .setEdgeOptions(options)
                    .build();
                    
            } else {
                // Sử dụng Chrome
                const options = new chrome.Options();
                
                if (process.env.HEADLESS === 'true') {
                    options.addArguments('--headless');
                    options.addArguments('--headless=new');
                }
                
                options.addArguments('--no-sandbox');
                options.addArguments('--disable-dev-shm-usage');
                options.addArguments('--disable-gpu');
                options.addArguments('--disable-software-rasterizer');
                options.addArguments('--window-size=1920,1080');
                options.addArguments('--start-maximized');
                options.addArguments('--disable-extensions');
                options.addArguments('--disable-infobars');
                options.excludeSwitches('enable-logging');
                options.setPageLoadStrategy('normal');

                console.log('   Đang build Chrome WebDriver...');
                driver = await new Builder()
                    .forBrowser('chrome')
                    .setChromeOptions(options)
                    .build();
            }

            console.log('✅ WebDriver đã khởi tạo thành công!');

            await driver.manage().setTimeouts({
                implicit: parseInt(process.env.IMPLICIT_WAIT) || 10000,
                pageLoad: parseInt(process.env.PAGE_LOAD_TIMEOUT) || 30000
            });

            return driver;
        } catch (error) {
            console.error('❌ Lỗi khi khởi tạo WebDriver:');
            console.error('   Error:', error.message);
            console.error('\n💡 Giải pháp:');
            console.error('   1. Nếu dùng Edge: đã cài edgedriver chưa? npm install edgedriver --save-dev');
            console.error('   2. Nếu dùng Chrome: kiểm tra Chrome đã cài đặt chưa');
            console.error('   3. Thử đổi BROWSER=edge trong file .env');
            console.error('   4. Chạy: npm install chromedriver --save-dev (cho Chrome)');
            throw error;
        }
    }

    /**
     * Navigate to a specific path
     * @param {string} path - URL path to navigate to
     */
    async navigate(path = '') {
        await this.driver.get(`${this.baseUrl}${path}`);
    }

    /**
     * Wait for element to be visible
     * @param {By} locator - Selenium locator
     * @param {number} timeout - Optional timeout override
     * @returns {Promise<WebElement>}
     */
    async waitForElement(locator, timeout) {
        const waitTime = timeout || this.timeout;
        return await this.driver.wait(until.elementLocated(locator), waitTime);
    }

    /**
     * Wait for element to NOT be visible
     * @param {By} locator - Selenium locator
     * @param {number} timeout - Optional timeout override
     * @returns {Promise<boolean>}
     */
    async waitForElementNotVisible(locator, timeout) {
        const waitTime = timeout || this.timeout;
        try {
            await this.driver.wait(async () => {
                try {
                    const element = await this.driver.findElement(locator);
                    const isDisplayed = await element.isDisplayed();
                    return !isDisplayed;
                } catch (error) {
                    // Element not found = not visible
                    return true;
                }
            }, waitTime);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Wait for element to be clickable
     * @param {By} locator - Selenium locator
     * @returns {Promise<WebElement>}
     */
    async waitForClickable(locator) {
        const element = await this.waitForElement(locator);
        await this.driver.wait(until.elementIsVisible(element), this.timeout);
        return element;
    }

    /**
     * Click an element
     * @param {By} locator - Selenium locator
     */
    async click(locator) {
        const element = await this.waitForClickable(locator);
        await element.click();
    }

    /**
     * Type text into an input field
     * @param {By} locator - Selenium locator
     * @param {string} text - Text to type
     */
    async type(locator, text) {
        const element = await this.waitForElement(locator);
        await element.clear();
        await element.sendKeys(text);
    }

    /**
     * Get text content of an element
     * @param {By} locator - Selenium locator
     * @returns {Promise<string>}
     */
    async getText(locator) {
        const element = await this.waitForElement(locator);
        return await element.getText();
    }

    /**
     * Check if element is displayed
     * @param {By} locator - Selenium locator
     * @returns {Promise<boolean>}
     */
    async isDisplayed(locator) {
        try {
            const element = await this.driver.findElement(locator);
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Get current URL
     * @returns {Promise<string>}
     */
    async getCurrentUrl() {
        return await this.driver.getCurrentUrl();
    }

    /**
     * Get page title
     * @returns {Promise<string>}
     */
    async getTitle() {
        return await this.driver.getTitle();
    }

    /**
     * Wait for URL to contain specific text
     * @param {string} urlPart - Part of URL to wait for
     */
    async waitForUrlContains(urlPart) {
        await this.driver.wait(until.urlContains(urlPart), this.timeout);
    }

    /**
     * Take a screenshot
     * @param {string} filename - Name of the screenshot file
     */
    async takeScreenshot(filename) {
        const fs = require('fs');
        const screenshot = await this.driver.takeScreenshot();
        fs.writeFileSync(`reports/${filename}.png`, screenshot, 'base64');
    }

    /**
     * Sleep for specified milliseconds
     * @param {number} ms - Milliseconds to sleep
     */
    async sleep(ms) {
        await this.driver.sleep(ms);
    }

    /**
     * Close the browser
     */
    async close() {
        await this.driver.quit();
    }
}

module.exports = BasePage;
