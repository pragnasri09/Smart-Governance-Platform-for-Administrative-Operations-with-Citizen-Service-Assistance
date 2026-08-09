package com.civicpulse.civicpulse.complaint.service;

import com.civicpulse.civicpulse.complaint.entity.Complaint;

import java.util.List;

public interface ComplaintService {

    Complaint createComplaint(Complaint complaint);

    Complaint getComplaintById(Long id);

    List<Complaint> getComplaintsByCitizen(Long citizenId);

    List<Complaint> getAllComplaints();
}