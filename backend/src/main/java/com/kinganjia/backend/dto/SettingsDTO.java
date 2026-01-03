package com.kinganjia.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SettingsDTO {
    private Long id;
    private String organizationName;
    private String organizationEmail;
    private String organizationPhone;
    private String organizationAddress;
    private Boolean emailNotificationsEnabled;
    private Boolean claimSubmissionNotifications;
    private Boolean claimApprovalNotifications;
    private Boolean systemAlertNotifications;
    private Boolean twoFactorAuthEnabled;
    private Integer sessionTimeoutMinutes;
    private Boolean ipWhitelistingEnabled;
    private Integer dataRetentionDays;
    private String backupFrequency;
    private Boolean maintenanceModeEnabled;
    private String maintenanceMessage;
    private LocalDateTime updatedAt;
}
