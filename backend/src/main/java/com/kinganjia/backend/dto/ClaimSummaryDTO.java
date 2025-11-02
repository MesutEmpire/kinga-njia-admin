package com.kinganjia.backend.dto;

import com.kinganjia.backend.model.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimSummaryDTO {
    private Long id;
    private String location;
    private ClaimStatus status;
    private String hash;
    private SeverityLevel severity;
    private String description;
    private DetectionType detectionType;
}
