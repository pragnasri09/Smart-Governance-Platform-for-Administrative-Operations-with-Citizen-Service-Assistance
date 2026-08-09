package com.civicpulse.civicpulse.complaint.repository;

import com.civicpulse.civicpulse.complaint.entity.Complaint;
import com.civicpulse.civicpulse.complaint.enums.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository
        extends JpaRepository<Complaint, Long> {

    List<Complaint> findByCitizenId(Long citizenId);

    List<Complaint> findByStatus(ComplaintStatus status);

    List<Complaint> findByAssignedDepartmentId(Long departmentId);
}