package com.dpx.tracker.controller;

import com.dpx.tracker.dto.performance.PerformanceEvaluationCreateRequest;
import com.dpx.tracker.dto.performance.PerformanceEvaluationDetailDto;
import com.dpx.tracker.dto.performance.PerformanceEvaluationUpdateRequest;
import com.dpx.tracker.service.PerformanceEvaluationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/performance-evaluations")
public class PerformanceEvaluationController {

    private final PerformanceEvaluationService performanceEvaluationService;

    public PerformanceEvaluationController(PerformanceEvaluationService performanceEvaluationService) {
        this.performanceEvaluationService = performanceEvaluationService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_MANAGER','ROLE_HR')")
    public ResponseEntity<PerformanceEvaluationDetailDto> createEvaluation(
            @Valid @RequestBody PerformanceEvaluationCreateRequest request) {
        PerformanceEvaluationDetailDto created = performanceEvaluationService.createEvaluation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{evaluationId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_MANAGER','ROLE_HR')")
    public ResponseEntity<PerformanceEvaluationDetailDto> updateEvaluation(@PathVariable UUID evaluationId,
                                                                          @RequestBody PerformanceEvaluationUpdateRequest request) {
        PerformanceEvaluationDetailDto updated = performanceEvaluationService.updateEvaluation(evaluationId, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{evaluationId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_MANAGER','ROLE_HR','ROLE_EMPLOYEE')")
    public ResponseEntity<PerformanceEvaluationDetailDto> getEvaluation(@PathVariable UUID evaluationId) {
        PerformanceEvaluationDetailDto evaluation = performanceEvaluationService.getEvaluation(evaluationId);
        return ResponseEntity.ok(evaluation);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_MANAGER','ROLE_HR')")
    public ResponseEntity<Page<PerformanceEvaluationDetailDto>> listEvaluations(
            @RequestParam(required = false) UUID employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        Page<PerformanceEvaluationDetailDto> page;
        if (employeeId != null) {
            page = performanceEvaluationService.listEvaluationsForEmployee(employeeId, pageable);
        } else if (startDate != null && endDate != null) {
            page = performanceEvaluationService.listEvaluationsByDateRange(startDate, endDate, pageable);
        } else {
            page = performanceEvaluationService.listAllEvaluations(pageable);
        }
        return ResponseEntity.ok(page);
    }

    @DeleteMapping("/{evaluationId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_MANAGER')")
    public ResponseEntity<Void> deleteEvaluation(@PathVariable UUID evaluationId) {
        performanceEvaluationService.deleteEvaluation(evaluationId);
        return ResponseEntity.noContent().build();
    }
}
