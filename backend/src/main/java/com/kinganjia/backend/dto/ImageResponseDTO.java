package com.kinganjia.backend.dto;

import com.kinganjia.backend.model.Claim;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ImageResponseDTO {
    private Long id;
    private String url;
    private String hash;
    private LocalDateTime timestamp;
    private Claim claim;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
