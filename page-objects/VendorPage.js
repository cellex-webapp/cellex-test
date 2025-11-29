const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

/**
 * Vendor Page Object
 * Handles vendor dashboard and product management functionality
 */
class VendorPage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Navigation Locators
        this.vendorDashboardLink = By.css('a[href*="/vendor"], [data-testid="vendor-dashboard"]');
        this.productsTab = By.css('a[href*="/vendor/products"], button:has-text("Products")');
        this.ordersTab = By.css('a[href*="/vendor/orders"], button:has-text("Orders")');
        this.settingsTab = By.css('a[href*="/vendor/settings"], button:has-text("Settings")');
        
        // Product Management Locators - Updated to match ProductsPage.tsx (Ant Design)
        this.addProductButton = By.xpath('//button[contains(@class, "ant-btn-primary")]//span[contains(text(), "Thêm") or contains(text(), "Tạo")]');
        this.productNameInput = By.css('input[placeholder*="tên sản phẩm"]');
        this.productDescriptionInput = By.css('textarea[placeholder*="mô tả"]');
        this.productPriceInput = By.css('input[placeholder*="giá"]');
        this.productStockInput = By.css('input[placeholder*="số lượng"]');
        this.productCategorySelect = By.css('.ant-select-selector');
        this.productImageInput = By.css('input[type="file"]');
        this.saveProductButton = By.xpath('//button[@type="submit" or contains(text(), "Lưu") or contains(text(), "Tạo")]');
        this.cancelButton = By.xpath('//button[contains(text(), "Hủy")]');
        this.searchInput = By.css('input.ant-input[placeholder*="Tìm"]');
        
        // Product List Locators - Updated to match Ant Design Table
        this.productsList = By.css('.ant-table-tbody .ant-table-row');
        this.productName = By.css('.ant-table-cell .font-medium');
        this.productPrice = By.css('.ant-table-cell');
        this.productStock = By.css('.ant-table-cell');
        this.productImage = By.css('.ant-image img');
        this.editProductButton = By.css('button[aria-label*="edit"], button .anticon-edit');
        this.deleteProductButton = By.css('button[aria-label*="delete"], button .anticon-delete');
        this.confirmDeleteButton = By.xpath('//button[contains(@class, "ant-btn-dangerous") and contains(., "Xóa")]');
        this.productTable = By.css('.ant-table-wrapper');
        
        // Orders Management Locators
        this.ordersList = By.css('.order-item, [data-testid="order-item"]');
        this.orderNumber = By.css('.order-number, [data-testid="order-number"]');
        this.orderStatus = By.css('.order-status, [data-testid="order-status"]');
        this.orderTotal = By.css('.order-total, [data-testid="order-total"]');
        this.updateStatusButton = By.css('button:has-text("Update Status")');
        this.statusSelect = By.css('select[name="status"]');
        
        // Statistics Locators
        this.totalProducts = By.css('[data-testid="total-products"], .stat-products');
        this.totalOrders = By.css('[data-testid="total-orders"], .stat-orders');
        this.totalRevenue = By.css('[data-testid="total-revenue"], .stat-revenue');
        
        // Messages
        this.successMessage = By.css('.success-message, [data-testid="success-message"]');
        this.errorMessage = By.css('.error-message, [data-testid="error-message"]');
    }

    /**
     * Navigate to vendor dashboard
     */
    async navigateToVendorDashboard() {
        await this.navigate('/vendor/dashboard');
    }

    /**
     * Navigate to products tab
     */
    async goToProducts() {
        await this.click(this.productsTab);
        await this.sleep(1000);
    }

    /**
     * Navigate to orders tab
     */
    async goToOrders() {
        await this.click(this.ordersTab);
        await this.sleep(1000);
    }

    /**
     * Click add product button
     */
    async clickAddProduct() {
        await this.click(this.addProductButton);
        await this.sleep(1000);
    }

    /**
     * Fill product form
     * @param {Object} productData - Product information
     */
    async fillProductForm(productData) {
        if (productData.name) {
            await this.type(this.productNameInput, productData.name);
        }
        if (productData.description) {
            await this.type(this.productDescriptionInput, productData.description);
        }
        if (productData.price) {
            await this.type(this.productPriceInput, productData.price.toString());
        }
        if (productData.stock) {
            await this.type(this.productStockInput, productData.stock.toString());
        }
        if (productData.category) {
            await this.selectByText(this.productCategorySelect, productData.category);
        }
        if (productData.imagePath) {
            const imageInput = await this.findElement(this.productImageInput);
            await imageInput.sendKeys(productData.imagePath);
            await this.sleep(1000);
        }
    }

    /**
     * Save product
     */
    async saveProduct() {
        await this.click(this.saveProductButton);
        await this.sleep(2000);
    }

    /**
     * Create new product
     * @param {Object} productData - Product information
     */
    async createProduct(productData) {
        await this.clickAddProduct();
        await this.fillProductForm(productData);
        await this.saveProduct();
    }

    /**
     * Get number of products
     * @returns {Promise<number>}
     */
    async getProductCount() {
        try {
            const products = await this.findElements(this.productsList);
            return products.length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Get product details by index
     * @param {number} index - Product index (0-based)
     * @returns {Promise<Object>}
     */
    async getProductDetails(index = 0) {
        const products = await this.findElements(this.productsList);
        if (products.length <= index) {
            return null;
        }

        const product = products[index];
        const name = await product.findElement(By.css('.product-name, [data-testid="product-name"]')).getText();
        const price = await product.findElement(By.css('.product-price, [data-testid="product-price"]')).getText();
        const stock = await product.findElement(By.css('.product-stock, [data-testid="product-stock"]')).getText();

        return { name, price, stock };
    }

    /**
     * Edit product by index
     * @param {number} index - Product index (0-based)
     */
    async editProduct(index = 0) {
        const editButtons = await this.findElements(this.editProductButton);
        if (editButtons.length > index) {
            await editButtons[index].click();
            await this.sleep(1000);
        }
    }

    /**
     * Delete product by index
     * @param {number} index - Product index (0-based)
     */
    async deleteProduct(index = 0) {
        const deleteButtons = await this.findElements(this.deleteProductButton);
        if (deleteButtons.length > index) {
            await deleteButtons[index].click();
            await this.sleep(500);
            
            // Confirm deletion
            try {
                await this.click(this.confirmDeleteButton);
                await this.sleep(1000);
            } catch (error) {
                // No confirmation dialog
            }
        }
    }

    /**
     * Update product details
     * @param {number} index - Product index (0-based)
     * @param {Object} productData - Updated product data
     */
    async updateProduct(index, productData) {
        await this.editProduct(index);
        await this.fillProductForm(productData);
        await this.saveProduct();
    }

    /**
     * Get orders count
     * @returns {Promise<number>}
     */
    async getOrdersCount() {
        try {
            const orders = await this.findElements(this.ordersList);
            return orders.length;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Get order details by index
     * @param {number} index - Order index (0-based)
     * @returns {Promise<Object>}
     */
    async getOrderDetails(index = 0) {
        const orders = await this.findElements(this.ordersList);
        if (orders.length <= index) {
            return null;
        }

        const order = orders[index];
        const orderNumber = await order.findElement(By.css('.order-number, [data-testid="order-number"]')).getText();
        const status = await order.findElement(By.css('.order-status, [data-testid="order-status"]')).getText();
        const total = await order.findElement(By.css('.order-total, [data-testid="order-total"]')).getText();

        return { orderNumber, status, total };
    }

    /**
     * Get dashboard statistics
     * @returns {Promise<Object>}
     */
    async getDashboardStats() {
        const stats = {};
        
        try {
            stats.totalProducts = await this.getText(this.totalProducts);
        } catch (e) {
            stats.totalProducts = '0';
        }
        
        try {
            stats.totalOrders = await this.getText(this.totalOrders);
        } catch (e) {
            stats.totalOrders = '0';
        }
        
        try {
            stats.totalRevenue = await this.getText(this.totalRevenue);
        } catch (e) {
            stats.totalRevenue = '0';
        }
        
        return stats;
    }

    /**
     * Get success message
     * @returns {Promise<string>}
     */
    async getSuccessMessage() {
        try {
            await this.waitForVisible(this.successMessage, 5000);
            return await this.getText(this.successMessage);
        } catch (error) {
            return '';
        }
    }

    /**
     * Get error message
     * @returns {Promise<string>}
     */
    async getErrorMessage() {
        try {
            await this.waitForVisible(this.errorMessage, 5000);
            return await this.getText(this.errorMessage);
        } catch (error) {
            return '';
        }
    }
}

module.exports = VendorPage;
