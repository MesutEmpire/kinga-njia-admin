package com.kinganjia.backend.controller;

import com.kinganjia.backend.dto.StatisticsResponseDTO;
import com.kinganjia.backend.dto.response.ApiResponse;
import com.kinganjia.backend.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/statistics")
@RequiredArgsConstructor
@Slf4j
public class StatisticsController {
    private final StatisticsService statisticsService;

    @GetMapping
    public ResponseEntity<ApiResponse<StatisticsResponseDTO>> getStatistics(
            @RequestParam(value = "days", required = false, defaultValue = "30") int days) {
        StatisticsResponseDTO statistics = statisticsService.getStatisticsForPeriod(days);
        return ResponseEntity.ok(ApiResponse.ok("Statistics retrieved successfully", statistics));
    }

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<StatisticsResponseDTO.TodayActivityDTO>> getTodayActivity() {
        StatisticsResponseDTO.TodayActivityDTO todayActivity = statisticsService.getTodayActivity();
        return ResponseEntity.ok(ApiResponse.ok("Today's activity retrieved successfully", todayActivity));
    }
}
