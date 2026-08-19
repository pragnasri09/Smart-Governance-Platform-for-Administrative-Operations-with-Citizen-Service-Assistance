package com.civicpulse.notification.service.channel;

import com.civicpulse.notification.entity.Notification;
import com.civicpulse.notification.entity.NotificationType;

/**
 * Every delivery channel (Email, SMS, Push, In-App) implements this.
 * NotificationService picks the right implementation based on NotificationType.
 */
public interface NotificationChannelSender {

    NotificationType getType();

    /**
     * Attempt delivery. Implementations should throw an exception on failure
     * so NotificationService can mark the record FAILED with a reason.
     */
    void send(Notification notification) throws Exception;
}
