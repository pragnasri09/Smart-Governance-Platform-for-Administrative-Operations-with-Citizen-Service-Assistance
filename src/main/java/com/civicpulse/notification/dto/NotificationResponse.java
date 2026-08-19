package com.civicpulse.notification.dto;

import com.civicpulse.notification.entity.Notification;
import com.civicpulse.notification.entity.NotificationStatus;
import com.civicpulse.notification.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private Long recipientId;
    private String recipientRole;
    private String title;
    private String message;
    private Long referenceId;
    private String referenceType;
    private NotificationType type;
    private NotificationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;
    private String failureReason;

    public static NotificationResponse fromEntity(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .recipientId(n.getRecipientId())
                .recipientRole(n.getRecipientRole())
                .title(n.getTitle())
                .message(n.getMessage())
                .referenceId(n.getReferenceId())
                .referenceType(n.getReferenceType())
                .type(n.getType())
                .status(n.getStatus())
                .createdAt(n.getCreatedAt())
                .sentAt(n.getSentAt())
                .readAt(n.getReadAt())
                .failureReason(n.getFailureReason())
                .build();
    }
}
