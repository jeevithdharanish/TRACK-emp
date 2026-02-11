package com.dpx.tracker.dto.performance;

import java.time.LocalDate;
import java.util.UUID;

public record PerformanceEvaluationDetailDto(
        UUID id,
        LocalDate evaluationDate,
        int scoreBeforeEvaluation,
        int newGainPoint,
        int totalScore,
        double efficiencyProgress,
        String note,
        UUID employeeId,
        String employeeName,
        UUID evaluatorId,
        String evaluatorName
) {
}
