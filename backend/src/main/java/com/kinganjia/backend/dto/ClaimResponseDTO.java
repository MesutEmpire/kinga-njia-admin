package com.kinganjia.backend.dto;

import com.kinganjia.backend.model.*;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ClaimResponseDTO {
    private Long id;
    private User user;
    private String location;
    private Double latitude;
    private Double longitude;
    private ClaimStatus status;
    private String hash;
    private SeverityLevel severity;
    private String description;
    private DetectionType detectionType;
    private LocalDateTime confirmationTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Image> images;
}
