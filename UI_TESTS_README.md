# UI Automation Tests - Critical Test Cases

This document describes the 5 critical UI automation test cases implemented using Mocha + Selenium WebDriver with Page Object Model (POM).

## 📋 Test Cases Overview

### 1. TC_CL_078: Real-time Cart Badge Sync
**File:** `test/ui/specs/cart_badge_sync.spec.js`

**Purpose:** Verify that the cart badge in the header updates in real-time when a product is added to cart, without requiring a page refresh.

**Test Flow:**
1. Login as a client user
2. Navigate to a product detail page
3. Click "Add to Cart" button
4. Verify cart badge count increases immediately
5. Verify count persists after navigation
6. Verify cart page shows correct items

**Key Validations:**
- ✅ Cart badge updates without page refresh
- ✅ Badge count increases by 1
- ✅ Count persists across navigation
- ✅ Cart page reflects the changes

---

### 2. TC_VEND_013: Vendor Product Creation
**File:** `test/ui/specs/vendor_product_creation.spec.js`

**Purpose:** Verify that a vendor can successfully create a new product through the product creation modal.

**Test Flow:**
1. Login as a vendor user
2. Navigate to vendor products page
3. Click "Add Product" button to open modal
4. Fill in product details (name, category, price, stock)
5. Optionally add description and sale percentage
6. Click "Save" button
7. Verify success message appears (MSG22)
8. Verify product appears in the product list

**Key Validations:**
- ✅ Product modal opens correctly
- ✅ All form fields accept input
- ✅ Category selection works
- ✅ Success message displays
- ✅ Product appears in list after creation

---

### 3. TC_AM_98: Admin Ban User Workflow
**File:** `test/ui/specs/admin_ban_user.spec.js`

**Purpose:** Verify that an admin can ban a user and the user's status updates correctly with proper color coding.

**Test Flow:**
1. Login as an admin user
2. Navigate to admin users management page
3. Find target user in the table
4. Click "Lock/Ban" icon for the user
5. Fill in ban reason in the modal
6. Confirm the ban action
7. Verify success feedback
8. Verify user status changes to "Bị khóa" (Banned)
9. Verify status tag has red color
10. Verify unlock button now appears

**Key Validations:**
- ✅ Ban reason modal opens
- ✅ Ban reason can be entered
- ✅ Ban action processes successfully
- ✅ User status updates to "Bị khóa"
- ✅ Status tag shows red color (banned indicator)
- ✅ Lock icon changes to unlock icon

---

### 4. TC_SUP_001: Real-time Chat Messaging
**File:** `test/ui/specs/real_time_chat.spec.js`

**Purpose:** Verify that the chat system supports real-time messaging with instant message bubble display.

**Test Flow:**
1. Login as a user (vendor/admin/client)
2. Navigate to chat page
3. Open an active chat conversation
4. Type a test message in the input field
5. Click send button
6. Verify message appears instantly in chat window
7. Verify message count increases
8. Verify input field clears after send
9. Send a second message to test consistency
10. Test message persistence after scroll/refresh

**Key Validations:**
- ✅ Chat window loads correctly
- ✅ Message input accepts text
- ✅ Send button is enabled when text is present
- ✅ Message bubble appears instantly (real-time)
- ✅ Message count updates correctly
- ✅ Input clears after sending
- ✅ Multiple messages work consistently
- ✅ WebSocket/real-time integration functional

---

### 5. TC_AUTH_021: UI Validation on Empty Submit
**File:** `test/ui/specs/empty_submit_validation.spec.js`

**Purpose:** Verify that login and signup forms properly validate required fields and prevent submission when fields are empty.

**Test Flow:**

**Login Form:**
1. Navigate to login page
2. Leave all fields empty
3. Click submit button
4. Verify email and password fields show validation
5. Verify form does not submit
6. Test with partial input (email only)

**Signup Form:**
1. Navigate to signup page
2. Leave all 5 fields empty (full name, email, phone, password, confirm password)
3. Click submit button
4. Verify all required fields show validation
5. Verify form does not submit
6. Verify red border/styling on invalid fields

**Key Validations:**
- ✅ Required attribute present on all fields
- ✅ Browser validation triggers on empty submit
- ✅ Form submission prevented when invalid
- ✅ Validation messages display (if applicable)
- ✅ Red border/error styling appears
- ✅ Works for both login and signup forms

---

## 🏗️ Page Object Model Structure

### New Page Objects Created:

1. **HeaderComponent.js** - Header with cart badge, notifications, messages
2. **VendorProductPage.js** - Vendor product management and modal
3. **AdminUserManagementPage.js** - Admin user table and ban functionality
4. **ChatPage.js** - Chat window and messaging interface

### Updated Files:
- `test/ui/page-object/index.js` - Exports all new page objects

