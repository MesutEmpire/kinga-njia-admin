import { apiClient } from '../client';
import { Image, CreateImageRequest, UpdateImageRequest } from '../../types/api';

export const imageService = {
    getAll: async (): Promise<Image[]> => {
        const response = await apiClient.get<Image[]>('/images');
        return response.data;
    },

    getById: async (id: number): Promise<Image> => {
        const response = await apiClient.get<Image>(`/images/${id}`);
        return response.data;
    },

    getByClaimId: async (claimId: number): Promise<Image[]> => {
        const response = await apiClient.get<Image[]>(`/claims/${claimId}/images`);
        return response.data;
    },

    create: async (data: CreateImageRequest): Promise<Image> => {
        const response = await apiClient.post<Image>('/images', data);
        return response.data;
    },

    update: async (id: number, data: UpdateImageRequest): Promise<Image> => {
        const response = await apiClient.put<Image>(`/images/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/images/${id}`);
    },
};
