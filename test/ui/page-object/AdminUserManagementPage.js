/**
 * AdminUserManagementPage.js
 * Page Object for Admin User Management Page
 * 
 * Mapped from: cellex-web/src/features/admin/pages/Users/List/UserTable.tsx
 *              cellex-web/src/features/admin/pages/Users/List/UserBanReasonModal.tsx
 * 
 * Elements identified:
 * - User table with list of users
 * - Lock/Ban button for each user
 * - Ban reason modal
 * - User status tags
 */

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class AdminUserManagementPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Page URL
        this.url = '/admin/users';
        
        // ============================================
        // LOCATORS - Based on UserTable.tsx and UserBanReasonModal.tsx
        // ============================================
        
        // User table
        this.userTable = By.css('.ant-table');
        this.userTableRows = By.css('.ant-table-row');
        this.userTableHeaders = By.css('.ant-table-thead th');
        
        // Table columns
        this.userAvatars = By.css('.ant-table-cell img');
        this.userNames = By.xpath('//td[@key="fullName"]');
        this.userEmails = By.xpath('//td[@key="email"]');
        this.userPhones = By.xpath('//td[@key="phoneNumber"]');
        this.userRoles = By.xpath('//td[@key="role"]');
        this.userStatuses = By.xpath('//td[@key="active"]');
        
        // Action buttons (in each row)
        // From: <Button icon={<MessageOutlined />} />
        this.messageButtons = By.css('button .anticon-message');
        
        // Lock/Unlock buttons
        // From: <Button icon={<LockOutlined />} /> or <Button icon={<UnlockOutlined />} />
        this.lockButtons = By.css('button .anticon-lock');
        this.unlockButtons = By.css('button .anticon-unlock');
        
        // Status tags
        // From: <Tag color="red">Bị khóa</Tag> or <Tag color="green">Hoạt động</Tag>
        this.bannedTags = By.xpath('//span[contains(@class, "ant-tag")]//span[contains(text(), "Bị khóa")]');
        this.activeTags = By.xpath('//span[contains(@class, "ant-tag")]//span[contains(text(), "Hoạt động")]');
        
        // Ban Reason Modal
        // From: UserBanReasonModal.tsx
        this.banModal = By.css('.ant-modal');
        this.banModalTitle = By.xpath('//div[contains(text(), "Lý do khóa tài khoản")]');
        
        // Ban reason textarea
        // From: <Input.TextArea placeholder="Nhập lý do khóa (ví dụ: vi phạm chính sách)" />
        this.banReasonTextarea = By.css('textarea[placeholder*="Nhập lý do khóa"]');
        
        // Modal buttons
        this.modalConfirmButton = By.xpath('//div[@class="ant-modal-footer"]//button[contains(., "Khóa")]');
        this.modalCancelButton = By.xpath('//div[@class="ant-modal-footer"]//button[contains(., "Hủy")]');
        
        // Success message
        this.successMessage = By.css('.ant-message-success');
        
        // Loading spinner
        this.loadingSpinner = By.css('.ant-spin');
        
        // Search/Filter input (if exists)
        this.searchInput = By.css('input[placeholder*="Tìm kiếm"]');
    }

    /**
     * Navigate to admin users page
     */
    async open() {
        await this.navigate(this.url);
        await this.waitForElement(this.userTable, 10000);
    }

    /**
     * Get all user rows
     * @returns {Promise<Array>}
     */
    async getUserRows() {
        await this.waitForElement(this.userTable, 10000);
        return await this.driver.findElements(this.userTableRows);
    }

    /**
     * Find user row by email
     * @param {string} email - User email to search
     * @returns {Promise<WebElement|null>}
     */
    async findUserRowByEmail(email) {
        // More robust search: iterate table rows and match any cell text containing the email
        try {
            await this.waitForElement(this.userTableRows, 5000);
            const rows = await this.driver.findElements(this.userTableRows);
            for (const row of rows) {
                try {
                    const text = await row.getText();
                    if (text && text.includes(email)) {
                        return row;
                    }
                } catch (inner) {
                    // ignore and continue
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Find user row by name
     * @param {string} name - User name to search
     * @returns {Promise<WebElement|null>}
     */
    async findUserRowByName(name) {
        const userRow = By.xpath(`//td[contains(text(), "${name}")]/..`);
        try {
            await this.waitForElement(userRow, 5000);
            return await this.driver.findElement(userRow);
        } catch (error) {
            return null;
        }
    }

    /**
     * Click lock/ban button for a specific user by email
     * @param {string} email - User email
     */
    async clickLockButtonForUser(email) {
        const row = await this.findUserRowByEmail(email);
        if (!row) throw new Error(`User row for ${email} not found`);
        try {
            const lockBtn = await row.findElement(By.css('button'));
            // find the specific button containing lock icon inside the row
            const buttons = await row.findElements(By.css('button'));
            for (const btn of buttons) {
                try {
                    const innerHtml = await btn.getAttribute('innerHTML');
                    if (innerHtml && innerHtml.includes('anticon-lock')) {
                        await btn.click();
                        await this.driver.sleep(500);
                        return;
                    }
                } catch (e) {}
            }
            // fallback: click first button
            await lockBtn.click();
            await this.driver.sleep(500);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Click unlock button for a specific user by email
     * @param {string} email - User email
     */
    async clickUnlockButtonForUser(email) {
        const row = await this.findUserRowByEmail(email);
        if (!row) throw new Error(`User row for ${email} not found`);
        try {
            const buttons = await row.findElements(By.css('button'));
            for (const btn of buttons) {
                try {
                    const innerHtml = await btn.getAttribute('innerHTML');
                    if (innerHtml && innerHtml.includes('anticon-unlock')) {
                        await btn.click();
                        await this.driver.sleep(500);
                        return;
                    }
                } catch (e) {}
            }
            // fallback: click first button
            const first = await row.findElement(By.css('button'));
            await first.click();
            await this.driver.sleep(500);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Check if ban modal is displayed
     * @returns {Promise<boolean>}
     */
    async isBanModalDisplayed() {
        try {
            await this.waitForElement(this.banModal, 5000);
            return await this.isDisplayed(this.banModal);
        } catch (error) {
            return false;
        }
    }

    /**
     * Enter ban reason in modal
     * @param {string} reason - Ban reason text
     */
    async enterBanReason(reason) {
        await this.waitForElement(this.banReasonTextarea, 5000);
        // Ensure textarea is cleared, typed and blurred so React onChange triggers
        const ta = await this.driver.findElement(this.banReasonTextarea);
        try { await ta.clear(); } catch (e) {}
        await ta.sendKeys(reason);
        try { await this.driver.executeScript('arguments[0].blur();', ta); } catch (e) {}
    }

    /**
     * Click confirm button in ban modal
     */
    async confirmBan() {
        // Click the primary/confirm button inside the modal footer.
        try {
            const footer = await this.driver.findElement(By.css('.ant-modal-footer'));
            const buttons = await footer.findElements(By.css('button'));
            for (const btn of buttons) {
                try {
                    const cls = await btn.getAttribute('class');
                    const txt = await btn.getText();
                    if ((cls && cls.includes('ant-btn-primary')) || (txt && /khóa|xác nhận|confirm|ok/i.test(txt))) {
                        await btn.click();
                        await this.driver.sleep(1000);
                        return;
                    }
                } catch (e) {}
            }
            if (buttons.length) {
                await buttons[buttons.length - 1].click();
                await this.driver.sleep(1000);
                return;
            }
        } catch (e) {
            // fallback to original locator
            try { await this.click(this.modalConfirmButton); await this.driver.sleep(1000); return; } catch (err) {}
            throw e;
        }
    }

    /**
     * Click cancel button in ban modal
     */
    async cancelBan() {
        await this.click(this.modalCancelButton);
    }

    /**
     * Get user status by email
     * @param {string} email - User email
     * @returns {Promise<string>}
     */
    async getUserStatus(email) {
        const row = await this.findUserRowByEmail(email);
        if (!row) throw new Error(`User row for ${email} not found`);
        // Prefer explicit tag
        try {
            const tag = await row.findElement(By.css('.ant-tag'));
            const t = await tag.getText();
            if (t) return t;
        } catch (e) {}

        // Fallback: inspect row text for keywords
        try {
            const rowText = await row.getText();
            if (rowText) {
                const lowered = rowText.toLowerCase();
                if (lowered.includes('bị khóa') || lowered.includes('banned') || lowered.includes('khóa')) return 'Bị khóa';
                if (lowered.includes('hoạt động') || lowered.includes('active')) return 'Hoạt động';
                // return row text for debugging if no keyword
                return rowText;
            }
        } catch (e) {}

        throw new Error('Could not determine user status from row');
    }

    /**
     * Check if user is banned by email
     * @param {string} email - User email
     * @returns {Promise<boolean>}
     */
    async isUserBanned(email) {
        const status = await this.getUserStatus(email);
        if (!status) return false;
        const lowered = status.toLowerCase();
        return lowered.includes('bị khóa') || lowered.includes('khóa') || lowered.includes('banned');
    }

    /**
     * Check if user status has red color (banned)
     * @param {string} email - User email
     * @returns {Promise<boolean>}
     */
    async hasRedStatusTag(email) {
        const row = await this.findUserRowByEmail(email);
        if (!row) return false;
        try {
            const tags = await row.findElements(By.css('.ant-tag'));
            for (const tag of tags) {
                try {
                    const cls = await tag.getAttribute('class');
                    if (cls && cls.includes('ant-tag-red')) return true;
                } catch (e) {}
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    /**
     * Complete ban user workflow
     * @param {string} userEmail - User email to ban
     * @param {string} banReason - Reason for banning
     */
    async banUser(userEmail, banReason) {
        await this.clickLockButtonForUser(userEmail);
        await this.waitForElement(this.banModal, 5000);
        await this.enterBanReason(banReason);
        await this.confirmBan();
    }

    /**
     * Wait for success message
     * @param {number} timeout - Timeout in ms
     * @returns {Promise<boolean>}
     */
    async waitForSuccessMessage(timeout = 10000) {
        try {
            await this.waitForElement(this.successMessage, timeout);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Search for user
     * @param {string} query - Search query
     */
    async searchUser(query) {
        // Try multiple possible search input selectors to be resilient
        const candidates = [
            'input[placeholder*="Tìm kiếm"]',
            'input[placeholder*="Search"]',
            'input[type="search"]',
            '.ant-input-search input',
            'input[aria-label*="search"]'
        ];

        for (const sel of candidates) {
            try {
                const elem = By.css(sel);
                await this.waitForElement(elem, 2000);
                await this.type(elem, query);
                await this.driver.sleep(1000);
                return;
            } catch (e) {
                // try next
            }
        }

        console.log('Search input not found');
    }

    /**
     * Click message button for user
     * @param {string} email - User email
     */
    async clickMessageButtonForUser(email) {
        const messageButton = By.xpath(`//td[contains(text(), "${email}")]/..//button[.//*[contains(@class, "anticon-message")]]`);
        await this.waitForElement(messageButton, 10000);
        await this.click(messageButton);
    }

    /**
     * Wait for modal to close
     * @param {number} timeout - Timeout in ms
     * @returns {Promise<boolean>}
     */
    async waitForModalClose(timeout = 10000) {
        try {
            await this.waitForElementNotVisible(this.banModal, timeout);
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = AdminUserManagementPage;
