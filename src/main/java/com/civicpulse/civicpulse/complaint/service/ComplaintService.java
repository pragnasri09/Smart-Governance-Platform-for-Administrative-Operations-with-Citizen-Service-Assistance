package com.civicpulse.civicpulse.complaint.service;

import com.civicpulse.civicpulse.complaint.entity.Complaint;
import com.civicpulse.civicpulse.complaint.enums.ComplaintStatus;

import java.util.List;

public interface ComplaintService {

    Complaint createComplaint(Complaint complaint);

    Complaint getComplaintById(Long id);

    List<Complaint> getComplaintsByCitizen(Long citizenId);

    List<Complaint> getAllComplaints();

    Complaint updateStatus(Long complaintId, ComplaintStatus newStatus);

    Complaint assignComplaint(Long complaintId, Long departmentId, Long assignedBy);
}