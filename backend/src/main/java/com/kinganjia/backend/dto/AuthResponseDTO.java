package com.kinganjia.backend.dto;


import com.kinganjia.backend.dto.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String type = "Bearer";
    private Long expiresIn;
    private UserResponseDTO user;

    public AuthResponseDTO(String token, Long expiresIn, UserResponseDTO user) {
        this.token = token;
        this.type = "Bearer";
        this.expiresIn = expiresIn;
        this.user = user;
    }
}