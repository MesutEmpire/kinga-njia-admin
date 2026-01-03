import { apiClient } from '../client';

interface Settings {
    id?: number;
    organizationName?: string;
    organizationEmail?: string;
    organizationPhone?: string;
    organizationAddress?: string;
    emailNotificationsEnabled?: boolean;
    claimSubmissionNotifications?: boolean;
    claimApprovalNotifications?: boolean;
    systemAlertNotifications?: boolean;
    twoFactorAuthEnabled?: boolean;
    sessionTimeoutMinutes?: number;
    ipWhitelistingEnabled?: boolean;
    dataRetentionDays?: number;
    backupFrequency?: string;
    maintenanceModeEnabled?: boolean;
    maintenanceMessage?: string;
}

export const settingsService = {
    getSettings: async (): Promise<Settings> => {
        const { data } = await apiClient.get('/settings');
        return data;
    },

    updateSettings: async (settings: Settings): Promise<Settings> => {
        const { data } = await apiClient.put('/settings', settings);
        return data;
    },
};
