package com.dpx.tracker.repository;

import com.dpx.tracker.entity.Employee;
import com.dpx.tracker.entity.PerformanceEvaluation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PerformanceEvaluationRepository extends JpaRepository<PerformanceEvaluation, UUID> {

    Optional<PerformanceEvaluation> findTopByEmployeeOrderByEvaluationDateDesc(Employee employee);

    Page<PerformanceEvaluation> findByEmployee(Employee employee, Pageable pageable);

    Page<PerformanceEvaluation> findByEvaluationDateBetween(LocalDate start, LocalDate end, Pageable pageable);

    List<PerformanceEvaluation> findByEvaluationDateBetween(LocalDate start, LocalDate end);
}
