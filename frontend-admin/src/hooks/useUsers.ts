import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../api/services/users';
import { CreateUserRequest, UpdateUserRequest } from '../types/api';

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: userService.getAll,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
};

export const useUser = (id: number) => {
    return useQuery({
        queryKey: ['users', id],
        queryFn: () => userService.getById(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateUserRequest) => userService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
            userService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => userService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
