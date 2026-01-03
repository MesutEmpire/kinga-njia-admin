import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../api/services/settings';

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

export const useSettings = () => {
    const queryClient = useQueryClient();

    const { data: settings = {}, isLoading, error } = useQuery({
        queryKey: ['settings'],
        queryFn: () => settingsService.getSettings(),
    });

    const updateSettingsMutation = useMutation({
        mutationFn: (updatedSettings: Settings) => settingsService.updateSettings(updatedSettings),
        onSuccess: (data) => {
            queryClient.setQueryData(['settings'], data);
        },
    });

    const updateSettings = (data: Settings, callbacks?: { onSuccess?: () => void; onError?: () => void }) => {
        updateSettingsMutation.mutate(data, {
            onSuccess: () => callbacks?.onSuccess?.(),
            onError: () => callbacks?.onError?.()
        });
    };

    return {
        settings: settings as Settings,
        isLoading,
        error,
        updateSettings,
        isUpdating: updateSettingsMutation.isPending,
    };
};
