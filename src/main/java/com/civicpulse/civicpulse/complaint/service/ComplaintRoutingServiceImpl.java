package com.civicpulse.civicpulse.complaint.service;

import com.civicpulse.civicpulse.complaint.dto.RoutingResult;
import com.civicpulse.civicpulse.complaint.enums.Department;
import org.springframework.stereotype.Service;

@Service
public class ComplaintRoutingServiceImpl
        implements ComplaintRoutingService {

    @Override
    public RoutingResult determineDepartment(
            String category,
            String title,
            String description) {

        String combinedText =
                ((category == null ? "" : category) + " "
                + (title == null ? "" : title) + " "
                + (description == null ? "" : description))
                .toLowerCase();

        // Roads
        if (containsAny(
                combinedText,
                "pothole",
                "road",
                "footpath",
                "pavement",
                "street"
        )) {

            return new RoutingResult(
                    Department.ROADS_INFRASTRUCTURE,
                    "Road/infrastructure related keywords detected"
            );
        }

        // Water
        if (containsAny(
                combinedText,
                "water",
                "leakage",
                "pipe",
                "pipeline",
                "water supply"
        )) {

            return new RoutingResult(
                    Department.WATER_SUPPLY,
                    "Water-related keywords detected"
            );
        }

        // Electricity / Streetlights
        if (containsAny(
                combinedText,
                "streetlight",
                "street light",
                "electricity",
                "electric",
                "power",
                "light not working"
        )) {

            return new RoutingResult(
                    Department.ELECTRICAL_SERVICES,
                    "Electrical/streetlight related keywords detected"
            );
        }

        // Sanitation
        if (containsAny(
                combinedText,
                "garbage",
                "waste",
                "sewage",
                "drain",
                "drainage",
                "sanitation",
                "dirty"
        )) {

            return new RoutingResult(
                    Department.SANITATION_WASTE,
                    "Sanitation/waste related keywords detected"
            );
        }

        // Default
        return new RoutingResult(
                Department.GENERAL_ADMINISTRATION,
                "No specific department could be determined"
        );
    }


    private boolean containsAny(
            String text,
            String... keywords) {

        for (String keyword : keywords) {

            if (text.contains(keyword)) {
                return true;
            }
        }

        return false;
    }
}