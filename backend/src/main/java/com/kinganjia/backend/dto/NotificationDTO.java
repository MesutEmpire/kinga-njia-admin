package com.kinganjia.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.kinganjia.backend.model.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationDTO {
    private Long id;
    private NotificationType type;
    private String title;
    private String message;
    private Boolean isRead;
    private Boolean isEnabled;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}
