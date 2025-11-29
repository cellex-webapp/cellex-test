# Cellex Test Automation

Automated testing suite for Cellex web application using Mocha, Selenium WebDriver, and Page Object Model (POM).

## 📋 Prerequisites

- Node.js (v14 or higher)
- Chrome/Firefox browser installed
- ChromeDriver/GeckoDriver (automatically managed by selenium-webdriver)

## 🚀 Installation

```bash
npm install
```

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
# Browser Configuration
BROWSER=chrome
HEADLESS=false

# Application URLs
BASE_URL=http://localhost:5173
API_URL=http://localhost:8080/api

# Timeouts (milliseconds)
DEFAULT_TIMEOUT=30000
PAGE_LOAD_TIMEOUT=60000
IMPLICIT_WAIT=10000

# Test User Credentials
ADMIN_EMAIL=admin@cellex.com
ADMIN_PASSWORD=Admin@123

VENDOR_EMAIL=vendor@cellex.com
VENDOR_PASSWORD=Vendor@123

CUSTOMER_EMAIL=customer@cellex.com
CUSTOMER_PASSWORD=Customer@123

# Screenshots and Reports
SCREENSHOTS_PATH=./screenshots
REPORTS_PATH=./reports
ENABLE_SCREENSHOTS=true

# Window Size
WINDOW_WIDTH=1920
WINDOW_HEIGHT=1080
```

## 📁 Project Structure

```
cellex-test/
├── config/
│   ├── env.js              # Environment configuration
│   └── setup.js            # Global test setup
├── drivers/
│   └── driverManager.js    # WebDriver management
├── page-objects/
│   ├── BasePage.js         # Base page class
│   ├── AuthPage.js         # Authentication pages
│   ├── CartPage.js         # Shopping cart page
│   ├── CheckoutPage.js     # Checkout page
│   └── VendorPage.js       # Vendor dashboard page
├── tests/
│   ├── auth/
│   │   ├── login.test.js
│   │   └── register.test.js
│   ├── buying/
│   │   ├── cart.test.js
│   │   └── checkout.test.js
│   └── vendor/
│       └── products.test.js
├── utils/
│   └── dataGenerator.js    # Test data generator
└── package.json
```

## 🧪 Running Tests

Run all tests:
```bash
npm test
```

Run specific test suite:
```bash
npm run test:auth      # Authentication tests
npm run test:buying    # Shopping/buying tests
npm run test:vendor    # Vendor management tests
```

Run in different browsers:
```bash
npm run test:chrome    # Chrome browser
npm run test:firefox   # Firefox browser
```

Run in headless mode:
```bash
npm run test:headless
```

## 📖 Page Object Model (POM)

### BasePage
Base class for all page objects with common methods:
- `navigate(path)` - Navigate to URL
- `findElement(locator)` - Find element with wait
- `click(locator)` - Click element
- `type(locator, text)` - Type text
- `getText(locator)` - Get element text
- `isDisplayed(locator)` - Check visibility
- `waitForVisible(locator)` - Wait for element
- And more utility methods...

### AuthPage
Handles authentication operations:
- `login(email, password)` - Perform login
- `register(userData)` - Register new user
- `logout()` - Logout user
- `isLoggedIn()` - Check login status

### CartPage
Shopping cart operations:
- `getCartItemCount()` - Get number of items
- `increaseQuantity(index)` - Increase item quantity
- `decreaseQuantity(index)` - Decrease item quantity
- `removeItemByIndex(index)` - Remove item
- `proceedToCheckout()` - Go to checkout

### CheckoutPage
Checkout process:
- `fillShippingInfo(data)` - Fill shipping details
- `fillPaymentInfo(data)` - Fill payment details
- `selectPaymentMethod(method)` - Select payment method
- `placeOrder()` - Complete order

### VendorPage
Vendor dashboard operations:
- `createProduct(data)` - Add new product
- `editProduct(index)` - Edit product
- `deleteProduct(index)` - Delete product
- `getProductCount()` - Get products count
- `getDashboardStats()` - Get statistics

## 🎲 Data Generator

Generate random test data:

```javascript
const DataGenerator = require('./utils/dataGenerator');

// Generate user
const user = DataGenerator.generateUser();

// Generate address
const address = DataGenerator.generateAddress();

// Generate product
const product = DataGenerator.generateProduct();

// Generate payment data
const payment = DataGenerator.generatePaymentData();
```

## 📸 Screenshots

Screenshots are automatically taken:
- On test failure
- When `ENABLE_SCREENSHOTS=true` in .env

Screenshots are saved in the `screenshots/` directory.

## 📊 Reports

Test reports are generated using Mochawesome (optional).

To generate HTML report:
```bash
npm test -- --reporter mochawesome
```

## 🔧 Best Practices

1. **Wait Strategies**: Use explicit waits instead of hard-coded sleeps
2. **Page Objects**: Keep locators and actions in page objects
3. **Test Data**: Use DataGenerator for random test data
4. **Independence**: Each test should be independent
5. **Cleanup**: Tests clean up after themselves
6. **Descriptive**: Use descriptive test names

## 🐛 Debugging

Enable verbose logging:
```bash
DEBUG=true npm test
```

Keep browser open on failure:
```bash
KEEP_BROWSER_OPEN=true npm test
```

## 📝 Writing New Tests

1. Create test file in appropriate directory
2. Import required page objects
3. Use setup/teardown hooks
4. Write descriptive test cases
5. Use assertions from Chai

Example:
```javascript
const { expect } = require('../../config/setup');
const AuthPage = require('../../page-objects/AuthPage');

describe('My Test Suite', function() {
    let authPage;

    beforeEach(function() {
        authPage = new AuthPage(this.driver);
    });

    it('should do something', async function() {
        await authPage.navigateToLogin();
        // Test code...
        expect(result).to.be.true;
    });
});
```

## 🤝 Contributing

1. Follow existing code structure
2. Add tests for new features
3. Update documentation
4. Use meaningful commit messages

## 📄 License

ISC
