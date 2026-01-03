import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../api/services/notifications';
import { useAuth } from '../contexts/AuthContext';

export const useNotifications = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications', user?.id],
        queryFn: () => user?.id ? notificationService.getUserNotifications(user.id) : [],
        enabled: !!user?.id,
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['notifications', 'unread-count', user?.id],
        queryFn: async () => {
            if (!user?.id) return 0;
            const result = await notificationService.getUnreadCount(user.id);
            return typeof result === 'number' ? result : result.count;
        },
        enabled: !!user?.id,
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    const { data: unreadNotifications = [] } = useQuery({
        queryKey: ['notifications', 'unread', user?.id],
        queryFn: () => user?.id ? notificationService.getUnreadNotifications(user.id) : [],
        enabled: !!user?.id,
        refetchInterval: 30000,
    });

    const markAsReadMutation = useMutation({
        mutationFn: (notificationId: number) => notificationService.markAsRead(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: () => user?.id ? notificationService.markAllAsRead(user.id) : Promise.resolve(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const deleteNotificationMutation = useMutation({
        mutationFn: (notificationId: number) => notificationService.deleteNotification(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    return {
        notifications,
        unreadNotifications,
        unreadCount,
        isLoading,
        markAsRead: markAsReadMutation.mutate,
        markAllAsRead: markAllAsReadMutation.mutate,
        deleteNotification: deleteNotificationMutation.mutate,
    };
};
