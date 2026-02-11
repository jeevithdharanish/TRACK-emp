package com.dpx.tracker.dto.employee;

import com.dpx.tracker.enums.EducationalStage;
import com.dpx.tracker.enums.Gender;
import com.dpx.tracker.enums.GeneralLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

public record EmployeeCreateRequest(
        @NotBlank(message = "First name is required") String firstName,
        String middleName,
        @NotBlank(message = "Last name is required") String lastName,
        @NotBlank(message = "CNP is required") String cnp,
        @NotNull(message = "General level is required") GeneralLevel generalLevel,
        @NotBlank(message = "Address is required") String address,
        @NotNull(message = "Gender is required") Gender gender,
        @NotNull(message = "Educational stage is required") EducationalStage educationalStage,
        @NotNull(message = "Birth date is required") LocalDate birthDate,
        @NotNull(message = "Start work date is required") LocalDate startWorkDate,
        @NotNull(message = "Department ID is required") UUID departmentId,
        @NotNull(message = "Company ID is required") UUID companyId,
        @NotNull(message = "Position ID is required") UUID positionId,
        UUID userId,
        Set<UUID> skillIds
) {
}
