// src/utils/api.js
// Centralized API utility — eliminates repetition of BASE_URL + common headers across all components.
// NOTE: For multipart/form-data requests (file uploads), do NOT pass Content-Type — 
//       let the browser set it automatically with the correct boundary.

const BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Wrapper around fetch that:
 * - Prepends the base API URL automatically
 * - Includes credentials (cookies) by default
 * - Sets Content-Type: application/json by default
 * - Allows overriding any option (headers, method, body, etc.)
 *
 * @param {string} endpoint - e.g. '/login', '/post/123'
 * @param {RequestInit} options - standard fetch options to merge/override
 * @returns {Promise<Response>}
 */
export const apiFetch = (endpoint, options = {}) => {
    const { headers, ...restOptions } = options;

    return fetch(`${BASE_URL}${endpoint}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...headers, // allow caller to override or add headers
        },
        ...restOptions,
    });
};

/**
 * For file upload requests (multipart/form-data).
 * Does NOT set Content-Type so the browser adds the correct
 * multipart boundary automatically.
 *
 * @param {string} endpoint
 * @param {RequestInit} options
 * @returns {Promise<Response>}
 */
export const apiUpload = (endpoint, options = {}) => {
    return fetch(`${BASE_URL}${endpoint}`, {
        credentials: 'include',
        ...options,
        // No Content-Type header — browser handles multipart boundary
    });
};

/**
 * Returns the full URL for a static asset (like uploaded images).
 * @param {string} path - e.g. 'uploads/abc123.jpg'
 * @returns {string}
 */
export const assetUrl = (path) => `${BASE_URL}/${path?.replace(/\\/g, '/')}`;
