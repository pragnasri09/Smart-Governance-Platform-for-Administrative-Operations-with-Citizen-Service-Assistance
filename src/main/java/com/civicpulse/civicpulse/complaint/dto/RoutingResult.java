package com.civicpulse.civicpulse.complaint.dto;

import com.civicpulse.civicpulse.complaint.enums.Department;

public class RoutingResult {

    private final Department department;
    private final String reason;

    public RoutingResult(
            Department department,
            String reason) {

        this.department = department;
        this.reason = reason;
    }

    public Department getDepartment() {
        return department;
    }

    public String getReason() {
        return reason;
    }
}