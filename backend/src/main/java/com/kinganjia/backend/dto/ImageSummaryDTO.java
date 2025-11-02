package com.kinganjia.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageSummaryDTO {
    private Long id;
    private String url;
    private String hash;
}
