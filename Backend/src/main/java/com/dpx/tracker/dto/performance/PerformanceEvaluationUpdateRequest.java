package com.dpx.tracker.dto.performance;

import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record PerformanceEvaluationUpdateRequest(
        LocalDate evaluationDate,
        Integer newGainPoint,
        @Size(min = 10, message = "Note must contain at least 10 characters") String note
) {
}
