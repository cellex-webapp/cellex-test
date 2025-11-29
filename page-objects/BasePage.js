const { By, until, Key } = require('selenium-webdriver');
const config = require('../config/env');

/**
 * Base Page Object - Parent class for all page objects
 * Contains common methods used across all pages
 */
class BasePage {
    constructor(driver) {
        this.driver = driver;
        this.baseUrl = config.baseUrl;
        this.timeout = config.defaultTimeout;
    }

    /**
     * Navigate to a specific URL
     * @param {string} path - Path to navigate to
     */
    async navigate(path = '') {
        const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
        await this.driver.get(url);
        await this.waitForPageLoad();
    }

    /**
     * Wait for page to load completely
     */
    async waitForPageLoad() {
        await this.driver.wait(async () => {
            const readyState = await this.driver.executeScript('return document.readyState');
            return readyState === 'complete';
        }, this.timeout);
    }

    /**
     * Find element with explicit wait
     * @param {By} locator - Element locator
     * @param {number} timeout - Custom timeout
     * @returns {Promise<WebElement>}
     */
    async findElement(locator, timeout = this.timeout) {
        await this.driver.wait(until.elementLocated(locator), timeout);
        return await this.driver.findElement(locator);
    }

    /**
     * Find multiple elements
     * @param {By} locator - Elements locator
     * @returns {Promise<WebElement[]>}
     */
    async findElements(locator) {
        return await this.driver.findElements(locator);
    }

    /**
     * Click on element
     * @param {By} locator - Element locator
     */
    async click(locator) {
        const element = await this.findElement(locator);
        await this.driver.wait(until.elementIsVisible(element), this.timeout);
        await this.driver.wait(until.elementIsEnabled(element), this.timeout);
        await element.click();
    }

    /**
     * Type text into element
     * @param {By} locator - Element locator
     * @param {string} text - Text to type
     * @param {boolean} clearFirst - Clear field before typing
     */
    async type(locator, text, clearFirst = true) {
        const element = await this.findElement(locator);
        await this.driver.wait(until.elementIsVisible(element), this.timeout);
        await this.driver.wait(until.elementIsEnabled(element), this.timeout);
        
        // Click to focus
        await element.click();
        await this.sleep(200);
        
        if (clearFirst) {
            await element.clear();
            await this.sleep(100);
        }
        
        await element.sendKeys(text);
        await this.sleep(300);
    }

    /**
     * Type text slowly (character by character)
     * @param {By} locator - Element locator
     * @param {string} text - Text to type
     * @param {number} delay - Delay between characters in ms
     */
    async typeSlowly(locator, text, delay = 50) {
        const element = await this.findElement(locator);
        await this.driver.wait(until.elementIsVisible(element), this.timeout);
        await element.click();
        await element.clear();
        
        for (const char of text) {
            await element.sendKeys(char);
            await this.sleep(delay);
        }
    }

    /**
     * Get text from element
     * @param {By} locator - Element locator
     * @returns {Promise<string>}
     */
    async getText(locator) {
        const element = await this.findElement(locator);
        return await element.getText();
    }

    /**
     * Get attribute value from element
     * @param {By} locator - Element locator
     * @param {string} attribute - Attribute name
     * @returns {Promise<string>}
     */
    async getAttribute(locator, attribute) {
        const element = await this.findElement(locator);
        return await element.getAttribute(attribute);
    }

    /**
     * Check if element is displayed
     * @param {By} locator - Element locator
     * @returns {Promise<boolean>}
     */
    async isDisplayed(locator) {
        try {
            const element = await this.findElement(locator);
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if element is enabled
     * @param {By} locator - Element locator
     * @returns {Promise<boolean>}
     */
    async isEnabled(locator) {
        try {
            const element = await this.findElement(locator);
            return await element.isEnabled();
        } catch (error) {
            return false;
        }
    }

    /**
     * Wait for element to be visible
     * @param {By} locator - Element locator
     * @param {number} timeout - Custom timeout
     */
    async waitForVisible(locator, timeout = this.timeout) {
        const element = await this.findElement(locator, timeout);
        await this.driver.wait(until.elementIsVisible(element), timeout);
    }

    /**
     * Wait for element to be invisible
     * @param {By} locator - Element locator
     * @param {number} timeout - Custom timeout
     */
    async waitForInvisible(locator, timeout = this.timeout) {
        try {
            const element = await this.driver.findElement(locator);
            await this.driver.wait(until.elementIsNotVisible(element), timeout);
        } catch (error) {
            // Element not found, already invisible
        }
    }

    /**
     * Wait for text to be present in element
     * @param {By} locator - Element locator
     * @param {string} text - Expected text
     * @param {number} timeout - Custom timeout
     */
    async waitForText(locator, text, timeout = this.timeout) {
        await this.driver.wait(until.elementTextContains(
            await this.findElement(locator),
            text
        ), timeout);
    }

    /**
     * Scroll to element
     * @param {By} locator - Element locator
     */
    async scrollToElement(locator) {
        const element = await this.findElement(locator);
        await this.driver.executeScript('arguments[0].scrollIntoView(true);', element);
        // Wait a bit for scroll to complete
        await this.sleep(500);
    }

    /**
     * Execute JavaScript
     * @param {string} script - JavaScript code
     * @param  {...any} args - Arguments to pass to script
     * @returns {Promise<any>}
     */
    async executeScript(script, ...args) {
        return await this.driver.executeScript(script, ...args);
    }

    /**
     * Sleep for specified milliseconds
     * @param {number} ms - Milliseconds to sleep
     */
    async sleep(ms) {
        await this.driver.sleep(ms);
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
     * Refresh page
     */
    async refresh() {
        await this.driver.navigate().refresh();
        await this.waitForPageLoad();
    }

    /**
     * Go back in browser history
     */
    async goBack() {
        await this.driver.navigate().back();
        await this.waitForPageLoad();
    }

    /**
     * Select from dropdown by visible text
     * @param {By} locator - Dropdown locator
     * @param {string} text - Text to select
     */
    async selectByText(locator, text) {
        await this.click(locator);
        const option = By.xpath(`//option[normalize-space()='${text}']`);
        await this.click(option);
    }

    /**
     * Take screenshot
     * @returns {Promise<string>} Base64 encoded screenshot
     */
    async takeScreenshot() {
        return await this.driver.takeScreenshot();
    }

    /**
     * Press keyboard key
     * @param {By} locator - Element locator
     * @param {string} key - Key to press (use Key enum)
     */
    async pressKey(locator, key) {
        const element = await this.findElement(locator);
        await element.sendKeys(key);
    }

    /**
     * Clear input field
     * @param {By} locator - Element locator
     */
    async clear(locator) {
        const element = await this.findElement(locator);
        await element.clear();
    }
}

module.exports = BasePage;
