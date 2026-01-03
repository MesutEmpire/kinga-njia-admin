package com.kinganjia.backend.service;

import com.kinganjia.backend.dto.StatisticsResponseDTO;
import com.kinganjia.backend.dto.StatisticsResponseDTO.LocationStatsDTO;
import com.kinganjia.backend.dto.StatisticsResponseDTO.TimeSeriesDataDTO;
import com.kinganjia.backend.dto.StatisticsResponseDTO.TodayActivityDTO;
import com.kinganjia.backend.model.ClaimStatus;
import com.kinganjia.backend.model.SeverityLevel;
import com.kinganjia.backend.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatisticsService {
    private final ClaimRepository claimRepository;

    @Transactional(readOnly = true)
    public StatisticsResponseDTO getStatisticsForPeriod(int days) {
        LocalDateTime startDate = LocalDateTime.of(LocalDate.now().minusDays(days), LocalTime.MIN);
        LocalDateTime endDate = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        
        var periodClaims = claimRepository.findByCreatedAtBetween(startDate, endDate);
        
        long totalClaims = periodClaims.size();
        long verifiedClaims = periodClaims.stream().filter(c -> c.getStatus() == ClaimStatus.VERIFIED).count();
        long pendingClaims = periodClaims.stream().filter(c -> c.getStatus() == ClaimStatus.PENDING).count();
        long rejectedClaims = periodClaims.stream().filter(c -> c.getStatus() == ClaimStatus.REJECTED).count();
        long resolvedClaims = 0L;
        double verifiedPercentage = totalClaims > 0 
            ? Math.round((double) verifiedClaims / totalClaims * 1000.0) / 10.0
            : 0.0;
        double pendingPercentage = totalClaims > 0 
            ? Math.round((double) pendingClaims / totalClaims * 1000.0) / 10.0
            : 0.0;
        double rejectedPercentage = totalClaims > 0 
            ? Math.round((double) rejectedClaims / totalClaims * 1000.0) / 10.0
            : 0.0;
        double resolvedPercentage = 0.0;
        
        double verificationRate = totalClaims > 0 
            ? (double) verifiedClaims / totalClaims * 100 
            : 0.0;

        long previousPeriodTotal = getPreviousPeriodClaimsCount(days);
        double totalClaimsChange = calculatePercentageChange(totalClaims, previousPeriodTotal);
        
        long previousPeriodVerified = getPreviousPeriodVerifiedCount(days);
        double previousVerificationRate = previousPeriodTotal > 0 
            ? (double) previousPeriodVerified / previousPeriodTotal * 100 
            : 0.0;
        double verificationRateChange = calculatePercentageChange(verificationRate, previousVerificationRate);

        List<TimeSeriesDataDTO> timeSeries;
        if (days <= 7) {
            timeSeries = getClaimsByLastDays(days);
        } else if (days <= 90) {
            timeSeries = getClaimsByLastDays(Math.min(days, 30));
        } else {
            timeSeries = getClaimsByLastMonths(12);
        }

        return StatisticsResponseDTO.builder()
            .totalClaims(totalClaims)
            .verifiedClaims(verifiedClaims)
            .pendingClaims(pendingClaims)
            .rejectedClaims(rejectedClaims)
            .resolvedClaims(resolvedClaims)
            .verificationRate(Math.round(verificationRate * 10.0) / 10.0)
            .verifiedPercentage(verifiedPercentage)
            .pendingPercentage(pendingPercentage)
            .rejectedPercentage(rejectedPercentage)
            .resolvedPercentage(resolvedPercentage)
            .totalClaimsChange(totalClaimsChange)
            .verificationRateChange(verificationRateChange)
            .activeUsersChange(0.0)
            .todayActivity(getTodayActivity())
            .weeklyActivity(getWeeklyActivity())
            .processingMetrics(getProcessingMetrics())
            .claimsBySeverity(getClaimsBySeverityForPeriod(startDate, endDate))
            .topLocations(getTopLocationsForPeriod(startDate, endDate, 5))
            .claimsByTimePeriod(timeSeries)
            .build();
    }

    @Transactional(readOnly = true)
    public StatisticsResponseDTO getOverallStatistics() {
        return getStatisticsForPeriod(30);
    }

    private Map<String, Long> getClaimsBySeverityForPeriod(LocalDateTime start, LocalDateTime end) {
        List<Object[]> results = claimRepository.countBySeverityAndPeriod(start, end);
        
        Map<String, Long> severityMap = new HashMap<>();
        for (SeverityLevel severity : SeverityLevel.values()) {
            severityMap.put(severity.name(), 0L);
        }
        
        for (Object[] row : results) {
            SeverityLevel severity = (SeverityLevel) row[0];
            Long count = (Long) row[1];
            severityMap.put(severity.name(), count);
        }
        
        return severityMap;
    }

    private List<LocationStatsDTO> getTopLocationsForPeriod(LocalDateTime start, LocalDateTime end, int limit) {
        List<Object[]> results = claimRepository.findTopLocationsByPeriod(start, end);
        
        return results.stream()
            .limit(limit)
            .map(row -> LocationStatsDTO.builder()
                .location((String) row[0])
                .claimCount((Long) row[1])
                .build())
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TodayActivityDTO getTodayActivity() {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        
        long newClaims = claimRepository.countByCreatedAtBetween(startOfDay, endOfDay);
        
        var todayClaims = claimRepository.findByCreatedAtBetween(startOfDay, endOfDay);
        
        long processed = todayClaims.stream()
            .filter(c -> c.getStatus() != ClaimStatus.PENDING)
            .count();
            
        long verified = todayClaims.stream()
            .filter(c -> c.getStatus() == ClaimStatus.VERIFIED)
            .count();
            
        long rejected = todayClaims.stream()
            .filter(c -> c.getStatus() == ClaimStatus.REJECTED)
            .count();

        return TodayActivityDTO.builder()
            .newClaims(newClaims)
            .processed(processed)
            .verified(verified)
            .rejected(rejected)
            .build();
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getClaimsBySeverity() {
        Map<String, Long> severityMap = new HashMap<>();
        
        for (SeverityLevel severity : SeverityLevel.values()) {
            long count = claimRepository.countBySeverity(severity);
            severityMap.put(severity.name(), count);
        }
        
        return severityMap;
    }

    @Transactional(readOnly = true)
    public List<LocationStatsDTO> getTopLocations(int limit) {
        List<Object[]> results = claimRepository.findTopLocations(limit);
        
        return results.stream()
            .limit(limit)
            .map(row -> LocationStatsDTO.builder()
                .location((String) row[0])
                .claimCount((Long) row[1])
                .build())
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TimeSeriesDataDTO> getClaimsByLastDays(int days) {
        List<TimeSeriesDataDTO> timeSeries = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            LocalDateTime startOfDay = LocalDateTime.of(date, LocalTime.MIN);
            LocalDateTime endOfDay = LocalDateTime.of(date, LocalTime.MAX);
            
            long count = claimRepository.countByCreatedAtBetween(startOfDay, endOfDay);
            
            timeSeries.add(TimeSeriesDataDTO.builder()
                .period(date.format(formatter))
                .count(count)
                .build());
        }
        
        return timeSeries;
    }

    @Transactional(readOnly = true)
    public List<TimeSeriesDataDTO> getClaimsByLastMonths(int months) {
        List<TimeSeriesDataDTO> timeSeries = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusMonths(i);
            LocalDateTime startOfMonth = LocalDateTime.of(date.withDayOfMonth(1), LocalTime.MIN);
            LocalDateTime endOfMonth = LocalDateTime.of(
                date.withDayOfMonth(date.lengthOfMonth()), 
                LocalTime.MAX
            );
            
            long count = claimRepository.countByCreatedAtBetween(startOfMonth, endOfMonth);
            
            timeSeries.add(TimeSeriesDataDTO.builder()
                .period(date.format(formatter))
                .count(count)
                .build());
        }
        
        return timeSeries;
    }

    @Transactional(readOnly = true)
    public StatisticsResponseDTO.WeeklyActivityDTO getWeeklyActivity() {
        LocalDateTime startOfWeek = LocalDateTime.of(LocalDate.now().minusDays(6), LocalTime.MIN);
        LocalDateTime endOfWeek = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        
        var weeklyClaims = claimRepository.findByCreatedAtBetween(startOfWeek, endOfWeek);
        
        long newClaims = weeklyClaims.size();
        long processed = weeklyClaims.stream()
            .filter(c -> c.getStatus() != ClaimStatus.PENDING)
            .count();
        long verified = weeklyClaims.stream()
            .filter(c -> c.getStatus() == ClaimStatus.VERIFIED)
            .count();
        long rejected = weeklyClaims.stream()
            .filter(c -> c.getStatus() == ClaimStatus.REJECTED)
            .count();
        long backlog = claimRepository.countByStatus(ClaimStatus.PENDING);

        return StatisticsResponseDTO.WeeklyActivityDTO.builder()
            .newClaims(newClaims)
            .processed(processed)
            .verified(verified)
            .rejected(rejected)
            .backlog(backlog)
            .build();
    }

    @Transactional(readOnly = true)
    public StatisticsResponseDTO.ProcessingMetricsDTO getProcessingMetrics() {
        var processedClaims = claimRepository.findProcessedClaimsForMetrics();
        
        if (processedClaims.isEmpty()) {
            return StatisticsResponseDTO.ProcessingMetricsDTO.builder()
                .averageProcessingTimeHours(0.0)
                .fastestTimeMinutes(0.0)
                .slowestTimeHours(0.0)
                .targetTimeHours(3.0)
                .targetMet(true)
                .build();
        }
        
        List<Long> processingTimesMillis = processedClaims.stream()
            .map(c -> {
                long millis = java.time.temporal.ChronoUnit.MILLIS
                    .between(c.getCreatedAt(), c.getUpdatedAt());
                return Math.max(millis, 0);
            })
            .toList();
        
        double averageMillis = processingTimesMillis.stream()
            .mapToLong(Long::longValue)
            .average()
            .orElse(0);
        double averageHours = Math.round(averageMillis / 3600000.0 * 10.0) / 10.0;
        
        long fastestMillis = processingTimesMillis.stream()
            .mapToLong(Long::longValue)
            .min()
            .orElse(0);
        double fastestMinutes = Math.round((double) fastestMillis / 60000.0 * 10.0) / 10.0;
        
        long slowestMillis = processingTimesMillis.stream()
            .mapToLong(Long::longValue)
            .max()
            .orElse(0);
        double slowestHours = Math.round((double) slowestMillis / 3600000.0 * 10.0) / 10.0;
        
        double targetHours = 3.0;
        boolean targetMet = averageHours <= targetHours;

        return StatisticsResponseDTO.ProcessingMetricsDTO.builder()
            .averageProcessingTimeHours(averageHours)
            .fastestTimeMinutes(fastestMinutes)
            .slowestTimeHours(slowestHours)
            .targetTimeHours(targetHours)
            .targetMet(targetMet)
            .build();
    }

    private long getPreviousPeriodClaimsCount(int days) {
        LocalDateTime startPrevious = LocalDateTime.of(LocalDate.now().minusDays(days * 2), LocalTime.MIN);
        LocalDateTime endPrevious = LocalDateTime.of(LocalDate.now().minusDays(days), LocalTime.MAX);
        return claimRepository.countByCreatedAtBetween(startPrevious, endPrevious);
    }

    private long getPreviousPeriodVerifiedCount(int days) {
        LocalDateTime startPrevious = LocalDateTime.of(LocalDate.now().minusDays(days * 2), LocalTime.MIN);
        LocalDateTime endPrevious = LocalDateTime.of(LocalDate.now().minusDays(days), LocalTime.MAX);
        return claimRepository.findByCreatedAtBetweenAndStatus(startPrevious, endPrevious, ClaimStatus.VERIFIED)
            .size();
    }

    private double calculatePercentageChange(double current, double previous) {
        if (previous == 0) {
            return 0.0;
        }
        return Math.round(((current - previous) / previous * 100) * 10.0) / 10.0;
    }
}
