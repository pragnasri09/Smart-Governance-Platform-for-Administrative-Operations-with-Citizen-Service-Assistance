package com.civicpulse.notification.repository;

import com.civicpulse.notification.entity.Notification;
import com.civicpulse.notification.entity.NotificationStatus;
import com.civicpulse.notification.entity.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);

    Page<Notification> findByRecipientId(Long recipientId, Pageable pageable);

    List<Notification> findByRecipientIdAndStatus(Long recipientId, NotificationStatus status);

    List<Notification> findByType(NotificationType type);

    List<Notification> findByStatus(NotificationStatus status);

    long countByRecipientIdAndStatus(Long recipientId, NotificationStatus status);
}
