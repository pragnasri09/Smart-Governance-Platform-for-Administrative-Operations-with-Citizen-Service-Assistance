package com.civicpulse.notification.service.channel;

import com.civicpulse.notification.entity.Notification;
import com.civicpulse.notification.entity.NotificationType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Push notification channel sender.
 *
 * Currently implemented as a stub for testing.
 * Replace the send() implementation with Firebase Cloud Messaging (FCM)
 * or Apple Push Notification service (APNs) when device-token support
 * is added to the system.
 */
@Component
@Slf4j
public class PushNotificationSender implements NotificationChannelSender {

    @Override
    public NotificationType getType() {
        return NotificationType.PUSH;
    }

    @Override
    public void send(Notification notification) throws Exception {

        if (notification == null) {
            throw new IllegalArgumentException("Notification cannot be null");
        }

        if (notification.getRecipientId() == null) {
            throw new IllegalArgumentException("Recipient ID cannot be null");
        }

        if (notification.getMessage() == null || notification.getMessage().isBlank()) {
            throw new IllegalArgumentException("Notification message cannot be empty");
        }

        // TODO: Replace this stub with Firebase Cloud Messaging (FCM)
        // when device tokens are available for users.

        log.info(
            "[PUSH] Push notification sent successfully | recipientId={} | message={}",
            notification.getRecipientId(),
            notification.getMessage()
        );
    }
}