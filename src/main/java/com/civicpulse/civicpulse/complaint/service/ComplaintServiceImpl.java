package com.civicpulse.civicpulse.complaint.service;

import com.civicpulse.civicpulse.complaint.dto.RoutingResult;
import com.civicpulse.civicpulse.complaint.entity.Complaint;
import com.civicpulse.civicpulse.complaint.enums.ComplaintStatus;
import com.civicpulse.civicpulse.complaint.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintStatusService complaintStatusService;
    private final ComplaintRoutingService routingService;

    public ComplaintServiceImpl(
            ComplaintRepository complaintRepository,
            ComplaintStatusService complaintStatusService,
            ComplaintRoutingService routingService) {

        this.complaintRepository =
                complaintRepository;

        this.complaintStatusService =
                complaintStatusService;

        this.routingService =
                routingService;
    }

    @Override
    public Complaint createComplaint(
            Complaint complaint) {

        complaint.setComplaintNumber(
                generateComplaintNumber()
        );

        RoutingResult routingResult =
                routingService.determineDepartment(
                        complaint.getCategory(),
                        complaint.getTitle(),
                        complaint.getDescription()
                );

        complaint.setAssignedDepartmentId(
                (long) routingResult
                        .getDepartment()
                        .getId()
        );

        complaint.setStatus(
                ComplaintStatus.SUBMITTED
        );

        return complaintRepository.save(complaint);
    }

    @Override
    public Complaint getComplaintById(Long id) {

        return complaintRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Complaint not found"
                        )
                );
    }

    @Override
    public List<Complaint> getComplaintsByCitizen(Long citizenId) {

        return complaintRepository
                .findByCitizenId(citizenId);
    }

    @Override
    public List<Complaint> getAllComplaints() {

        return complaintRepository.findAll();
    }

    private String generateComplaintNumber() {

        return "CP-" + System.currentTimeMillis();
    }

    @Override
    public Complaint updateStatus(
            Long complaintId,
            ComplaintStatus newStatus) {

        Complaint complaint =
                complaintRepository.findById(complaintId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Complaint not found"
                                )
                        );

        ComplaintStatus currentStatus =
                complaint.getStatus();

        if (!complaintStatusService.isValidTransition(
                currentStatus,
                newStatus)) {

            throw new IllegalStateException(
                    "Invalid status transition: "
                    + currentStatus
                    + " → "
                    + newStatus
            );
        }

        complaint.setStatus(newStatus);

        return complaintRepository.save(complaint);
    }

    @Override
    public Complaint assignComplaint(
            Long complaintId,
            Long departmentId,
            Long assignedBy) {

        Complaint complaint =
                complaintRepository.findById(complaintId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Complaint not found"
                                )
                        );

        if (departmentId == null) {
            throw new IllegalArgumentException(
                    "Department ID is required"
            );
        }

        if (complaint.getStatus()
                != ComplaintStatus.VERIFIED) {

            throw new IllegalStateException(
                    "Complaint can only be assigned when "
                    + "its status is VERIFIED"
            );
        }

        complaint.setAssignedDepartmentId(departmentId);

        complaint.setStatus(
                ComplaintStatus.ASSIGNED
        );

        return complaintRepository.save(complaint);
    }
}