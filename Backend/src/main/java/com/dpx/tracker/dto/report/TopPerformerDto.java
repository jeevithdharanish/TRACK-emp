package com.dpx.tracker.dto.report;

import java.util.UUID;

public record TopPerformerDto(
        UUID employeeId,
        String employeeName,
        int totalScore,
        double averageEfficiency
) {
}
