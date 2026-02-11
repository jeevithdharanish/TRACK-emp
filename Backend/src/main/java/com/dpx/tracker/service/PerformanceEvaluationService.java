package com.dpx.tracker.service;

import com.dpx.tracker.dto.performance.PerformanceEvaluationCreateRequest;
import com.dpx.tracker.dto.performance.PerformanceEvaluationDetailDto;
import com.dpx.tracker.dto.performance.PerformanceEvaluationUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.UUID;

public interface PerformanceEvaluationService {

    PerformanceEvaluationDetailDto createEvaluation(PerformanceEvaluationCreateRequest request);

    PerformanceEvaluationDetailDto updateEvaluation(UUID evaluationId, PerformanceEvaluationUpdateRequest request);

    PerformanceEvaluationDetailDto getEvaluation(UUID evaluationId);

    Page<PerformanceEvaluationDetailDto> listEvaluationsForEmployee(UUID employeeId, Pageable pageable);

    Page<PerformanceEvaluationDetailDto> listEvaluationsByDateRange(LocalDate start, LocalDate end, Pageable pageable);

    Page<PerformanceEvaluationDetailDto> listAllEvaluations(Pageable pageable);

    void deleteEvaluation(UUID evaluationId);
}
