package in.gov.sgp.service;

import in.gov.sgp.model.Complaint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ComplaintSimilarityService {
    private final double radiusKm;
    private final int days;

    public ComplaintSimilarityService(
            @Value("${app.similarity.radius-km:2}") double radiusKm,
            @Value("${app.similarity.days:30}") int days
    ) {
        this.radiusKm = radiusKm;
        this.days = days;
    }

    public int score(Complaint a, Complaint b) {
        if (!a.getCategory().equalsIgnoreCase(b.getCategory())) return 0;
        Set<String> left = words(a.getTitle() + " " + a.getDescription());
        Set<String> right = words(b.getTitle() + " " + b.getDescription());
        Set<String> intersection = new HashSet<>(left);
        intersection.retainAll(right);
        int text = left.isEmpty() && right.isEmpty() ? 0
                : (int) Math.round(100d * intersection.size() / Math.max(left.size(), right.size()));
        int proximity = nearby(a, b) ? 30 : 0;
        int time = Math.abs(a.getCreatedAt().toEpochMilli() - b.getCreatedAt().toEpochMilli())
                <= days * 86_400_000L ? 20 : 0;
        return Math.min(100, Math.round(text * .5f) + proximity + time);
    }

    private boolean nearby(Complaint a, Complaint b) {
        if (a.getLatitude() == null || a.getLongitude() == null || b.getLatitude() == null || b.getLongitude() == null) return false;
        double lat = Math.toRadians(b.getLatitude() - a.getLatitude());
        double lon = Math.toRadians(b.getLongitude() - a.getLongitude());
        double h = Math.sin(lat / 2) * Math.sin(lat / 2)
                + Math.cos(Math.toRadians(a.getLatitude())) * Math.cos(Math.toRadians(b.getLatitude()))
                * Math.sin(lon / 2) * Math.sin(lon / 2);
        return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) <= radiusKm;
    }

    private Set<String> words(String value) {
        return new HashSet<>(Arrays.stream(value.toLowerCase(Locale.ROOT).split("[^a-z0-9]+"))
                .filter(word -> word.length() > 3).toList());
    }
}
