package com.dpx.tracker.repository;

import com.dpx.tracker.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface SkillRepository extends JpaRepository<Skill, UUID> {
    Set<Skill> findByIdIn(Set<UUID> ids);
}
