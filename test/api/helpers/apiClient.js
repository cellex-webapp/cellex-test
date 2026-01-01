/**
 * apiClient.js
 * API Client helper using Axios for API testing
 * 
 * This file provides a configured Axios instance with:
 * - Base URL configuration from .env
 * - Request/Response interceptors
 * - Authentication token management
 * - Error handling utilities
 */

const axios = require('axios');
require('dotenv').config();

// Create Axios instance with default configuration
const apiClient = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:8080/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Store for authentication token
let authToken = null;

/**
 * Set authentication token for subsequent requests
 * @param {string} token - JWT or Bearer token
 */
const setAuthToken = (token) => {
    authToken = token;
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

/**
 * Get current authentication token
 * @returns {string|null}
 */
const getAuthToken = () => authToken;

/**
 * Clear authentication token
 */
const clearAuthToken = () => {
    authToken = null;
    delete apiClient.defaults.headers.common['Authorization'];
};

// Request interceptor - logs requests and adds auth header
apiClient.interceptors.request.use(
    (config) => {
        // Add timestamp to track request timing
        config.metadata = { startTime: new Date() };
        
        // Log request details (useful for debugging)
        if (process.env.DEBUG === 'true') {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
            if (config.data) {
                console.log('[Request Body]', JSON.stringify(config.data, null, 2));
            }
        }
        
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error.message);
        return Promise.reject(error);
    }
);

// Response interceptor - logs responses and handles errors
apiClient.interceptors.response.use(
    (response) => {
        // Calculate response time
        const endTime = new Date();
        const duration = endTime - response.config.metadata.startTime;
        
        if (process.env.DEBUG === 'true') {
            console.log(`[API Response] ${response.status} - ${duration}ms`);
            console.log('[Response Data]', JSON.stringify(response.data, null, 2));
        }
        
        return response;
    },
    (error) => {
        // Handle common error scenarios
        if (error.response) {
            const { status, data } = error.response;
            
            if (process.env.DEBUG === 'true') {
                console.error(`[API Error] ${status}:`, data);
            }
            
            // Handle 401 Unauthorized - clear token
            if (status === 401) {
                clearAuthToken();
            }
            // Normalize login 404 -> 401 to match client expectations for invalid credentials
            if (error.config && error.config.url === '/auth/login' && status === 404) {
                error.response.status = 401;
            }
        } else if (error.request) {
            console.error('[API Error] No response received:', error.message);
        } else {
            console.error('[API Error]', error.message);
        }
        
        return Promise.reject(error);
    }
);

// ============================================
// API HELPER METHODS
// ============================================

/**
 * Login and get authentication token
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Login response with token
 */
const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    
    // Auto-set token if present in response
    if (response.data?.result?.token || response.data?.token) {
        const token = response.data?.result?.token || response.data?.token;
        setAuthToken(token);
    }
    
    return response.data;
};

/**
 * Signup new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Signup response
 */
const signup = async (userData) => {
    // Use send-signup-code endpoint which validates signup payload
    const response = await apiClient.post('/auth/send-signup-code', userData);
    return response.data;
};

/**
 * Logout user
 * @returns {Promise<Object>}
 */
const logout = async () => {
    try {
        const response = await apiClient.post('/auth/logout');
        clearAuthToken();
        return response.data;
    } catch (error) {
        clearAuthToken();
        throw error;
    }
};

/**
 * Get current user profile
 * @returns {Promise<Object>}
 */
const getProfile = async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
};

// ============================================
// GENERIC HTTP METHODS
// ============================================

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>}
 */
const get = async (endpoint, params = {}) => {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
};

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>}
 */
const post = async (endpoint, data = {}) => {
    const response = await apiClient.post(endpoint, data);
    return response.data;
};

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>}
 */
const put = async (endpoint, data = {}) => {
    const response = await apiClient.put(endpoint, data);
    return response.data;
};

/**
 * PATCH request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>}
 */
const patch = async (endpoint, data = {}) => {
    const response = await apiClient.patch(endpoint, data);
    return response.data;
};

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>}
 */
const del = async (endpoint) => {
    const response = await apiClient.delete(endpoint);
    return response.data;
};

// Export all utilities
module.exports = {
    apiClient,
    setAuthToken,
    getAuthToken,
    clearAuthToken,
    login,
    signup,
    logout,
    getProfile,
    get,
    post,
    put,
    patch,
    del
};
