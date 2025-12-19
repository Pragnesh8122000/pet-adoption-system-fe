import { toast } from 'react-toastify';
import { apiClient } from './client.js';

// export const signup = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
//     const response = await apiClient.post('/auth/signup', data);
//     return response.data.data;
// };


export const loginApi = async (data) => {
    try {
        const response = await apiClient.post('/login', data);
        console.log(response)
        return response?.data?.data;
    } catch (error) {
        console.error(error)
    }
};