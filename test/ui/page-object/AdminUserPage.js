/**
 * AdminUserPage.js
 * Page Object for Admin Users Management Page
 * 
 * Mapped from: cellex-web/src/features/admin/pages/Users/List/UsersListPage.tsx
 *              cellex-web/src/features/admin/pages/Users/List/UserTable.tsx
 * 
 * Elements identified:
 * - Search input: placeholder="Tìm theo tên hoặc email"
 * - Add user button: "Thêm người dùng"
 * - User table with columns: Avatar, Name, Email, Phone, Role, Status, Actions
 * - Lock/Unlock user buttons
 * - Chat button
 * - User detail modal
 * - Ban reason modal
 */

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class AdminUserPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Page URL
        this.url = '/admin/users';
        
        // ============================================
        // LOCATORS - Based on UsersListPage.tsx and UserTable.tsx analysis
        // ============================================
        
        // Main container
        this.mainContainer = By.css('.p-4');
        
        // Search input
        // From: <Input placeholder="Tìm theo tên hoặc email" prefix={<SearchOutlined />} />
        this.searchInput = By.css('input[placeholder="Tìm theo tên hoặc email"]');
        
        // Add user button
        // From: <Button type="primary" onClick={() => navigate('/admin/users/create')}>Thêm người dùng</Button>
        this.addUserButton = By.xpath('//button[contains(text(), "Thêm người dùng")]');
        
        // User table
        this.userTable = By.css('.ant-table');
        this.tableRows = By.css('.ant-table-tbody tr.ant-table-row');
        this.tableLoading = By.css('.ant-table-loading, .ant-spin');
        
        // Table columns
        this.userAvatars = By.css('.ant-table-tbody tr td:nth-child(1)');
        this.userNames = By.css('.ant-table-tbody tr td:nth-child(2)');
        this.userEmails = By.css('.ant-table-tbody tr td:nth-child(3)');
        this.userPhones = By.css('.ant-table-tbody tr td:nth-child(4)');
        this.userRoles = By.css('.ant-table-tbody tr td:nth-child(5) .ant-tag');
        this.userStatuses = By.css('.ant-table-tbody tr td:nth-child(6) .ant-tag');
        
        // Action buttons in each row
        // Chat button: <Button icon={<MessageOutlined />} />
        this.chatButtons = By.css('.ant-table-tbody button span.anticon-message');
        
        // Lock/Unlock button: <Button icon={<LockOutlined />} /> or <UnlockOutlined />
        this.lockButtons = By.css('.ant-table-tbody button span.anticon-lock');
        this.unlockButtons = By.css('.ant-table-tbody button span.anticon-unlock');
        
        // User detail modal
        this.userDetailModal = By.css('.ant-modal');
        this.modalCloseBtn = By.css('.ant-modal-close');
        
        // Ban reason modal
        // From: UserBanReasonModal.tsx
        this.banReasonModal = By.css('.ant-modal');
        this.banReasonInput = By.css('.ant-modal textarea, .ant-modal input[type="text"]');
        this.banConfirmBtn = By.xpath('//div[contains(@class, "ant-modal")]//button[contains(text(), "Xác nhận") or contains(text(), "Khóa")]');
        this.banCancelBtn = By.xpath('//div[contains(@class, "ant-modal")]//button[contains(text(), "Hủy")]');
        
        // Success/Error messages
        this.successMessage = By.css('.ant-message-success');
        this.errorMessage = By.css('.ant-message-error');
        
        // Pagination
        this.pagination = By.css('.ant-pagination');
        this.paginationNext = By.css('.ant-pagination-next');
        this.paginationPrev = By.css('.ant-pagination-prev');
    }

    /**
     * Navigate to admin users page
     */
    async open() {
        await this.navigate(this.url);
        await this.waitForElement(this.userTable);
    }

    /**
     * Search for users
     * @param {string} searchTerm - Name or email to search
     */
    async searchUser(searchTerm) {
        await this.type(this.searchInput, searchTerm);
        await this.sleep(500); // Wait for debounce
    }

    /**
     * Clear search input
     */
    async clearSearch() {
        const input = await this.waitForElement(this.searchInput);
        await input.clear();
        await this.sleep(500);
    }

    /**
     * Click add user button
     */
    async clickAddUser() {
        await this.click(this.addUserButton);
    }

    /**
     * Get user count in table
     * @returns {Promise<number>}
     */
    async getUserCount() {
        await this.waitForTableLoaded();
        const rows = await this.driver.findElements(this.tableRows);
        return rows.length;
    }

    /**
     * Get user names from table
     * @returns {Promise<string[]>}
     */
    async getUserNames() {
        await this.waitForTableLoaded();
        const nameElements = await this.driver.findElements(this.userNames);
        const names = [];
        for (const element of nameElements) {
            names.push(await element.getText());
        }
        return names;
    }

    /**
     * Get user emails from table
     * @returns {Promise<string[]>}
     */
    async getUserEmails() {
        await this.waitForTableLoaded();
        const emailElements = await this.driver.findElements(this.userEmails);
        const emails = [];
        for (const element of emailElements) {
            emails.push(await element.getText());
        }
        return emails;
    }

    /**
     * Click on a user row to open detail modal
     * @param {number} index - Row index (0-based)
     */
    async clickUserRow(index) {
        const rows = await this.driver.findElements(this.tableRows);
        if (rows.length > index) {
            await rows[index].click();
            await this.sleep(500);
        } else {
            throw new Error(`User row at index ${index} not found`);
        }
    }

    /**
     * Click chat button for user at index
     * @param {number} index - Row index (0-based)
     */
    async clickChatButton(index) {
        const buttons = await this.driver.findElements(this.chatButtons);
        if (buttons.length > index) {
            await buttons[index].click();
        } else {
            throw new Error(`Chat button at index ${index} not found`);
        }
    }

    /**
     * Click lock/ban button for user at index
     * @param {number} index - Row index (0-based)
     */
    async clickLockButton(index) {
        const lockBtns = await this.driver.findElements(this.lockButtons);
        const unlockBtns = await this.driver.findElements(this.unlockButtons);
        const allButtons = [...lockBtns, ...unlockBtns];
        
        if (allButtons.length > index) {
            // Find the parent button and click it
            const btn = allButtons[index];
            const parentButton = await btn.findElement(By.xpath('./..'));
            await parentButton.click();
            await this.sleep(500);
        } else {
            throw new Error(`Lock button at index ${index} not found`);
        }
    }

    /**
     * Enter ban reason and confirm
     * @param {string} reason - Ban reason
     */
    async enterBanReasonAndConfirm(reason) {
        await this.waitForElement(this.banReasonModal);
        await this.type(this.banReasonInput, reason);
        await this.click(this.banConfirmBtn);
        await this.sleep(500);
    }

    /**
     * Cancel ban modal
     */
    async cancelBan() {
        await this.click(this.banCancelBtn);
        await this.sleep(300);
    }

    /**
     * Close user detail modal
     */
    async closeDetailModal() {
        await this.click(this.modalCloseBtn);
        await this.sleep(300);
    }

    /**
     * Check if user table is displayed
     * @returns {Promise<boolean>}
     */
    async isTableDisplayed() {
        return await this.isDisplayed(this.userTable);
    }

    /**
     * Check if table is loading
     * @returns {Promise<boolean>}
     */
    async isTableLoading() {
        return await this.isDisplayed(this.tableLoading);
    }

    /**
     * Wait for table to finish loading
     */
    async waitForTableLoaded() {
        await this.driver.wait(async () => {
            const loading = await this.isTableLoading();
            return !loading;
        }, this.timeout);
        await this.sleep(300);
    }

    /**
     * Check if success message is displayed
     * @returns {Promise<boolean>}
     */
    async isSuccessMessageDisplayed() {
        await this.sleep(500);
        return await this.isDisplayed(this.successMessage);
    }

    /**
     * Check if error message is displayed
     * @returns {Promise<boolean>}
     */
    async isErrorMessageDisplayed() {
        await this.sleep(500);
        return await this.isDisplayed(this.errorMessage);
    }

    /**
     * Get success message text
     * @returns {Promise<string>}
     */
    async getSuccessMessage() {
        return await this.getText(this.successMessage);
    }

    /**
     * Go to next page in table
     */
    async goToNextPage() {
        await this.click(this.paginationNext);
        await this.waitForTableLoaded();
    }

    /**
     * Go to previous page in table
     */
    async goToPreviousPage() {
        await this.click(this.paginationPrev);
        await this.waitForTableLoaded();
    }

    /**
     * Check if user with specific status exists
     * @param {string} status - Status to check ('Hoạt động', 'Bị khóa', 'Ngừng')
     * @returns {Promise<boolean>}
     */
    async hasUserWithStatus(status) {
        const statusElements = await this.driver.findElements(this.userStatuses);
        for (const element of statusElements) {
            const text = await element.getText();
            if (text.includes(status)) {
                return true;
            }
        }
        return false;
    }
}

module.exports = AdminUserPage;
