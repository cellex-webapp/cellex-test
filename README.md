# 🧪 Cellex Automation Test Suite

> Framework tự động kiểm thử end-to-end cho ứng dụng Cellex E-commerce

[![Mocha](https://img.shields.io/badge/Test%20Framework-Mocha-8D6748?style=flat-square)](https://mochajs.org/)
[![Selenium](https://img.shields.io/badge/UI%20Testing-Selenium%20WebDriver-43B02A?style=flat-square)](https://www.selenium.dev/)
[![Chai](https://img.shields.io/badge/Assertions-Chai-A30701?style=flat-square)](https://www.chaijs.com/)

## 📖 Giới thiệu

Dự án cung cấp bộ test automation hoàn chỉnh cho ứng dụng Cellex E-commerce:

- **UI Testing**: Kiểm thử giao diện với Selenium WebDriver và Page Object Model pattern
- **API Testing**: Kiểm thử RESTful API với Axios
- **Test Coverage**: Authentication, Shopping Cart, Product Management, Admin Features, Real-time Chat
- **Test Data**: Quản lý dữ liệu tập trung với JSON configuration  
- **Reporting**: HTML reports với Mochawesome và screenshots tự động

## 🎯 Test Cases

| Test ID | Mô tả | Trang kiểm thử |
|---------|-------|----------------|
| TC_AUTH_021 | UI Validation on Empty Submit | Login/Signup |
| TC_AUTH_063 | Full Registration Flow | Signup → OTP → Home |
| TC_CL_078 | Real-time Cart Badge Sync | Product → Cart |
| TC_VEND_013 | Vendor Product Creation | Vendor Products |
| TC_AM_98 | Admin Ban User Workflow | Admin Users |
| TC_SUP_001 | Real-time Chat Messaging | Chat |

## 🛠️ Công nghệ

| Technology | Version | Mục đích |
|------------|---------|----------|
| **Node.js** | v18+ | Runtime environment |
| **Mocha** | v10.2.0 | Test framework |
| **Selenium WebDriver** | v4.16.0 | Browser automation |
| **Chai** | v4.3.10 | Assertion library |
| **Axios** | v1.6.2 | HTTP client cho API tests |
| **Mochawesome** | v7.1.3 | HTML test reporter |
| **ChromeDriver** | v131.0.0 | Chrome WebDriver |

## 📂 Cấu trúc dự án

```
cellex-test/
├── .env.example              # Template cấu hình môi trường
├── package.json              # Dependencies và npm scripts
├── test-data.json            # Dữ liệu test tập trung
├── mochawesome-report/       # HTML test reports (auto-generated)
└── test/
    ├── api/
    │   ├── helpers/          # API client helper
    │   └── specs/            # API test specs
    └── ui/
        ├── page-object/      # Page Object Model classes
        │   ├── BasePage.js
        │   ├── LoginPage.js
        │   ├── SignupPage.js
        │   ├── HomePage.js
        │   ├── CartPage.js
        │   ├── HeaderComponent.js
        │   ├── VendorProductPage.js
        │   ├── AdminUserManagementPage.js
        │   └── ChatPage.js
        └── specs/            # UI test specs
            ├── login.spec.js
            ├── register.spec.js
            ├── cart_badge_sync.spec.js
            ├── vendor_product_creation.spec.js
            ├── admin_ban_user.spec.js
            └── real_time_chat.spec.js
```

## 🚀 Hướng dẫn sử dụng

### 1. Cài đặt Dependencies

```bash
cd cellex-test
npm install
```

### 2. Chuẩn bị Test Data

Tạo database và thêm dữ liệu test từ file `test-data.json`:
- Tạo các user accounts (admin, vendor, client, testuser)
- Tạo products và categories
- Đảm bảo backend và frontend đang chạy

### 3. Cấu hình Environment

Copy `.env.example` thành `.env` và cập nhật thông tin:
- BASE_URL (frontend URL)
- API_URL (backend URL)  
- Test user credentials

### 4. Chạy Tests

```bash
# Chạy tất cả tests
npm test

# Chạy UI tests với HTML report
npm run test:ui

# Chạy API tests
npm run test:api

# Chạy test cụ thể
npx mocha test/ui/specs/login.spec.js --timeout 60000
```

### 5. Xem Test Reports

Sau khi chạy tests, mở file report: `mochawesome-report/mochawesome.html`

## 📊 Page Objects

Các Page Object có sẵn và methods chính:

| Page Object | URL | Methods |
|-------------|-----|---------|
| LoginPage | `/login` | `login(email, password)`, `clickSignup()` |
| SignupPage | `/signup` | `signup({fullName, email, phone, password})` |
| HomePage | `/` | `search(term)`, `clickFirstProduct()` |
| HeaderComponent | Component | `getCartBadgeCount()`, `clickCart()` |
| CartPage | `/cart` | `getCartItems()`, `updateQuantity()`, `proceedToCheckout()` |
| VendorProductPage | `/vendor/products` | `createProduct(data)`, `clickAddProduct()` |
| AdminUserManagementPage | `/admin/users` | `findUserByEmail()`, `clickLockButton()` |
| ChatPage | `/vendor/chat` | `typeMessage(text)`, `clickSend()` |

## 💡 Best Practices

### Test Data
- Sử dụng timestamp để tạo dữ liệu unique
- Tham chiếu dữ liệu từ `test-data.json`

### Clean State
- Clear cookies trước mỗi test
- Đảm bảo mỗi test độc lập


## 🐛 Troubleshooting

| Vấn đề | Giải pháp |
|--------|-----------|
| Test timeout | Tăng timeout hoặc kiểm tra backend/network |
| Element not found | Verify selector với DevTools, đảm bảo page đã load |
| Login failed | Kiểm tra credentials trong .env và database |
| ChromeDriver mismatch | Cập nhật: `npm install chromedriver@latest` |

## 📚 Tài liệu

- **test-data.json**: Chứa tất cả test data (users, products, selectors)
- [Mocha Documentation](https://mochajs.org/)
- [Selenium WebDriver](https://www.selenium.dev/documentation/)
- [Chai Assertions](https://www.chaijs.com/)

---

**Last Updated**: January 1, 2026  
**Version**: 1.0.0
