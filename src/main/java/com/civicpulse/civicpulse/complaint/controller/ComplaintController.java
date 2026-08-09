package com.civicpulse.civicpulse.complaint.controller;

import com.civicpulse.civicpulse.complaint.entity.Complaint;
import com.civicpulse.civicpulse.complaint.service.ComplaintService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(
            ComplaintService complaintService) {

        this.complaintService = complaintService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Complaint createComplaint(
            @RequestBody Complaint complaint) {

        return complaintService.createComplaint(complaint);
    }

    @GetMapping("/{id}")
    public Complaint getComplaint(
            @PathVariable Long id) {

        return complaintService.getComplaintById(id);
    }

    @GetMapping("/citizen/{citizenId}")
    public List<Complaint> getCitizenComplaints(
            @PathVariable Long citizenId) {

        return complaintService
                .getComplaintsByCitizen(citizenId);
    }

    @GetMapping
    public List<Complaint> getAllComplaints() {

        return complaintService.getAllComplaints();
    }
}