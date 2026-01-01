/**
 * ChatPage.js
 * Page Object for Chat/Messaging Page
 * 
 * Mapped from: cellex-web/src/features/vendors/pages/Chat/components/ChatWindow.tsx
 * 
 * Elements identified:
 * - Chat window container
 * - Message input field
 * - Send button
 * - Message bubbles
 * - Chat partner info
 */

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class ChatPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Page URLs (different for different user types)
        this.vendorChatUrl = '/vendor/chat';
        this.accountMessagesUrl = '/account?tab=messages';
        this.adminChatUrl = '/admin/chat';
        
        // ============================================
        // LOCATORS - Based on ChatWindow.tsx
        // ============================================
        
        // Main chat window container
        this.chatWindow = By.css('.flex-1.flex.flex-col.h-full.bg-\\[\\#f0f2f5\\]');
        
        // Chat header
        this.chatHeader = By.css('.bg-white.border-b.border-gray-200');
        this.partnerAvatar = By.css('.ant-avatar');
        this.partnerName = By.css('h3.font-bold.text-gray-800');
        this.partnerStatus = By.xpath('//span[contains(text(), "Đang hoạt động")]');
        
        // Messages container
        this.messagesContainer = By.css('.flex-1.overflow-y-auto.p-4');
        this.messagesList = By.css('.flex.flex-col.gap-1');
        this.messageBubbles = By.css('[class*="message-bubble"], .flex.items-end, .flex.items-start');
        
        // Message input area
        this.messageInputContainer = By.css('.bg-white.p-4.border-t');
        // Message input is a TextArea with specific placeholder
        this.messageInput = By.css('textarea[placeholder="Nhập tin nhắn..."]');

        // Send button
        // From: <Button type="primary" shape="circle" icon={<SendOutlined />}
        this.sendButton = By.xpath('//button[contains(@class, "ant-btn-primary") and .//*[contains(@class, "anticon-send")]]');
        
        // Attachment buttons
        this.attachFileButton = By.css('button .anticon-paper-clip');
        this.attachImageButton = By.css('button .anticon-picture');
        
        // Empty chat state
        this.emptyChatMessage = By.xpath('//span[contains(text(), "Chọn một cuộc hội thoại")]');
        
        // Loading spinner
        this.loadingSpinner = By.css('.ant-spin');
        this.loadingText = By.xpath('//div[contains(text(), "Tải tin nhắn")]');
        
        // Message timestamp
        this.messageTimestamps = By.css('span[class*="text-xs"]');
    }

    /**
     * Navigate to chat page (vendor)
     */
    async openVendorChat() {
        // Try several known vendor chat paths as fallbacks
        const candidates = [this.vendorChatUrl, '/vendor/messages', '/vendor/conversations', '/messages', '/chats', '/chat'];
        for (const path of candidates) {
            try {
                await this.navigate(path);
                await this.driver.sleep(1500);
                // if chat window or messages container exists, assume success
                if (await this.isChatWindowDisplayed() || await this.isEmptyChatDisplayed()) return;
            } catch (e) {
                // try next
            }
        }
    }

    /**
     * Navigate to chat page (client/account)
     */
    async openAccountMessages() {
        const candidates = [this.accountMessagesUrl, '/account/messages', '/account?tab=messages', '/messages'];
        for (const path of candidates) {
            try {
                await this.navigate(path);
                await this.driver.sleep(1500);
                if (await this.isChatWindowDisplayed() || await this.isEmptyChatDisplayed()) return;
            } catch (e) {}
        }
    }

    /**
     * Navigate to admin chat page
     */
    async openAdminChat() {
        // First try direct routes (existing fallback)
        const candidates = [this.adminChatUrl, '/admin/messages', '/admin/conversations', '/admin/chat', '/messages', '/chats'];
        for (const path of candidates) {
            try {
                await this.navigate(path);
                await this.driver.sleep(1000);
                if (await this.isChatWindowDisplayed() || await this.isEmptyChatDisplayed()) return;
            } catch (e) {}
        }

        // If direct navigation fails, try navigating via sidebar: "Chăm sóc khách hàng" -> "Quản lý tin nhắn"
        try {
            // Click sidebar parent link by visible text
            const parentXpath = `//nav//a[normalize-space()="Chăm sóc khách hàng" or contains(., "Chăm sóc")]`;
            const childXpath = `//nav//a[normalize-space()="Quản lý tin nhắn" or contains(., "Tin nhắn") or contains(., "Quản lý tin")]`;

            try {
                const parent = await this.driver.findElement(By.xpath(parentXpath));
                await parent.click();
                await this.driver.sleep(500);
            } catch (e) {
                // parent may be a menu item that expands on hover or not required
            }

            // Try to click child menu
            const child = await this.driver.findElement(By.xpath(childXpath));
            await child.click();
            await this.driver.sleep(1500);

            // final check
            if (await this.isChatWindowDisplayed() || await this.isEmptyChatDisplayed()) return;
        } catch (e) {
            // as last resort, try opening with router push paths used by some layouts
            try { await this.navigate('/admin?tab=messages'); await this.driver.sleep(1000); } catch (err) {}
        }
    }

    /**
     * Check if chat window is displayed
     * @returns {Promise<boolean>}
     */
    async isChatWindowDisplayed() {
        try {
            await this.waitForElement(this.chatWindow, 5000);
            return await this.isDisplayed(this.chatWindow);
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if empty chat message is displayed
     * @returns {Promise<boolean>}
     */
    async isEmptyChatDisplayed() {
        try {
            await this.waitForElement(this.emptyChatMessage, 3000);
            return await this.isDisplayed(this.emptyChatMessage);
        } catch (error) {
            return false;
        }
    }

    /**
     * Type message in input field
     * @param {string} message - Message text
     */
    async typeMessage(message) {
        await this.waitForElement(this.messageInput, 5000);
        const inputField = await this.driver.findElement(this.messageInput);
        await inputField.clear();
        await inputField.sendKeys(message);
    }

    /**
     * Click send button
     */
    async clickSend() {
        await this.waitForElement(this.sendButton, 5000);
        await this.click(this.sendButton);
        await this.driver.sleep(500);
    }

    /**
     * Send a complete message
     * @param {string} message - Message text
     */
    async sendMessage(message) {
        await this.typeMessage(message);
        await this.clickSend();
    }

    /**
     * Get all message bubbles
     * @returns {Promise<Array>}
     */
    async getMessageBubbles() {
        try {
            await this.driver.sleep(1000); // Wait for messages to render
            return await this.driver.findElements(this.messageBubbles);
        } catch (error) {
            return [];
        }
    }

    /**
     * Get count of message bubbles
     * @returns {Promise<number>}
     */
    async getMessageCount() {
        const bubbles = await this.getMessageBubbles();
        return bubbles.length;
    }

    /**
     * Wait for new message to appear
     * @param {number} expectedCount - Expected total message count
     * @param {number} timeout - Timeout in ms
     * @returns {Promise<boolean>}
     */
    async waitForMessageCount(expectedCount, timeout = 10000) {
        const endTime = Date.now() + timeout;
        while (Date.now() < endTime) {
            const currentCount = await this.getMessageCount();
            if (currentCount >= expectedCount) {
                return true;
            }
            await this.driver.sleep(500);
        }
        return false;
    }

    /**
     * Check if message with specific text exists
     * @param {string} messageText - Message text to search
     * @returns {Promise<boolean>}
     */
    async isMessageDisplayed(messageText) {
        const messageElement = By.xpath(`//*[contains(text(), "${messageText}")]`);
        try {
            await this.waitForElement(messageElement, 5000);
            return await this.isDisplayed(messageElement);
        } catch (error) {
            return false;
        }
    }

    /**
     * Wait for specific message to appear
     * @param {string} messageText - Message text
     * @param {number} timeout - Timeout in ms
     * @returns {Promise<boolean>}
     */
    async waitForMessage(messageText, timeout = 10000) {
        const messageElement = By.xpath(`//*[contains(text(), "${messageText}")]`);
        try {
            await this.waitForElement(messageElement, timeout);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get partner name from header
     * @returns {Promise<string>}
     */
    async getPartnerName() {
        await this.waitForElement(this.partnerName, 5000);
        return await this.getText(this.partnerName);
    }

    /**
     * Check if partner is online/active
     * @returns {Promise<boolean>}
     */
    async isPartnerActive() {
        try {
            await this.waitForElement(this.partnerStatus, 3000);
            return await this.isDisplayed(this.partnerStatus);
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if send button is enabled
     * @returns {Promise<boolean>}
     */
    async isSendButtonEnabled() {
        try {
            const button = await this.driver.findElement(this.sendButton);
            const isDisabled = await button.getAttribute('disabled');
            return isDisabled === null || isDisabled === 'false';
        } catch (error) {
            return false;
        }
    }

    /**
     * Get message input value
     * @returns {Promise<string>}
     */
    async getMessageInputValue() {
        try {
            const inputField = await this.driver.findElement(this.messageInput);
            return await inputField.getAttribute('value');
        } catch (error) {
            return '';
        }
    }

    /**
     * Clear message input
     */
    async clearMessageInput() {
        try {
            const input = await this.driver.findElement(this.messageInput);
            await input.clear();
        } catch (error) {
            // ignore
        }
    }

    /**
     * Press Enter in message input (alternative to clicking send)
     */
    async pressEnter() {
        try {
            const input = await this.driver.findElement(this.messageInput);
            await input.sendKeys('\n');
        } catch (error) {
            // ignore
        }
    }

    /**
     * Scroll to bottom of messages
     */
    async scrollToBottom() {
        const container = await this.driver.findElement(this.messagesContainer);
        await this.driver.executeScript('arguments[0].scrollTop = arguments[0].scrollHeight', container);
        await this.driver.sleep(500);
    }
}

module.exports = ChatPage;
