const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const config = require('../config/env');

/**
 * Driver Manager - Manages WebDriver instances
 * Supports Chrome and Firefox browsers
 */
class DriverManager {
    constructor() {
        this.driver = null;
    }

    /**
     * Get WebDriver instance based on configuration
     * @returns {Promise<WebDriver>}
     */
    async getDriver() {
        const browser = config.browser.toLowerCase();
        
        switch (browser) {
            case 'chrome':
                return await this.getChromeDriver();
            case 'firefox':
                return await this.getFirefoxDriver();
            default:
                console.warn(`Unknown browser: ${browser}. Defaulting to Chrome.`);
                return await this.getChromeDriver();
        }
    }

    /**
     * Create Chrome WebDriver instance
     * @returns {Promise<WebDriver>}
     */
    async getChromeDriver() {
        console.log('Initializing Chrome WebDriver...');
        
        // Require chromedriver to ensure it's available
        require('chromedriver');
        
        const chromeOptions = new chrome.Options();
        
        // Headless mode
        if (config.headless) {
            chromeOptions.addArguments('--headless=new');
        }
        
        // Common Chrome arguments
        chromeOptions.addArguments('--disable-gpu');
        chromeOptions.addArguments('--no-sandbox');
        chromeOptions.addArguments('--disable-dev-shm-usage');
        chromeOptions.addArguments('--disable-blink-features=AutomationControlled');
        chromeOptions.addArguments(`--window-size=${config.windowSize.width},${config.windowSize.height}`);
        chromeOptions.addArguments('--remote-debugging-port=9222');
        
        // Additional preferences
        chromeOptions.setUserPreferences({
            'download.default_directory': './downloads',
            'download.prompt_for_download': false,
            'safebrowsing.enabled': false
        });
        
        // Exclude logging switches
        chromeOptions.excludeSwitches('enable-logging');
        
        console.log('Building Chrome driver...');
        
        this.driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(chromeOptions)
            .build();
        
        console.log('Chrome WebDriver initialized successfully');
        
        return this.driver;
    }

    /**
     * Create Firefox WebDriver instance
     * @returns {Promise<WebDriver>}
     */
    async getFirefoxDriver() {
        const firefoxOptions = new firefox.Options();
        
        // Headless mode
        if (config.headless) {
            firefoxOptions.addArguments('-headless');
        }
        
        // Window size
        firefoxOptions.addArguments(`--width=${config.windowSize.width}`);
        firefoxOptions.addArguments(`--height=${config.windowSize.height}`);
        
        // Additional preferences
        firefoxOptions.setPreference('dom.webnotifications.enabled', false);
        firefoxOptions.setPreference('browser.download.folderList', 2);
        firefoxOptions.setPreference('browser.download.dir', './downloads');
        firefoxOptions.setPreference('browser.helperApps.neverAsk.saveToDisk', 'application/pdf');
        
        this.driver = await new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(firefoxOptions)
            .build();
        
        return this.driver;
    }

    /**
     * Quit the driver instance
     */
    async quitDriver() {
        if (this.driver) {
            await this.driver.quit();
            this.driver = null;
        }
    }
}

module.exports = DriverManager;
