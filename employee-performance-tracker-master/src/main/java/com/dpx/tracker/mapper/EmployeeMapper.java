package com.dpx.tracker.mapper;

import com.dpx.tracker.dto.EmployeeLiteDto;
import com.dpx.tracker.dto.employee.EmployeeDetailDto;
import com.dpx.tracker.dto.employee.EmployeeSummaryDto;
import com.dpx.tracker.entity.Employee;

public final class EmployeeMapper {

    private EmployeeMapper() {

    }

    public static EmployeeLiteDto toLiteDto(Employee employee) {
        if (employee == null) {
            return null;
        }

        String fullName = buildFullName(
          employee.getFirstName(),
          employee.getMiddleName(),
          employee.getLastName()
        );

        String position = employee.getPosition() != null
                ? employee.getPosition().getName() : null;

        return new EmployeeLiteDto(
                employee.getId(),
                fullName,
                position
        );

    }


    public static String buildFullName(String first, String middle, String last) {
        StringBuilder sb = new StringBuilder();
        if (first != null && !first.isBlank()) {
            sb.append(first).append(" ");
        }
        if (middle != null && !middle.isBlank()) {
            sb.append(middle).append(" ");
        }
        if (last != null && !last.isBlank()) {
            sb.append(last).append(" ");
        }
        return sb.toString().trim();
    }

    public static EmployeeDetailDto toDetailDto(Employee employee) {
        if (employee == null) {
            return null;
        }

        String fullName = buildFullName(
                employee.getFirstName(),
                employee.getMiddleName(),
                employee.getLastName()
        );

        return new EmployeeDetailDto(
                employee.getId(),
                employee.getFirstName(),
                employee.getMiddleName(),
                employee.getLastName(),
                fullName,
                employee.getCNP(),
                employee.getGeneralLevel(),
                employee.getAddress(),
                employee.getGender(),
                employee.getEducationalStage(),
                employee.getBirthDay(),
                employee.getStartWorkDate(),
                employee.getEndWorkDate(),
                employee.getUpdateAt(),
                employee.getDepartment() != null ? employee.getDepartment().getName() : null,
                employee.getPosition() != null ? employee.getPosition().getName() : null,
                employee.getCompany() != null ? employee.getCompany().getName() : null,
                employee.getSkills().stream().map(skill -> skill.getName()).collect(java.util.stream.Collectors.toSet()),
                employee.getUser() != null ? employee.getUser().getId() : null
        );
    }

    public static EmployeeSummaryDto toSummaryDto(Employee employee) {
        if (employee == null) {
            return null;
        }
        String fullName = buildFullName(
                employee.getFirstName(),
                employee.getMiddleName(),
                employee.getLastName()
        );
        return new EmployeeSummaryDto(
                employee.getId(),
                fullName,
                employee.getDepartment() != null ? employee.getDepartment().getName() : null,
                employee.getPosition() != null ? employee.getPosition().getName() : null,
                employee.getStartWorkDate()
        );
    }
}
