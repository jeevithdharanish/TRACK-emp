package com.dpx.tracker.service.impl;

import com.dpx.tracker.dto.report.DepartmentPerformanceDto;
import com.dpx.tracker.dto.report.PerformanceTrendDto;
import com.dpx.tracker.dto.report.TopPerformerDto;
import com.dpx.tracker.entity.Department;
import com.dpx.tracker.entity.Employee;
import com.dpx.tracker.entity.PerformanceEvaluation;
import com.dpx.tracker.mapper.EmployeeMapper;
import com.dpx.tracker.repository.PerformanceEvaluationRepository;
import com.dpx.tracker.service.ReportService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    private final PerformanceEvaluationRepository evaluationRepository;

    public ReportServiceImpl(PerformanceEvaluationRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    @Override
    public List<TopPerformerDto> getTopPerformers(int limit, LocalDate startDate, LocalDate endDate) {
        List<PerformanceEvaluation> evaluations = loadEvaluations(startDate, endDate);
        Map<Employee, List<PerformanceEvaluation>> byEmployee = evaluations.stream()
                .collect(Collectors.groupingBy(PerformanceEvaluation::getEmployee));

        return byEmployee.entrySet().stream()
                .map(entry -> {
                    Employee employee = entry.getKey();
                    List<PerformanceEvaluation> employeeEvaluations = entry.getValue();
                    int latestTotal = employeeEvaluations.stream()
                            .max(Comparator.comparing(PerformanceEvaluation::getEvaluationDate))
                            .map(PerformanceEvaluation::getTotalScore)
                            .orElse(0);
                    double averageEfficiency = employeeEvaluations.stream()
                            .mapToDouble(PerformanceEvaluation::getEfficiencyProgress)
                            .average()
                            .orElse(0);
                    return new TopPerformerDto(
                            employee.getId(),
                            EmployeeMapper.buildFullName(employee.getFirstName(), employee.getMiddleName(), employee.getLastName()),
                            latestTotal,
                            averageEfficiency
                    );
                })
                .sorted(Comparator.comparingInt(TopPerformerDto::totalScore).reversed())
                .limit(limit)
                .toList();
    }

    @Override
    public List<DepartmentPerformanceDto> getDepartmentPerformance(LocalDate startDate, LocalDate endDate) {
        List<PerformanceEvaluation> evaluations = loadEvaluations(startDate, endDate);
        Map<Department, List<PerformanceEvaluation>> byDepartment = evaluations.stream()
                .filter(evaluation -> evaluation.getEmployee() != null && evaluation.getEmployee().getDepartment() != null)
                .collect(Collectors.groupingBy(evaluation -> evaluation.getEmployee().getDepartment()));

        return byDepartment.entrySet().stream()
                .map(entry -> {
                    Department department = entry.getKey();
                    List<PerformanceEvaluation> departmentEvaluations = entry.getValue();
                    double avgScore = departmentEvaluations.stream()
                            .mapToInt(PerformanceEvaluation::getTotalScore)
                            .average()
                            .orElse(0);
                    double avgEfficiency = departmentEvaluations.stream()
                            .mapToDouble(PerformanceEvaluation::getEfficiencyProgress)
                            .average()
                            .orElse(0);
                    return new DepartmentPerformanceDto(
                            department.getId(),
                            department.getName(),
                            avgScore,
                            avgEfficiency
                    );
                })
                .sorted(Comparator.comparingDouble(DepartmentPerformanceDto::averageScore).reversed())
                .toList();
    }

    @Override
    public List<PerformanceTrendDto> getMonthlyPerformanceTrend(LocalDate startDate, LocalDate endDate) {
        List<PerformanceEvaluation> evaluations = loadEvaluations(startDate, endDate);
        Map<YearMonth, List<PerformanceEvaluation>> byMonth = evaluations.stream()
                .collect(Collectors.groupingBy(evaluation -> YearMonth.from(evaluation.getEvaluationDate())));

        return byMonth.entrySet().stream()
                .map(entry -> {
                    YearMonth month = entry.getKey();
                    List<PerformanceEvaluation> monthlyEvaluations = entry.getValue();
                    double averageScore = monthlyEvaluations.stream()
                            .mapToInt(PerformanceEvaluation::getTotalScore)
                            .average()
                            .orElse(0);
                    return new PerformanceTrendDto(
                            month.getYear(),
                            month.getMonthValue(),
                            averageScore,
                            monthlyEvaluations.size()
                    );
                })
                .sorted(Comparator.comparing(PerformanceTrendDto::year)
                        .thenComparing(PerformanceTrendDto::month))
                .toList();
    }

    private List<PerformanceEvaluation> loadEvaluations(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return evaluationRepository.findByEvaluationDateBetween(startDate, endDate);
        }
        List<PerformanceEvaluation> all = evaluationRepository.findAll();
        return all.stream()
                .filter(evaluation -> (startDate == null || !evaluation.getEvaluationDate().isBefore(startDate))
                        && (endDate == null || !evaluation.getEvaluationDate().isAfter(endDate)))
                .toList();
    }
}
