import { apiClient } from '../client';
import { User, CreateUserRequest, UpdateUserRequest } from '../../types/api';

export const userService = {
    getAll: async (): Promise<User[]> => {
        const response = await apiClient.get<User[]>('/users');
        return response.data;
    },

    getById: async (id: number): Promise<User> => {
        const response = await apiClient.get<User>(`/users/${id}`);
        return response.data;
    },

    create: async (data: CreateUserRequest): Promise<User> => {
        const response = await apiClient.post<User>('/users', data);
        return response.data;
    },

    update: async (id: number, data: UpdateUserRequest): Promise<User> => {
        const response = await apiClient.put<User>(`/users/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/users/${id}`);
    },
};
