package com.kinganjia.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.kinganjia.backend.model.Claim;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ImageResponseDTO {
    private Long id;
    private String url;
    private String hash;
    private LocalDateTime timestamp;
//    private Claim claim;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private ClaimSummaryDTO claim;
    private UserSummaryDTO user;
}
