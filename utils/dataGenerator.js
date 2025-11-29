const faker = require('faker');

/**
 * Data Generator Utility
 * Generates random test data for automation tests
 */
class DataGenerator {
    /**
     * Generate random user data
     * @returns {Object} User data
     */
    static generateUser() {
        return {
            name: faker.name.findName(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email().toLowerCase(),
            password: this.generatePassword(),
            phone: faker.phone.phoneNumber('##########'),
            username: faker.internet.userName().toLowerCase()
        };
    }

    /**
     * Generate secure password
     * @param {number} length - Password length
     * @returns {string} Generated password
     */
    static generatePassword(length = 10) {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const special = '@#$%';
        
        let password = '';
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];
        
        const allChars = uppercase + lowercase + numbers + special;
        for (let i = password.length; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        
        // Shuffle password
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    /**
     * Generate random address data
     * @returns {Object} Address data
     */
    static generateAddress() {
        return {
            fullName: faker.name.findName(),
            phone: faker.phone.phoneNumber('##########'),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            province: faker.address.state(),
            postalCode: faker.address.zipCode('#####'),
            country: 'Vietnam'
        };
    }

    /**
     * Generate random product data
     * @returns {Object} Product data
     */
    static generateProduct() {
        return {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price(10000, 1000000, 0)),
            stock: faker.datatype.number({ min: 10, max: 100 }),
            category: faker.commerce.department(),
            sku: faker.datatype.uuid().substring(0, 8).toUpperCase()
        };
    }

    /**
     * Generate random payment data
     * @returns {Object} Payment data
     */
    static generatePaymentData() {
        return {
            method: 'credit_card',
            cardNumber: '4111111111111111', // Test card number
            cardHolder: faker.name.findName(),
            expiryDate: '12/25',
            cvv: '123'
        };
    }

    /**
     * Generate random order data
     * @returns {Object} Order data
     */
    static generateOrder() {
        return {
            orderNumber: `ORD-${faker.datatype.number({ min: 10000, max: 99999 })}`,
            totalAmount: parseFloat(faker.commerce.price(50000, 500000, 0)),
            status: this.getRandomOrderStatus(),
            paymentMethod: this.getRandomPaymentMethod()
        };
    }

    /**
     * Generate random email
     * @param {string} prefix - Email prefix
     * @returns {string} Email address
     */
    static generateEmail(prefix = '') {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        const domain = 'test.com';
        return prefix ? `${prefix}_${timestamp}_${random}@${domain}` : `user_${timestamp}_${random}@${domain}`;
    }

    /**
     * Generate random phone number
     * @returns {string} Phone number
     */
    static generatePhone() {
        const prefixes = ['090', '091', '092', '093', '094', '095', '096', '097', '098', '099'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const remaining = faker.datatype.number({ min: 1000000, max: 9999999 });
        return `${prefix}${remaining}`;
    }

    /**
     * Generate unique timestamp-based identifier
     * @param {string} prefix - Identifier prefix
     * @returns {string} Unique identifier
     */
    static generateUniqueId(prefix = 'ID') {
        return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    }

    /**
     * Get random order status
     * @returns {string} Order status
     */
    static getRandomOrderStatus() {
        const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }

    /**
     * Get random payment method
     * @returns {string} Payment method
     */
    static getRandomPaymentMethod() {
        const methods = ['credit_card', 'debit_card', 'paypal', 'cod', 'bank_transfer'];
        return methods[Math.floor(Math.random() * methods.length)];
    }

    /**
     * Generate random number in range
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number
     */
    static generateNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generate random string
     * @param {number} length - String length
     * @returns {string} Random string
     */
    static generateString(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    /**
     * Generate test user with specific role
     * @param {string} role - User role (admin, vendor, customer)
     * @returns {Object} User data
     */
    static generateUserByRole(role = 'customer') {
        const user = this.generateUser();
        user.role = role;
        user.email = `${role}_${Date.now()}@test.com`;
        return user;
    }

    /**
     * Generate Vietnamese province
     * @returns {string} Province name
     */
    static generateVietnameseProvince() {
        const provinces = [
            'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
            'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu'
        ];
        return provinces[Math.floor(Math.random() * provinces.length)];
    }
}

module.exports = DataGenerator;
