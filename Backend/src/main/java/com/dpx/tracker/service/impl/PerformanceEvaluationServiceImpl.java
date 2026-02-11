package com.dpx.tracker.service.impl;

import com.dpx.tracker.dto.performance.PerformanceEvaluationCreateRequest;
import com.dpx.tracker.dto.performance.PerformanceEvaluationDetailDto;
import com.dpx.tracker.dto.performance.PerformanceEvaluationUpdateRequest;
import com.dpx.tracker.entity.Employee;
import com.dpx.tracker.entity.PerformanceEvaluation;
import com.dpx.tracker.mapper.PerformanceEvaluationMapper;
import com.dpx.tracker.repository.EmployeeRepository;
import com.dpx.tracker.repository.PerformanceEvaluationRepository;
import com.dpx.tracker.service.PerformanceEvaluationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class PerformanceEvaluationServiceImpl implements PerformanceEvaluationService {

    private final PerformanceEvaluationRepository evaluationRepository;
    private final EmployeeRepository employeeRepository;

    public PerformanceEvaluationServiceImpl(PerformanceEvaluationRepository evaluationRepository,
                                            EmployeeRepository employeeRepository) {
        this.evaluationRepository = evaluationRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional
    public PerformanceEvaluationDetailDto createEvaluation(PerformanceEvaluationCreateRequest request) {
        Employee employee = employeeRepository.findById(request.employeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + request.employeeId()));
        Employee evaluator = employeeRepository.findById(request.evaluatorId())
                .orElseThrow(() -> new EntityNotFoundException("Evaluator not found: " + request.evaluatorId()));

        int previousTotal = evaluationRepository.findTopByEmployeeOrderByEvaluationDateDesc(employee)
                .map(PerformanceEvaluation::getTotalScore)
                .orElse(0);
        int newGain = request.newGainPoint();
        int totalScore = previousTotal + newGain;
        double efficiencyProgress = calculateEfficiency(previousTotal, newGain);

        PerformanceEvaluation evaluation = new PerformanceEvaluation();
        evaluation.setEmployee(employee);
        evaluation.setEvaluator(evaluator);
        evaluation.setEvaluationDate(request.evaluationDate());
        evaluation.setScoreBeforeEvaluation(previousTotal);
        evaluation.setNewGainPoint(newGain);
        evaluation.setTotalScore(totalScore);
        evaluation.setEfficiencyProgress(efficiencyProgress);
        evaluation.setNote(request.note());

        PerformanceEvaluation saved = evaluationRepository.save(evaluation);
        employee.getPerformanceEvaluations().add(saved);
        return PerformanceEvaluationMapper.toDetailDto(saved);
    }

    @Override
    @Transactional
    public PerformanceEvaluationDetailDto updateEvaluation(UUID evaluationId, PerformanceEvaluationUpdateRequest request) {
        PerformanceEvaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new EntityNotFoundException("Evaluation not found: " + evaluationId));
        if (request.evaluationDate() != null) {
            evaluation.setEvaluationDate(request.evaluationDate());
        }
        if (request.newGainPoint() != null) {
            evaluation.setNewGainPoint(request.newGainPoint());
            evaluation.setTotalScore(evaluation.getScoreBeforeEvaluation() + request.newGainPoint());
            evaluation.setEfficiencyProgress(calculateEfficiency(evaluation.getScoreBeforeEvaluation(), request.newGainPoint()));
        }
        if (request.note() != null) {
            evaluation.setNote(request.note());
        }
        PerformanceEvaluation updated = evaluationRepository.save(evaluation);
        return PerformanceEvaluationMapper.toDetailDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public PerformanceEvaluationDetailDto getEvaluation(UUID evaluationId) {
        PerformanceEvaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new EntityNotFoundException("Evaluation not found: " + evaluationId));
        return PerformanceEvaluationMapper.toDetailDto(evaluation);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PerformanceEvaluationDetailDto> listEvaluationsForEmployee(UUID employeeId, Pageable pageable) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + employeeId));
        return evaluationRepository.findByEmployee(employee, pageable)
                .map(PerformanceEvaluationMapper::toDetailDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PerformanceEvaluationDetailDto> listEvaluationsByDateRange(LocalDate start, LocalDate end, Pageable pageable) {
        return evaluationRepository.findByEvaluationDateBetween(start, end, pageable)
                .map(PerformanceEvaluationMapper::toDetailDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PerformanceEvaluationDetailDto> listAllEvaluations(Pageable pageable) {
        return evaluationRepository.findAll(pageable)
                .map(PerformanceEvaluationMapper::toDetailDto);
    }

    @Override
    @Transactional
    public void deleteEvaluation(UUID evaluationId) {
        PerformanceEvaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new EntityNotFoundException("Evaluation not found: " + evaluationId));
        evaluation.getEmployee().getPerformanceEvaluations().remove(evaluation);
        evaluationRepository.delete(evaluation);
    }

    private double calculateEfficiency(int previousTotal, int newGain) {
        if (previousTotal <= 0) {
            return newGain;
        }
        return (double) newGain / previousTotal * 100.0;
    }
}
