package com.dpx.tracker.service;

import com.dpx.tracker.dto.employee.EmployeeCreateRequest;
import com.dpx.tracker.dto.employee.EmployeeDetailDto;
import com.dpx.tracker.dto.employee.EmployeeSummaryDto;
import com.dpx.tracker.dto.employee.EmployeeUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface EmployeeService {

    EmployeeDetailDto createEmployee(EmployeeCreateRequest request);

    EmployeeDetailDto updateEmployee(UUID employeeId, EmployeeUpdateRequest request);

    EmployeeDetailDto getEmployee(UUID employeeId);

    Page<EmployeeSummaryDto> listEmployees(Pageable pageable);

    void deleteEmployee(UUID employeeId);
}
