package com.dpx.tracker.service.impl;

import com.dpx.tracker.dto.employee.EmployeeCreateRequest;
import com.dpx.tracker.dto.employee.EmployeeDetailDto;
import com.dpx.tracker.dto.employee.EmployeeSummaryDto;
import com.dpx.tracker.dto.employee.EmployeeUpdateRequest;
import com.dpx.tracker.entity.Company;
import com.dpx.tracker.entity.Department;
import com.dpx.tracker.entity.Employee;
import com.dpx.tracker.entity.Position;
import com.dpx.tracker.entity.Skill;
import com.dpx.tracker.entity.User;
import com.dpx.tracker.mapper.EmployeeMapper;
import com.dpx.tracker.repository.CompanyRepository;
import com.dpx.tracker.repository.DepartmentRepository;
import com.dpx.tracker.repository.EmployeeRepository;
import com.dpx.tracker.repository.PositionRepository;
import com.dpx.tracker.repository.SkillRepository;
import com.dpx.tracker.repository.UserRepository;
import com.dpx.tracker.service.EmployeeService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository;
    private final PositionRepository positionRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository,
                               DepartmentRepository departmentRepository,
                               CompanyRepository companyRepository,
                               PositionRepository positionRepository,
                               SkillRepository skillRepository,
                               UserRepository userRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.companyRepository = companyRepository;
        this.positionRepository = positionRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public EmployeeDetailDto createEmployee(EmployeeCreateRequest request) {
        Department department = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new EntityNotFoundException("Department not found: " + request.departmentId()));
        Company company = companyRepository.findById(request.companyId())
                .orElseThrow(() -> new EntityNotFoundException("Company not found: " + request.companyId()));
        Position position = positionRepository.findById(request.positionId())
                .orElseThrow(() -> new EntityNotFoundException("Position not found: " + request.positionId()));

        if (position.getDepartment() != null && !Objects.equals(position.getDepartment().getId(), department.getId())) {
            throw new IllegalArgumentException("Position does not belong to the specified department");
        }

        Set<Skill> skills = resolveSkills(request.skillIds());

        Employee employee = new Employee();
        employee.setFirstName(request.firstName());
        employee.setMiddleName(request.middleName());
        employee.setLastName(request.lastName());
        employee.setCNP(request.cnp());
        employee.setGeneralLevel(request.generalLevel());
        employee.setAddress(request.address());
        employee.setGender(request.gender());
        employee.setEducationalStage(request.educationalStage());
        employee.setBirthDay(request.birthDate());
        employee.setStartWorkDate(request.startWorkDate());
        employee.setDepartment(department);
        employee.setCompany(company);
        employee.setPosition(position);
        employee.setSkills(new HashSet<>(skills));
        employee.setUpdateAt(LocalDate.now());

        if (request.userId() != null) {
            User user = userRepository.findById(request.userId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found: " + request.userId()));
            employee.setUser(user);
            user.setIsEmployed(true);
            user.setEmployee(employee);
        }

        Employee saved = employeeRepository.save(employee);
        return EmployeeMapper.toDetailDto(saved);
    }

    @Override
    @Transactional
    public EmployeeDetailDto updateEmployee(UUID employeeId, EmployeeUpdateRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + employeeId));

        if (request.address() != null) {
            employee.setAddress(request.address());
        }
        if (request.generalLevel() != null) {
            employee.setGeneralLevel(request.generalLevel());
        }
        if (request.educationalStage() != null) {
            employee.setEducationalStage(request.educationalStage());
        }
        if (request.endWorkDate() != null) {
            employee.setEndWorkDate(request.endWorkDate());
            if (employee.getUser() != null) {
                employee.getUser().setIsEmployed(false);
            }
        }
        if (request.positionId() != null) {
            Position position = positionRepository.findById(request.positionId())
                    .orElseThrow(() -> new EntityNotFoundException("Position not found: " + request.positionId()));
            employee.setPosition(position);
        }
        if (request.departmentId() != null) {
            Department department = departmentRepository.findById(request.departmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Department not found: " + request.departmentId()));
            employee.setDepartment(department);
        }
        if (request.skillIds() != null) {
            Set<Skill> skills = resolveSkills(request.skillIds());
            employee.getSkills().clear();
            employee.getSkills().addAll(skills);
        }

        employee.setUpdateAt(request.updateAt() != null ? request.updateAt() : LocalDate.now());
        Employee updated = employeeRepository.save(employee);
        return EmployeeMapper.toDetailDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeDetailDto getEmployee(UUID employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + employeeId));
        return EmployeeMapper.toDetailDto(employee);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeSummaryDto> listEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable)
                .map(EmployeeMapper::toSummaryDto);
    }

    @Override
    @Transactional
    public void deleteEmployee(UUID employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found: " + employeeId));
        if (employee.getUser() != null) {
            employee.getUser().setIsEmployed(false);
            employee.setUser(null);
        }
        employee.getSkills().clear();
        employeeRepository.delete(employee);
    }

    private Set<Skill> resolveSkills(Set<UUID> skillIds) {
        if (skillIds == null || skillIds.isEmpty()) {
            return Collections.emptySet();
        }
        Set<Skill> skills = skillRepository.findByIdIn(skillIds);
        if (skills.size() != skillIds.size()) {
            throw new EntityNotFoundException("One or more skills not found");
        }
        return skills;
    }
}
