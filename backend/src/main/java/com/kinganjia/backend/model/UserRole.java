package com.kinganjia.backend.model;

public enum UserRole {
    ADMIN("Administrator - Full system access"),
    INVESTIGATOR("Investigator - Claim management and investigation"),
    ANALYST("Analyst - View-only analytics and reports"),
    STAFF("Staff - General staff user");

    private final String description;

    UserRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
