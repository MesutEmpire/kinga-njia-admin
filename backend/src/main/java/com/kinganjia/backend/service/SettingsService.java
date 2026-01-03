package com.kinganjia.backend.service;

import com.kinganjia.backend.dto.SettingsDTO;
import com.kinganjia.backend.model.Settings;
import com.kinganjia.backend.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService {
    private final SettingsRepository settingsRepository;

    @Transactional(readOnly = true)
    public SettingsDTO getSettings() {
        Settings settings = settingsRepository.findById(1L)
                .orElse(Settings.builder().id(1L).build());
        return mapToDTO(settings);
    }

    @Transactional
    public SettingsDTO updateSettings(SettingsDTO dto) {
        Settings settings = settingsRepository.findById(1L)
                .orElse(Settings.builder().id(1L).build());

        if (dto.getOrganizationName() != null) {
            settings.setOrganizationName(dto.getOrganizationName());
        }
        if (dto.getOrganizationEmail() != null) {
            settings.setOrganizationEmail(dto.getOrganizationEmail());
        }
        if (dto.getOrganizationPhone() != null) {
            settings.setOrganizationPhone(dto.getOrganizationPhone());
        }
        if (dto.getOrganizationAddress() != null) {
            settings.setOrganizationAddress(dto.getOrganizationAddress());
        }
        if (dto.getEmailNotificationsEnabled() != null) {
            settings.setEmailNotificationsEnabled(dto.getEmailNotificationsEnabled());
        }
        if (dto.getClaimSubmissionNotifications() != null) {
            settings.setClaimSubmissionNotifications(dto.getClaimSubmissionNotifications());
        }
        if (dto.getClaimApprovalNotifications() != null) {
            settings.setClaimApprovalNotifications(dto.getClaimApprovalNotifications());
        }
        if (dto.getSystemAlertNotifications() != null) {
            settings.setSystemAlertNotifications(dto.getSystemAlertNotifications());
        }
        if (dto.getTwoFactorAuthEnabled() != null) {
            settings.setTwoFactorAuthEnabled(dto.getTwoFactorAuthEnabled());
        }
        if (dto.getSessionTimeoutMinutes() != null) {
            settings.setSessionTimeoutMinutes(dto.getSessionTimeoutMinutes());
        }
        if (dto.getIpWhitelistingEnabled() != null) {
            settings.setIpWhitelistingEnabled(dto.getIpWhitelistingEnabled());
        }
        if (dto.getDataRetentionDays() != null) {
            settings.setDataRetentionDays(dto.getDataRetentionDays());
        }
        if (dto.getBackupFrequency() != null) {
            settings.setBackupFrequency(dto.getBackupFrequency());
        }
        if (dto.getMaintenanceModeEnabled() != null) {
            settings.setMaintenanceModeEnabled(dto.getMaintenanceModeEnabled());
        }
        if (dto.getMaintenanceMessage() != null) {
            settings.setMaintenanceMessage(dto.getMaintenanceMessage());
        }

        Settings savedSettings = settingsRepository.save(settings);
        return mapToDTO(savedSettings);
    }

    private SettingsDTO mapToDTO(Settings settings) {
        return SettingsDTO.builder()
                .id(settings.getId())
                .organizationName(settings.getOrganizationName())
                .organizationEmail(settings.getOrganizationEmail())
                .organizationPhone(settings.getOrganizationPhone())
                .organizationAddress(settings.getOrganizationAddress())
                .emailNotificationsEnabled(settings.getEmailNotificationsEnabled())
                .claimSubmissionNotifications(settings.getClaimSubmissionNotifications())
                .claimApprovalNotifications(settings.getClaimApprovalNotifications())
                .systemAlertNotifications(settings.getSystemAlertNotifications())
                .twoFactorAuthEnabled(settings.getTwoFactorAuthEnabled())
                .sessionTimeoutMinutes(settings.getSessionTimeoutMinutes())
                .ipWhitelistingEnabled(settings.getIpWhitelistingEnabled())
                .dataRetentionDays(settings.getDataRetentionDays())
                .backupFrequency(settings.getBackupFrequency())
                .maintenanceModeEnabled(settings.getMaintenanceModeEnabled())
                .maintenanceMessage(settings.getMaintenanceMessage())
                .updatedAt(settings.getUpdatedAt())
                .build();
    }
}
