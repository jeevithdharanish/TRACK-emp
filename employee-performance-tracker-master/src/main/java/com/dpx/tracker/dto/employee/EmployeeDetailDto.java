package com.dpx.tracker.dto.employee;

import com.dpx.tracker.enums.EducationalStage;
import com.dpx.tracker.enums.Gender;
import com.dpx.tracker.enums.GeneralLevel;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

public record EmployeeDetailDto(
        UUID id,
        String firstName,
        String middleName,
        String lastName,
        String fullName,
        String cnp,
        GeneralLevel generalLevel,
        String address,
        Gender gender,
        EducationalStage educationalStage,
        LocalDate birthDate,
        LocalDate startWorkDate,
        LocalDate endWorkDate,
        LocalDate updateAt,
        String department,
        String position,
        String company,
        Set<String> skills,
        UUID userId
) {
}
