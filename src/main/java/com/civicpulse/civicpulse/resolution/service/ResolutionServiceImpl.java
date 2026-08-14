package com.civicpulse.civicpulse.resolution.service;

import com.civicpulse.civicpulse.complaint.entity.Complaint;
import com.civicpulse.civicpulse.complaint.enums.ComplaintStatus;
import com.civicpulse.civicpulse.complaint.repository.ComplaintRepository;
import com.civicpulse.civicpulse.resolution.dto.CreateResolutionRequest;
import com.civicpulse.civicpulse.resolution.entity.Resolution;
import com.civicpulse.civicpulse.resolution.enums.ResolutionStatus;
import com.civicpulse.civicpulse.resolution.repository.ResolutionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ResolutionServiceImpl
        implements ResolutionService {

    private final ResolutionRepository resolutionRepository;
    private final ComplaintRepository complaintRepository;


    public ResolutionServiceImpl(
            ResolutionRepository resolutionRepository,
            ComplaintRepository complaintRepository) {

        this.resolutionRepository =
                resolutionRepository;

        this.complaintRepository =
                complaintRepository;
    }


    @Override
    public Resolution createResolution(
            CreateResolutionRequest request) {

        // 1. Find complaint
        Complaint complaint =
                complaintRepository
                        .findById(request.getComplaintId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Complaint not found"
                                )
                        );


        // 2. Check complaint status
        if (complaint.getStatus()
                != ComplaintStatus.IN_PROGRESS) {

            throw new IllegalStateException(
                    "Resolution can only be created "
                    + "for complaints that are IN_PROGRESS"
            );
        }


        // 3. Prevent duplicate resolution
        if (resolutionRepository
                .findByComplaintId(
                        request.getComplaintId()
                )
                .isPresent()) {

            throw new IllegalStateException(
                    "A resolution already exists "
                    + "for this complaint"
            );
        }


        // 4. Create resolution
        Resolution resolution =
                new Resolution();

        resolution.setComplaintId(
                request.getComplaintId()
        );

        resolution.setResolvedBy(
                request.getResolvedBy()
        );

        resolution.setResolutionDescription(
                request.getResolutionDescription()
        );

        resolution.setEvidenceUrl(
                request.getEvidenceUrl()
        );

        resolution.setStatus(
                ResolutionStatus.INITIATED
        );


        return resolutionRepository.save(
                resolution
        );
    }


    @Override
    public Resolution getResolutionByComplaintId(
            Long complaintId) {

        return resolutionRepository
                .findByComplaintId(complaintId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Resolution not found"
                        )
                );
    }


    @Override
    public Resolution completeResolution(
            Long resolutionId) {

        Resolution resolution =
                resolutionRepository
                        .findById(resolutionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resolution not found"
                                )
                        );


        if (resolution.getStatus()
                != ResolutionStatus.INITIATED) {

            throw new IllegalStateException(
                    "Resolution cannot be completed "
                    + "from its current state"
            );
        }


        Complaint complaint =
                complaintRepository
                        .findById(
                                resolution.getComplaintId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Complaint not found"
                                )
                        );


        resolution.setStatus(
                ResolutionStatus.COMPLETED
        );


        resolution.setCompletedAt(
                LocalDateTime.now()
        );


        complaint.setStatus(
                ComplaintStatus.RESOLVED
        );


        complaintRepository.save(complaint);

        return resolutionRepository.save(
                resolution
        );
    }
}