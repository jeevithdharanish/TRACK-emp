package com.dpx.tracker.dto.report;

public record PerformanceTrendDto(
        int year,
        int month,
        double averageScore,
        int evaluationsCount
) {
}