---

## 🚀 Running the Tests

### Prerequisites:
```bash
cd cellex-test
npm install
```

### Set up environment variables:
Create or update `.env` file:
```env
# Browser Configuration
BROWSER=edge  # or 'chrome'
HEADLESS=false
BASE_URL=http://localhost:5173

# Test User Credentials
TEST_USER_EMAIL=client@test.com
TEST_USER_PASSWORD=password123

TEST_VENDOR_EMAIL=vendor@test.com
TEST_VENDOR_PASSWORD=password123

TEST_ADMIN_EMAIL=admin@test.com
TEST_ADMIN_PASSWORD=password123

TEST_CHAT_USER_EMAIL=vendor@test.com
TEST_CHAT_USER_PASSWORD=password123

TEST_TARGET_USER_EMAIL=testuser@test.com  # User to ban in admin tests
```

### Run Individual Tests:

```bash
# TC_CL_078: Cart Badge Sync
npm test -- test/ui/specs/cart_badge_sync.spec.js

# TC_VEND_013: Vendor Product Creation
npm test -- test/ui/specs/vendor_product_creation.spec.js

# TC_AM_98: Admin Ban User
npm test -- test/ui/specs/admin_ban_user.spec.js

# TC_SUP_001: Real-time Chat
npm test -- test/ui/specs/real_time_chat.spec.js

# TC_AUTH_021: Empty Submit Validation
npm test -- test/ui/specs/empty_submit_validation.spec.js
```

### Run All UI Tests:
```bash
npm run test:ui
```

### Generate HTML Report:
```bash
npm test -- --reporter mochawesome
```

---

## 📊 Test Reporting

Tests generate detailed console output with:
- ✅ Step-by-step execution logs
- 📝 Test data and inputs
- ⏳ Wait times and state changes
- 🎉 Success confirmations
- ⚠️ Warnings and alternative paths

Example output:
```
🚀 Starting TC_CL_078: Real-time Cart Badge Sync test...
   📝 Logging in as client user...
   ✓ Logged in successfully
   📝 Checking initial cart badge...
   ✓ Initial cart badge count: 2
   📝 Adding product to cart...
   ✅ Cart badge synchronized in real-time without page refresh!
   🎉 TC_CL_078 PASSED!
```

---

## 🔧 Troubleshooting

### Common Issues:

1. **WebDriver not found:**
   - Install Edge driver: `npm install edgedriver --save-dev`
   - Or Chrome driver: `npm install chromedriver --save-dev`

2. **Tests timing out:**
   - Increase timeout in spec files (already set to 60-90 seconds)
   - Check if application is running at BASE_URL

3. **Selectors not found:**
   - Verify application is running the latest version
   - Check that frontend components match the analyzed structure
   - Increase wait times if needed (slow network/server)

4. **Authentication fails:**
   - Update credentials in `.env` file
   - Ensure test users exist in database
   - Check user roles match test requirements

5. **Chat test requires active room:**
   - The chat test needs an existing conversation
   - Create a chat room manually before running test
   - Or skip the test if no active chat available

---

## 📝 Notes

### Test Data Requirements:

1. **TC_CL_078:** Requires at least one product in the system
2. **TC_VEND_013:** Requires valid categories in the system
3. **TC_AM_98:** Requires a test user that can be banned/unbanned
4. **TC_SUP_001:** Requires an active chat conversation
5. **TC_AUTH_021:** No special data required

### Minor Adjustments Made:

- Tests use flexible selectors that adapt to actual UI structure
- Alternative validation paths included for different scenarios
- Graceful handling of missing optional features
- Tests skip gracefully when prerequisites not met
- Cleanup steps included where applicable (e.g., unban user after test)

### Best Practices Followed:

- ✅ Page Object Model (POM) architecture
- ✅ Explicit waits for dynamic content
- ✅ Meaningful test descriptions and logs
- ✅ Independent test cases (no dependencies)
- ✅ Environment-based configuration
- ✅ Detailed assertion messages
- ✅ Cleanup after tests

---

## 🎯 Success Criteria

All 5 test cases verify:
- ✅ Correct UI behavior
- ✅ Real-time updates (cart badge, chat messages)
- ✅ Form validation (client-side)
- ✅ CRUD operations (product creation, user ban)
- ✅ Visual feedback (success messages, status colors)
- ✅ Data persistence (after navigation/refresh)

---

## 📧 Support

For issues or questions:
1. Check test logs for detailed error messages
2. Verify all prerequisites are met
3. Update test credentials in `.env` file
4. Ensure application is running and accessible

---

**Created:** December 31, 2025  
**Framework:** Mocha + Selenium WebDriver  
**Pattern:** Page Object Model (POM)  
**Language:** JavaScript (Node.js)
