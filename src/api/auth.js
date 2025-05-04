import axios from './axios';

const API_URL = 'http://localhost:8000';

export const authApi = {
    async register(userData) {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Registration failed');
        }
    },

    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Login failed');
        }
    },

    async getCurrentUser() {
        try {
            const response = await axios.get(`${API_URL}/auth/me`);
            return response.data;
        } catch (error) {
            localStorage.removeItem('token');
            throw new Error(error.response?.data?.detail || 'Failed to fetch user');
        }
    }
};