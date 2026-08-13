package com.civicpulse.civicpulse.complaint.service;

import com.civicpulse.civicpulse.complaint.enums.ComplaintStatus;

public interface ComplaintStatusService {

    boolean isValidTransition(
            ComplaintStatus currentStatus,
            ComplaintStatus newStatus
    );
}