package com.kinganjia.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatisticsResponseDTO {
    private Long totalClaims;
    private Long verifiedClaims;
    private Long pendingClaims;
    private Long rejectedClaims;
    private Long resolvedClaims;
    private Double verificationRate;
    
    // Percentage changes (calculated on backend)
    private Double verifiedPercentage;
    private Double pendingPercentage;
    private Double rejectedPercentage;
    private Double resolvedPercentage;
    
    // Percentage changes compared to previous period
    private Double totalClaimsChange;
    private Double verificationRateChange;
    private Double activeUsersChange;
    
    private TodayActivityDTO todayActivity;
    private WeeklyActivityDTO weeklyActivity;
    private ProcessingMetricsDTO processingMetrics;
    private Map<String, Long> claimsBySeverity;
    private List<LocationStatsDTO> topLocations;
    private List<TimeSeriesDataDTO> claimsByTimePeriod;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TodayActivityDTO {
        private Long newClaims;
        private Long processed;
        private Long verified;
        private Long rejected;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WeeklyActivityDTO {
        private Long newClaims;
        private Long processed;
        private Long verified;
        private Long rejected;
        private Long backlog; // Unprocessed claims
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProcessingMetricsDTO {
        private Double averageProcessingTimeHours;
        private Double fastestTimeMinutes;
        private Double slowestTimeHours;
        private Double targetTimeHours;
        private Boolean targetMet;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LocationStatsDTO {
        private String location;
        private Long claimCount;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TimeSeriesDataDTO {
        private String period;
        private Long count;
    }
}
