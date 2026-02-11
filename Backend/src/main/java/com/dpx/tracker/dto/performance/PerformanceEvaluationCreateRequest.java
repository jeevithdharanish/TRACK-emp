package com.dpx.tracker.dto.performance;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public record PerformanceEvaluationCreateRequest(
        @NotNull(message = "Employee ID is required") UUID employeeId,
        @NotNull(message = "Evaluator ID is required") UUID evaluatorId,
        @NotNull(message = "Evaluation date is required") LocalDate evaluationDate,
        @Min(value = 0, message = "New gain points must be non-negative") int newGainPoint,
        @Size(min = 10, message = "Note must contain at least 10 characters") String note
) {
}
