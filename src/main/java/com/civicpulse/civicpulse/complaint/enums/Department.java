package com.civicpulse.civicpulse.complaint.enums;

public enum Department {

    ROADS_INFRASTRUCTURE(
            1,
            "Roads & Infrastructure"
    ),

    WATER_SUPPLY(
            2,
            "Water Supply"
    ),

    ELECTRICAL_SERVICES(
            3,
            "Electrical Services"
    ),

    SANITATION_WASTE(
            4,
            "Sanitation & Waste"
    ),

    PUBLIC_HEALTH(
            5,
            "Public Health"
    ),

    PARKS_ENVIRONMENT(
            6,
            "Parks & Environment"
    ),

    GENERAL_ADMINISTRATION(
            7,
            "General Administration"
    );

    private final int id;
    private final String displayName;

    Department(int id, String displayName) {
        this.id = id;
        this.displayName = displayName;
    }

    public int getId() {
        return id;
    }

    public String getDisplayName() {
        return displayName;
    }
}