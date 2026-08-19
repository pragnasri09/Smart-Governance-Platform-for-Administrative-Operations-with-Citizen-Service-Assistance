package com.civicpulse.notification.dto;

import com.civicpulse.notification.entity.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationRequest {

    @NotNull(message = "recipientId is required")
    private Long recipientId;

    private String recipientRole;   // CITIZEN | OFFICIAL | ADMIN
    private String recipientEmail;  // required if type = EMAIL
    private String recipientPhone;  // required if type = SMS

    @NotBlank(message = "title is required")
    private String title;

    @NotBlank(message = "message is required")
    private String message;

    private Long referenceId;
    private String referenceType;   // COMPLAINT | ANNOUNCEMENT | FEEDBACK

    @NotNull(message = "type is required")
    private NotificationType type;  // EMAIL | SMS | IN_APP | PUSH
}
