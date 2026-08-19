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
import java.util.List;

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

        // 1. Find the complaint
        Complaint complaint =
                complaintRepository
                        .findById(request.getComplaintId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Complaint not found"
                                )
                        );


        // 2. Resolution can only be created
        //    for an IN_PROGRESS complaint
        if (complaint.getStatus()
                != ComplaintStatus.IN_PROGRESS) {

            throw new IllegalStateException(
                    "Resolution can only be created "
                    + "for complaints that are IN_PROGRESS"
            );
        }


        // 3. Prevent duplicate resolutions
        List<Resolution> existingResolutions =
                resolutionRepository.findByComplaintId(
                        request.getComplaintId()
                );

        if (!existingResolutions.isEmpty()) {

            throw new IllegalStateException(
                    "A resolution already exists "
                    + "for this complaint"
            );
        }


        // 4. Create the resolution
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


        // Resolution is completed immediately
        resolution.setStatus(
                ResolutionStatus.COMPLETED
        );


        resolution.setCompletedAt(
                LocalDateTime.now()
        );


        // 5. Save the resolution
        Resolution savedResolution =
                resolutionRepository.save(
                        resolution
                );


        // 6. Update the complaint
        //    IN_PROGRESS → RESOLVED
        complaint.setStatus(
                ComplaintStatus.RESOLVED
        );


        complaint.setResolvedAt(
                LocalDateTime.now()
        );


        complaintRepository.save(
                complaint
        );


        // 7. Return the saved resolution
        return savedResolution;
    }


    @Override
    public Resolution getResolutionByComplaintId(
            Long complaintId) {

        List<Resolution> resolutions =
                resolutionRepository
                        .findByComplaintId(complaintId);

        if (resolutions.isEmpty()) {

            throw new RuntimeException(
                    "Resolution not found"
            );
        }

        return resolutions.getFirst();
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


        // If createResolution() already completes
        // the resolution, there is nothing left
        // to complete.
        if (resolution.getStatus()
                == ResolutionStatus.COMPLETED) {

            return resolution;
        }


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


        complaint.setResolvedAt(
                LocalDateTime.now()
        );


        complaintRepository.save(
                complaint
        );


        return resolutionRepository.save(
                resolution
        );
    }
}