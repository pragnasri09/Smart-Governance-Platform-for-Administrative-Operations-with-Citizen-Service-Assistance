package com.civicpulse.notification.service;

import com.civicpulse.notification.entity.Notification;
import com.civicpulse.notification.entity.NotificationStatus;
import com.civicpulse.notification.entity.NotificationType;
import com.civicpulse.notification.repository.NotificationRepository;
import com.civicpulse.notification.service.channel.NotificationChannelSender;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Owns actual delivery of a persisted notification.
 *
 * This is deliberately a separate Spring bean from NotificationService.
 * @Async only works through Spring's proxy, so calling an @Async method
 * on "this" from within the same class (self-invocation) silently runs
 * synchronously instead of on a background thread. Keeping dispatch()
 * in its own bean means callers always go through the proxy and get
 * real fire-and-forget behavior.
 */
@Component
@Slf4j
public class NotificationDispatcher {

    private final NotificationRepository repository;
    private final Map<NotificationType, NotificationChannelSender> senders;

    public NotificationDispatcher(NotificationRepository repository, List<NotificationChannelSender> senderList) {
        this.repository = repository;
        this.senders = new EnumMap<>(NotificationType.class);
        for (NotificationChannelSender sender : senderList) {
            senders.put(sender.getType(), sender);
        }
    }

    /** Fire-and-forget async dispatch so the API responds instantly. */
    @Async
    public void dispatch(Notification notification) {
        NotificationChannelSender sender = senders.get(notification.getType());
        try {
            if (sender == null) {
                throw new IllegalStateException("No sender registered for type " + notification.getType());
            }
            sender.send(notification);
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
        } catch (Exception ex) {
            log.error("Failed to deliver notification {}: {}", notification.getId(), ex.getMessage());
            notification.setStatus(NotificationStatus.FAILED);
            notification.setFailureReason(ex.getMessage());
        }
        repository.save(notification);
    }
}
