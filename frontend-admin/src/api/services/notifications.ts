import { apiClient } from '../client';
import { Notification, NotificationType, NotificationPreference } from '../../types/api';

export const notificationService = {
    /**
     * Get all notifications for user
     */
    getUserNotifications: async (userId: number): Promise<Notification[]> => {
        const response = await apiClient.get<Notification[]>(`/notifications/user/${userId}`);
        return response.data;
    },

    /**
     * Get unread notifications count
     */
    getUnreadCount: async (userId: number): Promise<{ count: number }> => {
        const response = await apiClient.get<{ count: number }>(`/notifications/user/${userId}/unread-count`);
        return response.data;
    },

    /**
     * Get unread notifications
     */
    getUnreadNotifications: async (userId: number): Promise<Notification[]> => {
        const response = await apiClient.get<Notification[]>(`/notifications/user/${userId}/unread`);
        return response.data;
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (notificationId: number): Promise<Notification> => {
        const response = await apiClient.patch<Notification>(`/notifications/${notificationId}/read`);
        return response.data;
    },

    /**
     * Mark all as read
     */
    markAllAsRead: async (userId: number): Promise<void> => {
        await apiClient.patch(`/notifications/user/${userId}/mark-all-read`);
    },

    /**
     * Toggle notification preference
     */
    togglePreference: async (userId: number, type: NotificationType, enabled: boolean): Promise<Notification[]> => {
        const response = await apiClient.patch<Notification[]>(`/notifications/user/${userId}/preference`, null, {
            params: { type, enabled }
        });
        return response.data;
    },

    /**
     * Delete notification
     */
    deleteNotification: async (notificationId: number): Promise<void> => {
        await apiClient.delete(`/notifications/${notificationId}`);
    },

    /**
     * Delete all user notifications
     */
    deleteAllUserNotifications: async (userId: number): Promise<void> => {
        await apiClient.delete(`/notifications/user/${userId}`);
    },

    /**
     * Get notifications by date range
     */
    getByDateRange: async (userId: number, startDate: string, endDate: string): Promise<Notification[]> => {
        const response = await apiClient.get<Notification[]>(`/notifications/user/${userId}/range`, {
            params: { startDate, endDate }
        });
        return response.data;
    }
};
