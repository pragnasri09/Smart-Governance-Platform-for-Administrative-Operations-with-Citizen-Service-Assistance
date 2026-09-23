package in.gov.sgp.service;

import in.gov.sgp.dto.ImpactScoreBreakdown;
import in.gov.sgp.model.Complaint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Locale;

@Service
public class ImpactScoreService {
    private final int severityWeight;
    private final int affectedWeight;
    private final int recurrenceWeight;
    private final int ageWeight;
    private final int locationWeight;

    public ImpactScoreService(
            @Value("${app.impact.weights.severity:30}") int severityWeight,
            @Value("${app.impact.weights.affected-citizens:25}") int affectedWeight,
            @Value("${app.impact.weights.recurrence:20}") int recurrenceWeight,
            @Value("${app.impact.weights.age:15}") int ageWeight,
            @Value("${app.impact.weights.location:10}") int locationWeight
    ) {
        int total = severityWeight + affectedWeight + recurrenceWeight + ageWeight + locationWeight;
        if (total != 100) throw new IllegalArgumentException("Impact score weights must total 100.");
        this.severityWeight = severityWeight;
        this.affectedWeight = affectedWeight;
        this.recurrenceWeight = recurrenceWeight;
        this.ageWeight = ageWeight;
        this.locationWeight = locationWeight;
    }

    public ImpactScoreBreakdown breakdown(Complaint complaint) {
        String text = (complaint.getCategory() + " " + complaint.getTitle() + " " + complaint.getDescription())
                .toLowerCase(Locale.ROOT);
        int severityLevel = text.matches(".*(danger|accident|flood|fire|outage|unsafe|health).*") ? 5
                : text.matches(".*(broken|damaged|leak|pothole|garbage).*") ? 4 : 3;
        int severity = Math.round(severityLevel * severityWeight / 5f);
        int affected = Math.round(affectedWeight * (complaint.getLocation().toLowerCase(Locale.ROOT).contains("school")
                || complaint.getLocation().toLowerCase(Locale.ROOT).contains("hospital") ? 1f : .6f));
        int recurrence = Math.round(recurrenceWeight * (text.contains("again") || text.contains("repeated") ? 1f : .5f));
        long ageDays = Math.max(0, Duration.between(complaint.getCreatedAt(), Instant.now()).toDays());
        int age = Math.round(ageWeight * Math.min(1f, ageDays / 30f));
        int location = Math.round(locationWeight * (complaint.getLatitude() != null && complaint.getLongitude() != null ? .8f : .4f));
        return new ImpactScoreBreakdown(severity, affected, recurrence, age, location);
    }

    public int score(Complaint complaint) {
        ImpactScoreBreakdown b = breakdown(complaint);
        return Math.max(0, Math.min(100, b.severity() + b.affectedCitizens() + b.recurrence() + b.age() + b.location()));
    }
}
