package com.dpx.tracker.controller;

import com.dpx.tracker.dto.employee.EmployeeCreateRequest;
import com.dpx.tracker.dto.employee.EmployeeDetailDto;
import com.dpx.tracker.dto.employee.EmployeeSummaryDto;
import com.dpx.tracker.dto.employee.EmployeeUpdateRequest;
import com.dpx.tracker.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_HR')")
    public ResponseEntity<EmployeeDetailDto> createEmployee(@Valid @RequestBody EmployeeCreateRequest request) {
        EmployeeDetailDto created = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{employeeId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_HR')")
    public ResponseEntity<EmployeeDetailDto> updateEmployee(@PathVariable UUID employeeId,
                                                            @RequestBody EmployeeUpdateRequest request) {
        EmployeeDetailDto updated = employeeService.updateEmployee(employeeId, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{employeeId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_HR','ROLE_MANAGER','ROLE_EMPLOYEE')")
    public ResponseEntity<EmployeeDetailDto> getEmployee(@PathVariable UUID employeeId) {
        EmployeeDetailDto employee = employeeService.getEmployee(employeeId);
        return ResponseEntity.ok(employee);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_HR','ROLE_MANAGER')")
    public ResponseEntity<Page<EmployeeSummaryDto>> listEmployees(Pageable pageable) {
        Page<EmployeeSummaryDto> employees = employeeService.listEmployees(pageable);
        return ResponseEntity.ok(employees);
    }

    @DeleteMapping("/{employeeId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_HR')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable UUID employeeId) {
        employeeService.deleteEmployee(employeeId);
        return ResponseEntity.noContent().build();
    }
}
