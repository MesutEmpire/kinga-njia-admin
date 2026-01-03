import { apiClient } from '../client';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    type?: string;        // Backend includes "Bearer"
    expiresIn?: number;   // Backend includes token expiry time
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role?: string;
    };
}

export const authService = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },

    getCurrentUser: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    register: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },
};
