package com.dpx.tracker.dto.employee;

import com.dpx.tracker.enums.EducationalStage;
import com.dpx.tracker.enums.GeneralLevel;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

public record EmployeeUpdateRequest(
        String address,
        GeneralLevel generalLevel,
        EducationalStage educationalStage,
        LocalDate endWorkDate,
        LocalDate updateAt,
        UUID positionId,
        UUID departmentId,
        Set<UUID> skillIds
) {
}
