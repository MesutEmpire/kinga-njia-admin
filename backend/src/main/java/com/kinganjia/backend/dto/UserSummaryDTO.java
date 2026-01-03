package com.kinganjia.backend.dto;

import com.kinganjia.backend.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
}
