import { apiClient } from '../client';
import { Claim, CreateClaimRequest, UpdateClaimRequest } from '../../types/api';

export const claimService = {
    getAll: async (): Promise<Claim[]> => {
        const response = await apiClient.get<Claim[]>('/claims');
        return response.data;
    },

    getById: async (id: number): Promise<Claim> => {
        const response = await apiClient.get<Claim>(`/claims/${id}`);
        return response.data;
    },

    getByUserId: async (userId: number): Promise<Claim[]> => {
        const response = await apiClient.get<Claim[]>(`/users/${userId}/claims`);
        return response.data;
    },

    create: async (data: CreateClaimRequest): Promise<Claim> => {
        const response = await apiClient.post<Claim>('/claims', data);
        return response.data;
    },

    update: async (id: number, data: UpdateClaimRequest): Promise<Claim> => {
        const response = await apiClient.put<Claim>(`/claims/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/claims/${id}`);
    },
};
