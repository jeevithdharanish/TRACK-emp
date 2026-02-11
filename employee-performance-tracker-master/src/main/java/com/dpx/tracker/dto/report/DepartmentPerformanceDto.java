package com.dpx.tracker.dto.report;

import java.util.UUID;

public record DepartmentPerformanceDto(
        UUID departmentId,
        String departmentName,
        double averageScore,
        double averageEfficiency
) {
}
