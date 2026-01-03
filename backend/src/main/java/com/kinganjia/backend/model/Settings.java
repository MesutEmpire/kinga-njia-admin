package com.kinganjia.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Settings {
    @Id
    @Builder.Default
    private Long id = 1L; // Single global settings record

    // Profile Settings
    private String organizationName;
    private String organizationEmail;
    private String organizationPhone;
    private String organizationAddress;

    // Notification Settings
    private Boolean emailNotificationsEnabled;
    private Boolean claimSubmissionNotifications;
    private Boolean claimApprovalNotifications;
    private Boolean systemAlertNotifications;

    // Security Settings
    private Boolean twoFactorAuthEnabled;
    private Integer sessionTimeoutMinutes;
    private Boolean ipWhitelistingEnabled;

    // System Settings
    private Integer dataRetentionDays;
    private String backupFrequency; // daily, weekly, monthly
    private Boolean maintenanceModeEnabled;
    private String maintenanceMessage;

    // Audit
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
