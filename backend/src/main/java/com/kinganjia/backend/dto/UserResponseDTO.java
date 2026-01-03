package com.kinganjia.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.kinganjia.backend.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponseDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ClaimSummaryDTO> claims;
    private List<NotificationDTO> notifications;
}
