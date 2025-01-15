import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL;
class Api {
    constructor(baseUrl) {
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "axiosInstance", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.baseUrl = baseUrl;
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
        });
    }
    getAuthToken() {
        return localStorage.getItem('token');
    }
    async handleResponse(response) {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
            throw new Error(errorData.message || 'An error occurred');
        }
        const data = await response.json();
        return { ...response, data };
    }
    async get(endpoint, options = {}) {
        const token = this.getAuthToken();
        if (!token) {
            throw new Error('No token provided');
        }
        const url = new URL(`${this.baseUrl}${endpoint}`);
        if (options.params) {
            Object.entries(options.params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
        });
        return this.handleResponse(response);
    }
    async post(endpoint, data) {
        try {
            // Only add token if it's not a login request
            const token = !endpoint.includes('/auth/login') ? localStorage.getItem('token') : null;
            const response = await this.axiosInstance.post(endpoint, data, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            return response;
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // If we have a response, return it as is
                return error.response;
            }
            throw error;
        }
    }
    async put(endpoint, data) {
        const token = this.getAuthToken();
        if (!token) {
            throw new Error('No token provided');
        }
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });
        return this.handleResponse(response);
    }
    async delete(endpoint) {
        const token = this.getAuthToken();
        if (!token) {
            throw new Error('No token provided');
        }
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
        });
        return this.handleResponse(response);
    }
}
export const api = new Api(API_BASE_URL);
