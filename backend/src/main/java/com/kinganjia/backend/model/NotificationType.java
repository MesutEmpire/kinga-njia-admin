package com.kinganjia.backend.model;

public enum NotificationType {
    NEW_CLAIM("New Claim Submitted"),
    STATUS_UPDATE("Claim Status Updated"),
    SYSTEM_ALERT("System Alert"),
    DAILY_REPORT("Daily Report"),
    WEEKLY_REPORT("Weekly Report"),
    ASSIGNMENT("Claim Assigned"),
    COMMENT("New Comment");

    private final String displayName;

    NotificationType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
