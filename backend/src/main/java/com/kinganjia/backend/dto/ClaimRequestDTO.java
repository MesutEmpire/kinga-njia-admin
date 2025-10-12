package com.kinganjia.backend.dto;

import com.kinganjia.backend.model.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ClaimRequestDTO {
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
}
