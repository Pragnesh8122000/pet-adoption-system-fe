import { apiClient } from './client.js';

export const adoptPet = async (data) => {
    try {
        // "PUT /adoptPet"
        const response = await apiClient.put('/adoptPet', data);
        return response?.data;
    } catch (error) {
        console.error('Error adopting pet:', error);
        throw error;
    }
};

export const getUsersAdoptionApplications = async () => {
    try {
        const response = await apiClient.get('/getUsersAdoptionApplications');
        return response?.data;
    } catch (error) {
        console.error('Error fetching user applications:', error);
        throw error;
    }
};

export const updateAdoptionStatus = async (data) => {
    try {
        // "PUT /updateAdoptionStatus"
        const response = await apiClient.put('/updateAdoptionStatus', data);
        return response?.data;
    } catch (error) {
        console.error('Error updating adoption status:', error);
        throw error;
    }
};

export const getAllAdoptionApplications = async () => {
    try {
        const response = await apiClient.get('/getAllAdoptionApplications');
        return response?.data;
    } catch (error) {
        console.error('Error fetching all applications:', error);
        throw error;
    }
};
