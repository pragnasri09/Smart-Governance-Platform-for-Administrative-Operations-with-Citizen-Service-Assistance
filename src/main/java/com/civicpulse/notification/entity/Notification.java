package com.civicpulse.notification.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Id of the citizen / official / admin this notification is for
    @Column(name = "recipient_id", nullable = false)
    private Long recipientId;

    // e.g. CITIZEN, OFFICIAL, ADMIN - matches Users module roles
    @Column(name = "recipient_role", length = 30)
    private String recipientRole;

    @Column(name = "recipient_email")
    private String recipientEmail;

    @Column(name = "recipient_phone")
    private String recipientPhone;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    // Links back to a complaint/announcement etc. Optional.
    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "reference_type", length = 40)
    private String referenceType; // e.g. COMPLAINT, ANNOUNCEMENT, FEEDBACK

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private NotificationStatus status = NotificationStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = NotificationStatus.PENDING;
        }
    }
}
