import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { claimService } from '../api/services/claims';
import { CreateClaimRequest, UpdateClaimRequest } from '../types/api';

export const useClaims = () => {
    return useQuery({
        queryKey: ['claims'],
        queryFn: claimService.getAll,
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: true,
    });
};

export const useClaim = (id: number) => {
    return useQuery({
        queryKey: ['claims', id],
        queryFn: () => claimService.getById(id),
        enabled: !!id,
        staleTime: 30 * 1000, // 30 seconds
    });
};

export const useClaimsByUser = (userId: number) => {
    return useQuery({
        queryKey: ['claims', 'user', userId],
        queryFn: () => claimService.getByUserId(userId),
        enabled: !!userId,
    });
};

export const useCreateClaim = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateClaimRequest) => claimService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['claims'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
            queryClient.invalidateQueries({ queryKey: ['todayActivity'] });
        },
    });
};

export const useUpdateClaim = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateClaimRequest }) =>
            claimService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['claims'] });
            queryClient.invalidateQueries({ queryKey: ['claims', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
            queryClient.invalidateQueries({ queryKey: ['todayActivity'] });
        },
    });
};

export const useDeleteClaim = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => claimService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['claims'] });
            queryClient.invalidateQueries({ queryKey: ['statistics'] });
            queryClient.invalidateQueries({ queryKey: ['todayActivity'] });
        },
    });
};
