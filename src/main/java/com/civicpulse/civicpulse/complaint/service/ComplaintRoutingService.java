package com.civicpulse.civicpulse.complaint.service;

import com.civicpulse.civicpulse.complaint.dto.RoutingResult;

public interface ComplaintRoutingService {

    RoutingResult determineDepartment(
            String category,
            String title,
            String description
    );
}