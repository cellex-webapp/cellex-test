/**
 * HomePage.js
 * Page Object for Home Page
 * 
 * Mapped from: cellex-web/src/features/clients/pages/Home/HomePage.tsx
 * 
 * Elements identified:
 * - Voice search input: placeholder="Tìm kiếm sản phẩm..."
 * - Category list section
 * - Recommendation section: title="Dành riêng cho bạn"
 * - Product list section: title="Sản phẩm mới nhất"
 * - Product cards with links to product detail
 */

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class HomePage extends BasePage {
    constructor(driver) {
        super(driver);
        
        // Page URL
        this.url = '/';
        
        // ============================================
        // LOCATORS - Based on HomePage.tsx analysis
        // ============================================
        
        // Main container
        this.mainContainer = By.css('.bg-gray-50.min-h-screen');
        
        // Page heading
        this.pageHeading = By.xpath('//h1[contains(text(), "Tìm kiếm sản phẩm")]');
        
        // Search section
        // From: <VoiceSearch placeholder="Tìm kiếm sản phẩm..." />
        this.searchInput = By.css('input[placeholder*="Tìm kiếm"]');
        this.voiceSearchBtn = By.css('button[aria-label*="voice"], button svg[data-icon="audio"]');
        
        // Category section
        // From: <CategoryList title="Danh mục sản phẩm" />
        this.categorySection = By.xpath('//h2[contains(text(), "Danh mục sản phẩm")]/..');
        this.categoryItems = By.css('.category-item, [class*="category"] a');
        
        // Recommendation section
        // From: <RecommendationSectionPreview title="Dành riêng cho bạn" />
        this.recommendationSection = By.xpath('//h2[contains(text(), "Dành riêng cho bạn")]/..');
        this.recommendationViewAll = By.xpath('//h2[contains(text(), "Dành riêng cho bạn")]/..//a[contains(text(), "Xem tất cả")]');
        
        // Product list section
        // From: <ProductListPreview title="Sản phẩm mới nhất" />
        this.productSection = By.xpath('//h2[contains(text(), "Sản phẩm mới nhất")]/..');
        this.productViewAll = By.xpath('//h2[contains(text(), "Sản phẩm mới nhất")]/..//a[contains(text(), "Xem tất cả")]');
        
        // Product cards (from ProductCard.tsx)
        // Each card has: image, name, price, rating
        this.productCards = By.css('.ant-card-hoverable');
        this.productNames = By.css('.ant-card-hoverable .line-clamp-2');
        this.productPrices = By.css('.ant-card-hoverable .text-orange-600');
        // Product links use /products/ route (plural)
        this.productLinks = By.css('a[href*="/products/"]');
        
        // Loading spinner
        this.loadingSpinner = By.css('.ant-spin');
        
        // Empty state
        this.emptyState = By.css('.ant-empty');
    }

    /**
     * Navigate to home page
     */
    async open() {
        await this.navigate(this.url);
        await this.waitForElement(this.mainContainer);
    }

    /**
     * Search for a product
     * @param {string} searchTerm - Term to search for
     */
    async search(searchTerm) {
        await this.type(this.searchInput, searchTerm);
        // Press Enter to submit search
        const searchField = await this.waitForElement(this.searchInput);
        await searchField.sendKeys('\uE007'); // Enter key
    }

    /**
     * Get search input value
     * @returns {Promise<string>}
     */
    async getSearchValue() {
        const element = await this.waitForElement(this.searchInput);
        return await element.getAttribute('value');
    }

    /**
     * Click on a category by name
     * @param {string} categoryName - Name of category to click
     */
    async clickCategory(categoryName) {
        const categoryLocator = By.xpath(`//a[contains(text(), "${categoryName}")]`);
        await this.click(categoryLocator);
    }

    /**
     * Click view all recommendations
     */
    async clickViewAllRecommendations() {
        await this.click(this.recommendationViewAll);
    }

    /**
     * Click view all products
     */
    async clickViewAllProducts() {
        await this.click(this.productViewAll);
    }

    /**
     * Get all product cards count
     * @returns {Promise<number>}
     */
    async getProductCount() {
        await this.sleep(1000); // Wait for products to load
        const products = await this.driver.findElements(this.productCards);
        return products.length;
    }

    /**
     * Click on a product by index
     * @param {number} index - Index of product to click (0-based)
     */
    async clickProductByIndex(index) {
        const products = await this.driver.findElements(this.productLinks);
        if (products.length > index) {
            await products[index].click();
        } else {
            throw new Error(`Product at index ${index} not found. Only ${products.length} products available.`);
        }
    }

    /**
     * Click on a product by name
     * @param {string} productName - Name of product to click
     */
    async clickProductByName(productName) {
        const productLocator = By.xpath(`//div[contains(@class, "line-clamp-2") and contains(text(), "${productName}")]/ancestor::a`);
        await this.click(productLocator);
    }

    /**
     * Click first product in the list (convenience wrapper)
     */
    async clickFirstProduct() {
        await this.waitForProductsLoaded();
        const products = await this.driver.findElements(this.productLinks);
        if (products.length === 0) {
            // try alternative card selector
            const alt = await this.driver.findElements(this.productCards);
            if (alt.length > 0) {
                await alt[0].click();
                return;
            }
            throw new Error('No products found on home page');
        }
        await products[0].click();
    }

    /**
     * Get product names displayed on page
     * @returns {Promise<string[]>}
     */
    async getProductNames() {
        await this.sleep(1000);
        const nameElements = await this.driver.findElements(this.productNames);
        const names = [];
        for (const element of nameElements) {
            names.push(await element.getText());
        }
        return names;
    }

    /**
     * Check if products are loading
     * @returns {Promise<boolean>}
     */
    async isLoading() {
        return await this.isDisplayed(this.loadingSpinner);
    }

    /**
     * Check if category section is displayed
     * @returns {Promise<boolean>}
     */
    async isCategorySectionDisplayed() {
        return await this.isDisplayed(this.categorySection);
    }

    /**
     * Check if product section is displayed
     * @returns {Promise<boolean>}
     */
    async isProductSectionDisplayed() {
        return await this.isDisplayed(this.productSection);
    }

    /**
     * Wait for products to load
     */
    async waitForProductsLoaded() {
        await this.driver.wait(async () => {
            const loading = await this.isLoading();
            return !loading;
        }, this.timeout);
        await this.sleep(500); // Additional wait for render
    }
}

module.exports = HomePage;
