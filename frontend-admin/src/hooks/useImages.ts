import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { imageService } from '../api/services/images';
import { CreateImageRequest, UpdateImageRequest } from '../types/api';

export const useImages = () => {
    return useQuery({
        queryKey: ['images'],
        queryFn: imageService.getAll,
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchOnWindowFocus: false,
    });
};

export const useImage = (id: number) => {
    return useQuery({
        queryKey: ['images', id],
        queryFn: () => imageService.getById(id),
        enabled: !!id,
        staleTime: 60 * 1000, // 1 minute
    });
};

export const useImagesByClaim = (claimId: number) => {
    return useQuery({
        queryKey: ['images', 'claim', claimId],
        queryFn: () => imageService.getByClaimId(claimId),
        enabled: !!claimId,
        staleTime: 60 * 1000, // 1 minute
    });
};

export const useCreateImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateImageRequest) => imageService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['images'] });
        },
    });
};

export const useUpdateImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateImageRequest }) =>
            imageService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['images'] });
            queryClient.invalidateQueries({ queryKey: ['images', variables.id] });
        },
    });
};

export const useDeleteImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => imageService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['images'] });
        },
    });
};
