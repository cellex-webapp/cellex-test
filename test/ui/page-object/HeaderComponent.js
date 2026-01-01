/**
 * HeaderComponent.js
 * Page Object for Header Component
 * 
 * Mapped from: cellex-web/src/components/header/Header.tsx
 * 
 * Elements identified:
 * - Cart badge with count: Badge count={totalItems}
 * - Notification badge
 * - Message badge
 * - User account button
 * - Search bar
 */

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class HeaderComponent extends BasePage {
    constructor(driver) {
        super(driver);
        
        // ============================================
        // LOCATORS - Based on Header.tsx analysis
        // ============================================
        
        // Logo and branding
        this.logo = By.css('img[src*="cellex"]');
        this.brandText = By.xpath('//span[contains(text(), "CELLEX")]');
        
        // Search bar
        this.searchInput = By.css('input[placeholder*="Tìm trong trang"]');
        this.searchButton = By.css('button[aria-label="Tìm kiếm"]');
        this.voiceSearchButton = By.css('button[aria-label*="giọng nói"]');
        
        // Cart button and badge
        // From: <Badge count={totalItems}><Link to="/cart">...</Link></Badge>
        this.cartButton = By.css('a[href="/cart"]');
        this.cartBadge = By.css('.ant-badge .ant-badge-count, sup.ant-badge-count');
        this.cartIcon = By.css('a[href="/cart"] .anticon-shopping-cart');
        this.cartText = By.xpath('//a[@href="/cart"]//span[contains(text(), "Giỏ hàng")]');
        
        // Messages button and badge
        // From: <Badge count={totalUnreadMessages}><button aria-label="Tin nhắn">...</button></Badge>
        this.messagesButton = By.css('button[aria-label="Tin nhắn"]');
        this.messagesBadge = By.css('.ant-badge .ant-badge-count');
        
        // Notifications button and badge
        // From: <Badge count={unreadCount}><button aria-label="Thông báo">...</button></Badge>
        this.notificationsButton = By.css('button[aria-label="Thông báo"]');
        this.notificationsBadge = By.css('.ant-badge .ant-badge-count');
        
        // User account button
        this.accountButton = By.css('a[href="/account"]');
        
        // Login button (for unauthenticated users)
        this.loginButton = By.xpath('//a[@href="/login"][contains(text(), "Đăng nhập")]');
        
        // Category mega menu
        this.categoryMenu = By.css('.category-mega-menu');
    }

    /**
     * Get cart badge count
     * @returns {Promise<number>}
     */
    async getCartBadgeCount() {
        try {
            await this.waitForElement(this.cartBadge, 5000);
            const badgeText = await this.getText(this.cartBadge);
            return parseInt(badgeText) || 0;
        } catch (error) {
            // Badge not visible means count is 0
            return 0;
        }
    }

    /**
     * Check if cart badge is displayed
     * @returns {Promise<boolean>}
     */
    async isCartBadgeDisplayed() {
        try {
            await this.waitForElement(this.cartBadge, 3000);
            return await this.isDisplayed(this.cartBadge);
        } catch (error) {
            return false;
        }
    }

    /**
     * Click on cart button
     */
    async clickCart() {
        await this.click(this.cartButton);
    }

    /**
     * Wait for cart badge to update to specific count
     * @param {number} expectedCount - Expected count value
     * @param {number} timeout - Maximum wait time in ms
     * @returns {Promise<boolean>}
     */
    async waitForCartBadgeCount(expectedCount, timeout = 10000) {
        const endTime = Date.now() + timeout;
        while (Date.now() < endTime) {
            const currentCount = await this.getCartBadgeCount();
            if (currentCount === expectedCount) {
                return true;
            }
            await this.driver.sleep(500);
        }
        return false;
    }

    /**
     * Get notification badge count
     * @returns {Promise<number>}
     */
    async getNotificationBadgeCount() {
        try {
            await this.waitForElement(this.notificationsBadge, 5000);
            const badgeText = await this.getText(this.notificationsBadge);
            return parseInt(badgeText) || 0;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Get messages badge count
     * @returns {Promise<number>}
     */
    async getMessagesBadgeCount() {
        try {
            await this.waitForElement(this.messagesBadge, 5000);
            const badgeText = await this.getText(this.messagesBadge);
            return parseInt(badgeText) || 0;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Click on messages button
     */
    async clickMessages() {
        await this.click(this.messagesButton);
    }

    /**
     * Click on notifications button
     */
    async clickNotifications() {
        await this.click(this.notificationsButton);
    }

    /**
     * Click on account button
     */
    async clickAccount() {
        await this.click(this.accountButton);
    }

    /**
     * Perform search
     * @param {string} query - Search query
     */
    async search(query) {
        await this.type(this.searchInput, query);
        await this.click(this.searchButton);
    }

    /**
     * Check if header is displayed
     * @returns {Promise<boolean>}
     */
    async isHeaderDisplayed() {
        return await this.isDisplayed(this.logo);
    }

    /**
     * Check if user is authenticated
     * @returns {Promise<boolean>}
     */
    async isUserAuthenticated() {
        try {
            await this.waitForElement(this.accountButton, 3000);
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = HeaderComponent;
