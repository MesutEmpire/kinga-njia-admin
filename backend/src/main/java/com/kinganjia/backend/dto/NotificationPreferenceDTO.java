package com.kinganjia.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.kinganjia.backend.model.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationPreferenceDTO {
    private NotificationType type;
    private Boolean isEnabled;
    private String displayName;
    private String description;

    public NotificationPreferenceDTO(NotificationType type, Boolean isEnabled) {
        this.type = type;
        this.isEnabled = isEnabled;
        this.displayName = type.getDisplayName();
    }
}
