# Copilot Instructions for Automated Test Script Generation  
*(Mocha + Page Object Model)*

These rules define how GitHub Copilot must **interpret test-case tables** and **generate Mocha test scripts** using Page Object Models.

---

# 1. Input Format (Test Case Table)

Copilot will receive test cases in the following format:

```
Category | Test Case ID | Test Case Description | PreRequisites | Steps | Test Procedures | Test Case Expected Result | Actual Result | Status | Note
         |              |                       |               | Steps to Perform | Step Expected Result |  |  |  |
```

Copilot must read:

- **Steps to Perform** → list of user actions  
- **Step Expected Result** → expected result per step  
- **Test Case Expected Result** → final assertion target  
- **Category** → determines folder + PageObject  

---

# 2. Directory Structure Rules

Create test file under `tests/<category>/`:

| Category | Folder |
|---------|--------|
| Authentication | `tests/auth/` |
| Shopping / Cart | `tests/buying/` |
| Vendor Management | `tests/vendor/` |
| Other | Create folder name in lowercase, no spaces |

If folder does not exist → create it.

---

# 3. Naming Rules

- **File name**: lowercase + hyphen  
  ```
  <test-case-id>.test.js
  ```
  Example:
  ```
  tc_auth_001.test.js
  ```

- **Describe block**:  
  ```
  '[Category] Tests'
  ```

- **It block**: Use Test Case Description exactly as given.

- **Page Object name** must be UpperCamelCase:
  - Authentication → `AuthPage`
  - Cart → `CartPage`
  - Vendor → `VendorPage`

If unsure → propose the correct PageObject name.

---

# 4. Page Object Auto-Selection

Determine Page Object by:

- Using Category first
- If steps mention a specific page (e.g., “Navigate to checkout”) → import additional PageObject

Example import:

```js
const AuthPage = require('../../page-objects/AuthPage');
```

Never include `.js` in import path.

---

# 5. Test Script Structure (Mandatory Template)

```javascript
const { expect } = require('../../config/setup');
const config = require('../../config/env');
const [PageObject] = require('../../page-objects/[PageObject]');
const DataGenerator = require('../../utils/dataGenerator');

describe('[Category] Tests', function() {
    let page;

    beforeEach(async function() {
        page = new [PageObject](this.driver);

        // Handle prerequisites automatically here
        // Fill values from "PreRequisites"
    });

    /**
     * Test Case: [Test Case ID]
     * Description: [Test Case Description]
     * Prerequisites: [PreRequisites]
     */
    it('[Test Case Description]', async function() {

        // For each step:
        // Step X: [Steps to Perform]
        // Expected: [Step Expected Result]
        // -> Auto-generate test code using PageObject APIs

        // Final Assertion
        // Expected: [Test Case Expected Result]
        expect(finalResult).to.[assertion];
    });
});
```

---

# 6. Steps-to-Code Mapping Rules (Very Important)

Copilot must convert steps to code as follows:

### Interaction Actions

| Step starts with | Generate |
|------------------|----------|
| **Navigate / Go to** | `await page.navigateToX()` |
| **Click** | `await page.click(selector)` |
| **Enter / Input / Type** | `await page.type(selector, value)` |
| **Select** | `await page.select(selector, value)` |
| **Upload** | `await page.upload(selector, filePath)` |
| **Verify / Check / Expect** | assertion block |

If Copilot cannot determine the selector → add:

```js
// TODO: Add selector in PageObject
```

---

# 7. Extracting Steps (Important)

“Steps to Perform” may contain **comma-separated steps** or **newline-separated steps**.

Copilot **must split them** into:

```
Step 1
Step 2
Step 3
...
```

Same for “Step Expected Result”.

---

# 8. Assertion Mapping (Precise)

Convert expected results to Chai assertions:

| Expected Phrase Contains | Assertion |
|--------------------------|-----------|
| “should display” | `expect(value).to.exist` or `to.be.true` |
| “should equal” | `expect(value).to.equal(expected)` |
| “should contain” | `expect(value).to.include(expected)` |
| “should be empty” | `expect(value).to.be.empty` |
| “should redirect to” | `expect(url).to.include(path)` |
| “should show error” | `expect(errorMessage).to.not.be.empty` |
| “visible” | `expect(isVisible).to.be.true` |

---

# 9. Getting Actual Result

Final Result must be derived from PageObject based on expected result:

- If expectation mentions **redirect** →  
  `finalResult = await page.getCurrentUrl()`

- If expectation mentions **visibility** →  
  `finalResult = await page.isVisible(selector)`

- If expectation mentions **text** →  
  `finalResult = await page.getText(selector)`

- If unspecified → Copilot must infer the proper getter.

---

# 10. Wait & Stability Rules

Copilot must:

- Always use explicit wait:
  ```
  await page.waitForVisible(selector);
  ```
- Avoid `sleep()` unless step explicitly requires waiting.
- Add try/catch for risky operations.

---

# 11. Prerequisites Implementation

Put prerequisites in:

```js
beforeEach(async function() {
   // setup from PreRequisites
});
```

If prerequisite includes:

- Login → login function
- Create data → use DataGenerator
- Navigate page → call navigate API

If unclear → add TODO comment.

---

# 12. Error Handling

Every generated test must include:

- Meaningful comments
- Try/catch on unstable steps
- Automatic screenshot on failure (handled by setup.js)

---

# 13. Multiple Page Handling

If a test switches between pages:

```js
const CheckoutPage = require('../../page-objects/CheckoutPage');
let checkoutPage = new CheckoutPage(this.driver);
```

Copilot must detect this based on step description.

---

# 14. When Copilot Must Ask for Clarification

Copilot must request clarification ONLY when:

- Category does not match any folder
- Page Object does not exist and cannot be inferred
- Expected result is ambiguous
- Step describes feature not present in PageObject

---

# 15. Example Test Case (Input)

```
Category: Authentication
Test Case ID: TC_AUTH_001
Test Case Description: User should be able to login with valid credentials
PreRequisites: User exists with email test@example.com and password Test@123
Steps to Perform: Navigate to login page, Enter email, Enter password, Click login button
Step Expected Result: Login page loads, Email field accepts input, Password accepts input, User redirected to dashboard
Test Case Expected Result: User logged in and sees dashboard menu
```

---

# 16. Example Output (Generated Script)

```javascript
const { expect } = require('../../config/setup');
const config = require('../../config/env');
const AuthPage = require('../../page-objects/AuthPage');

describe('Authentication Tests', function() {
    let page;

    beforeEach(async function() {
        page = new AuthPage(this.driver);
    });

    /**
     * Test Case: TC_AUTH_001
     * Description: User should be able to login with valid credentials
     * Prerequisites: User exists with email test@example.com and password Test@123
     */
    it('User should be able to login with valid credentials', async function() {
        // Step 1: Navigate to login page
        // Expected: Login page loads
        await page.navigateToLogin();
        await page.waitForVisible(page.loginEmailInput);

        // Step 2: Enter email
        // Expected: Email field accepts input
        await page.type(page.loginEmailInput, 'test@example.com');

        // Step 3: Enter password
        // Expected: Password accepts input
        await page.type(page.loginPasswordInput, 'Test@123');

        // Step 4: Click login button
        // Expected: User redirected to dashboard
        await page.click(page.loginButton);
        await page.waitForVisible(page.dashboardMenu);

        // Final Assertion
        // Expected: User logged in and sees dashboard menu
        const visible = await page.isVisible(page.dashboardMenu);
        expect(visible).to.be.true;
    });
});
```

---

**Copilot must strictly follow everything above whenever a test-case table is provided.**
