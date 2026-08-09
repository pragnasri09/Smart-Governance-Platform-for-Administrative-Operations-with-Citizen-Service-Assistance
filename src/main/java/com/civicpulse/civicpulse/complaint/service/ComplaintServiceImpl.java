package com.civicpulse.civicpulse.complaint.service;

import com.civicpulse.civicpulse.complaint.entity.Complaint;
import com.civicpulse.civicpulse.complaint.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;

    public ComplaintServiceImpl(
            ComplaintRepository complaintRepository) {

        this.complaintRepository = complaintRepository;
    }

    @Override
    public Complaint createComplaint(Complaint complaint) {

        complaint.setComplaintNumber(
                generateComplaintNumber()
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
}