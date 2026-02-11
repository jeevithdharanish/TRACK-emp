package com.dpx.tracker.controller;

import com.dpx.tracker.dto.report.DepartmentPerformanceDto;
import com.dpx.tracker.dto.report.PerformanceTrendDto;
import com.dpx.tracker.dto.report.TopPerformerDto;
import com.dpx.tracker.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/performance/top")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_MANAGER','ROLE_HR')")
    public ResponseEntity<List<TopPerformerDto>> getTopPerformers(
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<TopPerformerDto> result = reportService.getTopPerformers(limit, startDate, endDate);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/performance/departments")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_MANAGER','ROLE_HR')")
    public ResponseEntity<List<DepartmentPerformanceDto>> getDepartmentPerformance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<DepartmentPerformanceDto> result = reportService.getDepartmentPerformance(startDate, endDate);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/performance/trends")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_MANAGER','ROLE_HR')")
    public ResponseEntity<List<PerformanceTrendDto>> getPerformanceTrends(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<PerformanceTrendDto> result = reportService.getMonthlyPerformanceTrend(startDate, endDate);
        return ResponseEntity.ok(result);
    }
}
