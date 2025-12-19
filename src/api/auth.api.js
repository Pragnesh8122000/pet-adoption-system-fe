import { apiClient } from './client.js';

export const login = async (data) => {
    try {
        const response = await apiClient.post('/login', data);
        return response?.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const register = async (data) => {
    try {
        const response = await apiClient.post('/register', data);
        return response?.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const fetchUserDetails = async () => {
    try {
        const response = await apiClient.get('/fetchUserDetails');
        return response?.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
