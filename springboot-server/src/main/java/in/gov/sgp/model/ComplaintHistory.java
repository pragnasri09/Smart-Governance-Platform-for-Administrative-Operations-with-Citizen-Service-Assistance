package in.gov.sgp.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "complaint_history", indexes = {
        @Index(name = "idx_history_complaint_time", columnList = "complaint_id,event_at")
})
public class ComplaintHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 30)
    private HistoryEventType eventType;

    @Column(nullable = false, length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by")
    private User performedBy;

    @Column(name = "event_at", nullable = false)
    private Instant eventAt;

    @PrePersist
    void prePersist() {
        if (eventAt == null) eventAt = Instant.now();
    }

    public Long getId() { return id; }
    public Complaint getComplaint() { return complaint; }
    public HistoryEventType getEventType() { return eventType; }
    public String getDescription() { return description; }
    public User getPerformedBy() { return performedBy; }
    public Instant getEventAt() { return eventAt; }
    public void setComplaint(Complaint v) { complaint = v; }
    public void setEventType(HistoryEventType v) { eventType = v; }
    public void setDescription(String v) { description = v; }
    public void setPerformedBy(User v) { performedBy = v; }
}
