package com.civicpulse.civicpulse.resolution.controller;

import com.civicpulse.civicpulse.resolution.dto.CreateResolutionRequest;
import com.civicpulse.civicpulse.resolution.entity.Resolution;
import com.civicpulse.civicpulse.resolution.service.ResolutionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resolutions")
public class ResolutionController {

    private final ResolutionService resolutionService;


    public ResolutionController(
            ResolutionService resolutionService) {

        this.resolutionService =
                resolutionService;
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Resolution createResolution(
            @Valid @RequestBody
            CreateResolutionRequest request) {

        return resolutionService
                .createResolution(request);
    }


    @PutMapping("/{id}/complete")
    public Resolution completeResolution(
            @PathVariable Long id) {

        return resolutionService
                .completeResolution(id);
    }
    
    
    @GetMapping("/complaint/{complaintId}")
    public Resolution getResolutionByComplaintId(
            @PathVariable Long complaintId) {

        return resolutionService
                .getResolutionByComplaintId(
                    complaintId
                );
    }
}