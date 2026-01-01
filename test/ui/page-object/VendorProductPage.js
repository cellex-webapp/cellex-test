/**
 * VendorProductPage.js
 * Page Object for Vendor Product Management Page
 * 
 * Mapped from: cellex-web/src/features/vendors/pages/Product/ProductFormModal.tsx
 * 
 * Elements identified:
 * - Product form modal
 * - Input fields for product details
 * - Category selector
 * - Image upload
 * - Save button
 */

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class VendorProductPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Page URL (vendor products page)
        this.url = '/vendor/products';
        
        // ============================================
        // LOCATORS - Based on ProductFormModal.tsx
        // ============================================
        
        // Add Product button (usually on the products page)
        this.addProductButton = By.xpath('//button[contains(., "Tạo sản phẩm") or contains(., "Thêm sản phẩm")]');
        
        // Modal container
        this.productModal = By.css('.ant-modal');
        this.modalTitle = By.xpath('//span[contains(text(), "Tạo sản phẩm mới") or contains(text(), "Chỉnh sửa sản phẩm")]');
        
        // Basic Information Card
        // From: <Card title="Thông tin cơ bản">
        this.basicInfoCard = By.xpath('//div[contains(@class, "ant-card")]//span[contains(text(), "Thông tin cơ bản")]/../..');
        
        // Category selector
        // From: <Form.Item name="categoryId" label="Danh mục">
        this.categorySelect = By.css('.ant-select-selector');
        this.categoryDropdown = By.css('.ant-select-dropdown');
        this.categoryOptions = By.css('.ant-select-item-option');
        
        // Product name input
        // From: <Form.Item name="name" label="Tên sản phẩm">
        this.productNameInput = By.css('input[placeholder="Nhập tên sản phẩm"]');
        
        // Description textarea
        // From: <Form.Item name="description" label="Mô tả">
        this.descriptionTextarea = By.css('textarea[id*="description"], textarea[name="description"], textarea[placeholder*="Mô tả"]');
        
        // Price & Stock Card
        // From: <Card title="Giá & Kho">
        
        // Price input
        // From: <Form.Item name="price" label="Giá gốc">
        this.priceInput = By.css('.ant-input-number-input');
        
        // Sale off input
        // From: <Form.Item name="saleOff" label="Giảm giá (%)">
        this.saleOffInput = By.xpath('//label[contains(text(), "Giảm giá")]/..//input[@class="ant-input-number-input"]');
        
        // Stock quantity input
        // From: <Form.Item name="stockQuantity" label="Tồn kho">
        this.stockQuantityInput = By.xpath('//label[contains(text(), "Tồn kho")]/..//input[@class="ant-input-number-input"]');
        
        // Image upload
        // From: <Upload listType="picture-card">
        this.imageUploadArea = By.css('.ant-upload-select');
        this.imageUploadInput = By.css('input[type="file"]');
        this.uploadedImages = By.css('.ant-upload-list-item');
        
        // Publish switch
        // From: <Switch checkedChildren="Xuất bản" unCheckedChildren="Nháp" />
        this.publishSwitch = By.css('button[role="switch"]');
        
        // Form buttons
        this.cancelButton = By.xpath('//button[contains(., "Hủy") or contains(., "Cancel")]');
        this.saveButton = By.xpath('//button[contains(., "Lưu sản phẩm") or contains(., "Lưu") or contains(., "Save")]');
        
        // Success message
        // From success toast/message
        this.successMessage = By.css('.ant-message-success');
        this.successMessageText = By.css('.ant-message-success .ant-message-custom-content');
        
        // Product list (after creation)
        this.productListTable = By.css('.ant-table');
        this.productListItems = By.css('.ant-table-row');
        
        // Loading spinner
        this.loadingSpinner = By.css('.ant-spin');
    }

    /**
     * Navigate to vendor products page
     */
    async open() {
        await this.navigate(this.url);
        await this.driver.sleep(1000);
    }

    /**
     * Click Add Product button to open modal
     */
    async clickAddProduct() {
        await this.waitForElement(this.addProductButton, 10000);
        await this.click(this.addProductButton);
        await this.waitForElement(this.productModal, 5000);
    }

    /**
     * Fill product name
     * @param {string} name - Product name
     */
    async enterProductName(name) {
        await this.waitForElement(this.productNameInput, 5000);
        await this.type(this.productNameInput, name);
    }

    /**
     * Fill product description
     * @param {string} description - Product description
     */
    async enterDescription(description) {
        await this.type(this.descriptionTextarea, description);
    }

    /**
     * Fill product price
     * @param {number} price - Product price
     */
    async enterPrice(price) {
        // Wait for first InputNumber (price)
        await this.waitForElement(this.priceInput, 5000);
        const priceField = await this.driver.findElement(this.priceInput);
        // Clear and type
        await priceField.clear();
        await priceField.sendKeys(price.toString());
    }

    /**
     * Fill sale off percentage
     * @param {number} saleOff - Sale off percentage
     */
    async enterSaleOff(saleOff) {
        await this.waitForElement(this.saleOffInput, 5000);
        const field = await this.driver.findElement(this.saleOffInput);
        await field.clear();
        await field.sendKeys(saleOff.toString());
    }

    /**
     * Fill stock quantity
     * @param {number} quantity - Stock quantity
     */
    async enterStockQuantity(quantity) {
        await this.waitForElement(this.stockQuantityInput, 5000);
        const field = await this.driver.findElement(this.stockQuantityInput);
        await field.clear();
        await field.sendKeys(quantity.toString());
    }

    /**
     * Select category by name
     * @param {string} categoryName - Category name to select
     */
    async selectCategory(categoryName) {
        await this.click(this.categorySelect);
        await this.waitForElement(this.categoryDropdown, 3000);
        
        // Click on the category option
        const categoryOption = By.xpath(`//div[contains(@class, "ant-select-item-option")]//div[contains(text(), "${categoryName}")]`);
        await this.waitForElement(categoryOption, 5000);
        await this.click(categoryOption);
    }

    /**
     * Upload product image
     * @param {string} imagePath - Absolute path to image file
     */
    async uploadImage(imagePath) {
        const fileInput = await this.driver.findElement(this.imageUploadInput);
        await fileInput.sendKeys(imagePath);
        await this.driver.sleep(1000);
    }

    /**
     * Toggle publish status
     */
    async togglePublish() {
        await this.click(this.publishSwitch);
    }

    /**
     * Click save button
     */
    async clickSave() {
        await this.click(this.saveButton);
    }

    /**
     * Click cancel button
     */
    async clickCancel() {
        await this.click(this.cancelButton);
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
     * Get success message text
     * @returns {Promise<string>}
     */
    async getSuccessMessageText() {
        await this.waitForElement(this.successMessage, 10000);
        return await this.getText(this.successMessageText);
    }

    /**
     * Check if product modal is displayed
     * @returns {Promise<boolean>}
     */
    async isProductModalDisplayed() {
        try {
            await this.waitForElement(this.productModal, 5000);
            return await this.isDisplayed(this.productModal);
        } catch (error) {
            return false;
        }
    }

    /**
     * Wait for modal to close
     * @param {number} timeout - Timeout in ms
     * @returns {Promise<boolean>}
     */
    async waitForModalClose(timeout = 10000) {
        try {
            await this.waitForElementNotVisible(this.productModal, timeout);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Create a complete product
     * @param {Object} productData - Product data
     */
    async createProduct(productData) {
        await this.clickAddProduct();
        
        if (productData.name) await this.enterProductName(productData.name);
        if (productData.category) await this.selectCategory(productData.category);
        if (productData.price) await this.enterPrice(productData.price);
        if (productData.stock) await this.enterStockQuantity(productData.stock);
        if (productData.description) await this.enterDescription(productData.description);
        if (productData.saleOff) await this.enterSaleOff(productData.saleOff);
        if (productData.images && productData.images.length > 0) {
            for (const imagePath of productData.images) {
                await this.uploadImage(imagePath);
            }
        }
        
        await this.clickSave();
    }

    /**
     * Check if product appears in list by name
     * @param {string} productName - Product name to search for
     * @returns {Promise<boolean>}
     */
    async isProductInList(productName) {
        try {
            const productRow = By.xpath(`//td[contains(text(), "${productName}")]`);
            await this.waitForElement(productRow, 5000);
            return await this.isDisplayed(productRow);
        } catch (error) {
            return false;
        }
    }
}

module.exports = VendorProductPage;
