import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ApiResponse<T = any> extends Response {
  data?: T;
}

class Api {
  private baseUrl: string;
  private axiosInstance: any;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
    });
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(errorData.message || 'An error occurred');
    }
    const data = await response.json();
    return { ...response, data };
  }

  async get<T = any>(endpoint: string, options: { params?: Record<string, any> } = {}): Promise<ApiResponse<T>> {
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
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data: any): Promise<any> {
    try {
      // Only add token if it's not a login request
      const token = !endpoint.includes('/auth/login') ? localStorage.getItem('token') : null;
      
      const response = await this.axiosInstance.post<T>(endpoint, data, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // If we have a response, return it as is
        return error.response;
      }
      throw error;
    }
  }

  async put<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
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
    return this.handleResponse<T>(response);
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
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
    return this.handleResponse<T>(response);
  }
}

export const api = new Api(API_BASE_URL);
