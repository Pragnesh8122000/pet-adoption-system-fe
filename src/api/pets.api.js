import { apiClient } from './client.js';

export const getAllPets = async (params) => {
    try {
        const response = await apiClient.get('/getAllPets', { params });
        return response?.data;
    } catch (error) {
        console.error('Error fetching pets:', error);
        throw error;
    }
};

export const getPetDetails = async (id) => {
    try {
        // Backend expects ID, assuming it's a query param or path param based on user request "GET /getPetDetails".
        // Usually details are /getPetDetails/:id or /getPetDetails?id=...
        // The user said "Send pet ID as required by backend".
        // Let's assume conventional query param if not specified, OR path param if standard REST, but user said "Do NOT assume REST-ideal naming".
        // However, usually for "GET /getPetDetails" it might be "?id=" unless it is "/getPetDetails/:id".
        // Looking at typical "non-REST" styles, it's often query params.
        // Let's try query param `?id=` first. 
        // Wait, commonly it could be /getPetDetails/:id. 
        // Let's stick to appending ID if it looks like a path, or query if not. 
        // BUT the user prompt info said "GET /getPetDetails".
        // It didn't say "/getPetDetails/:id".
        // So I will use query param: `/getPetDetails?id=${id}`.
        const response = await apiClient.get(`/getPetDetails?id=${id}`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching pet details:', error);
        throw error;
    }
};

export const createPets = async (data) => {
    try {
        const response = await apiClient.post('/createPets', data);
        return response?.data;
    } catch (error) {
        console.error('Error creating pet:', error);
        throw error;
    }
};

export const updatePets = async (data) => {
    try {
        // Backend contract says "PUT /updatePets". Usually requires ID + data.
        // Assuming data contains the ID or it's passed in body.
        const response = await apiClient.put('/updatePets', data);
        return response?.data;
    } catch (error) {
        console.error('Error updating pet:', error);
        throw error;
    }
};

export const deletePet = async (id) => {
    try {
        // "DELETE /deletePet"
        // Likely query param `?id=` or body. DELETE with body is rare/discouraged but possible.
        // Using query param is safer for "non-REST" if ID is not in path.
        const response = await apiClient.delete(`/deletePet?id=${id}`);
        return response?.data;
    } catch (error) {
        console.error('Error deleting pet:', error);
        throw error;
    }
};
