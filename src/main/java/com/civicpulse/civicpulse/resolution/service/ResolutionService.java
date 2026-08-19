package com.civicpulse.civicpulse.resolution.service;

import com.civicpulse.civicpulse.resolution.dto.CreateResolutionRequest;
import com.civicpulse.civicpulse.resolution.entity.Resolution;

import java.util.Optional;

public interface ResolutionService {

    Resolution createResolution(
            CreateResolutionRequest request
    );

    Resolution getResolutionByComplaintId(
            Long complaintId
    );

    Resolution completeResolution(
            Long resolutionId
    );
}
