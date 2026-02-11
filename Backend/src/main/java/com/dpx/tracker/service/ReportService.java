package com.dpx.tracker.service;

import com.dpx.tracker.dto.report.DepartmentPerformanceDto;
import com.dpx.tracker.dto.report.PerformanceTrendDto;
import com.dpx.tracker.dto.report.TopPerformerDto;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {

    List<TopPerformerDto> getTopPerformers(int limit, LocalDate startDate, LocalDate endDate);

    List<DepartmentPerformanceDto> getDepartmentPerformance(LocalDate startDate, LocalDate endDate);

    List<PerformanceTrendDto> getMonthlyPerformanceTrend(LocalDate startDate, LocalDate endDate);
}
