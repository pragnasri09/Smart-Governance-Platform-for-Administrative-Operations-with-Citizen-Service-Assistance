package com.civicpulse.civicpulse.resolution.repository;

import com.civicpulse.civicpulse.resolution.entity.Resolution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResolutionRepository
        extends JpaRepository<Resolution, Long> {
    List<Resolution> findByComplaintId(Long complaintId);
}