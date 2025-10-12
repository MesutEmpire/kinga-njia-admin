package com.kinganjia.backend.dto;

import com.kinganjia.backend.model.Claim;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ImageRequestDTO {
    private String url;
    private String hash;
    private LocalDateTime timestamp;
    private Claim claim;
}
