package in.gov.sgp.dto;

public record ImpactScoreBreakdown(
        int severity,
        int affectedCitizens,
        int recurrence,
        int age,
        int location
) {}
