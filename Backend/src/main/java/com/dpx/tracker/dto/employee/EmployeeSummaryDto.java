package com.dpx.tracker.dto.employee;

import java.time.LocalDate;
import java.util.UUID;

public record EmployeeSummaryDto(
        UUID id,
        String fullName,
        String department,
        String position,
        LocalDate startWorkDate
) {
}
