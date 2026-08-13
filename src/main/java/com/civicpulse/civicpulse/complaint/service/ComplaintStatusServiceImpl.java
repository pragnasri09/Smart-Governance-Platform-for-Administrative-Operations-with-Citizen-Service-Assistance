package com.civicpulse.civicpulse.complaint.service;

import com.civicpulse.civicpulse.complaint.enums.ComplaintStatus;
import org.springframework.stereotype.Service;

@Service
public class ComplaintStatusServiceImpl
        implements ComplaintStatusService {

    @Override
    public boolean isValidTransition(
            ComplaintStatus currentStatus,
            ComplaintStatus newStatus) {

        return switch (currentStatus) {

            case SUBMITTED ->
                    newStatus == ComplaintStatus.VERIFIED;

            case VERIFIED ->
                    newStatus == ComplaintStatus.ASSIGNED;

            case ASSIGNED ->
                    newStatus == ComplaintStatus.IN_PROGRESS;

            case IN_PROGRESS ->
                    newStatus == ComplaintStatus.RESOLVED;

            case RESOLVED ->
                    newStatus == ComplaintStatus.CLOSED;

            default -> false;
        };
    }
}