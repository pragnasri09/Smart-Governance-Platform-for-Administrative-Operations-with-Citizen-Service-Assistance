package com.civicpulse.notification.service.channel;

import com.civicpulse.notification.entity.Notification;
import com.civicpulse.notification.entity.NotificationType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * In-app notifications don't need an external send step - the record
 * living in the notifications table (visible via GET /api/notifications/user/{id})
 * IS the delivery mechanism. This exists so it fits the same strategy pattern.
 */
@Component
@Slf4j
public class InAppNotificationSender implements NotificationChannelSender {

    @Override
    public NotificationType getType() {
        return NotificationType.IN_APP;
    }

    @Override
    public void send(Notification notification) {
        log.info("[IN-APP] Stored for user {}", notification.getRecipientId());
        // no-op: persistence in NotificationService is the delivery
    }
}
