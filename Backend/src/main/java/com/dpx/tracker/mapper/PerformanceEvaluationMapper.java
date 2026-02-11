package com.dpx.tracker.mapper;

import com.dpx.tracker.dto.performance.PerformanceEvaluationDetailDto;
import com.dpx.tracker.entity.Employee;
import com.dpx.tracker.entity.PerformanceEvaluation;

public final class PerformanceEvaluationMapper {

    private PerformanceEvaluationMapper() {
    }

    public static PerformanceEvaluationDetailDto toDetailDto(PerformanceEvaluation evaluation) {
        if (evaluation == null) {
            return null;
        }
        Employee employee = evaluation.getEmployee();
        Employee evaluator = evaluation.getEvaluator();
        return new PerformanceEvaluationDetailDto(
                evaluation.getId(),
                evaluation.getEvaluationDate(),
                evaluation.getScoreBeforeEvaluation(),
                evaluation.getNewGainPoint(),
                evaluation.getTotalScore(),
                evaluation.getEfficiencyProgress(),
                evaluation.getNote(),
                employee != null ? employee.getId() : null,
                employee != null ? EmployeeMapper.buildFullName(employee.getFirstName(), employee.getMiddleName(), employee.getLastName()) : null,
                evaluator != null ? evaluator.getId() : null,
                evaluator != null ? EmployeeMapper.buildFullName(evaluator.getFirstName(), evaluator.getMiddleName(), evaluator.getLastName()) : null
        );
    }
}
