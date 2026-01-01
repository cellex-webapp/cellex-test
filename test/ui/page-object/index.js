/**
 * index.js
 * Page Objects Index File
 * 
 * Export all page objects for easy importing in test specs
 */

const BasePage = require('./BasePage');
const LoginPage = require('./LoginPage');
const SignupPage = require('./SignupPage');
const OTPPage = require('./OTPPage');
const HomePage = require('./HomePage');
const CartPage = require('./CartPage');
const CheckoutPage = require('./CheckoutPage');
const AdminUserPage = require('./AdminUserPage');
const HeaderComponent = require('./HeaderComponent');
const VendorProductPage = require('./VendorProductPage');
const AdminUserManagementPage = require('./AdminUserManagementPage');
const ChatPage = require('./ChatPage');

module.exports = {
    BasePage,
    LoginPage,
    SignupPage,
    OTPPage,
    HomePage,
    CartPage,
    CheckoutPage,
    AdminUserPage,
    HeaderComponent,
    VendorProductPage,
    AdminUserManagementPage,
    ChatPage
};
