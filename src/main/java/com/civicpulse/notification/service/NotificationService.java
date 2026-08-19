package com.civicpulse.notification.service;

import com.civicpulse.notification.dto.NotificationRequest;
import com.civicpulse.notification.dto.NotificationResponse;
import com.civicpulse.notification.entity.Notification;
import com.civicpulse.notification.entity.NotificationStatus;
import com.civicpulse.notification.exception.NotificationNotFoundException;
import com.civicpulse.notification.repository.NotificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class NotificationService {

    private final NotificationRepository repository;
    private final NotificationDispatcher dispatcher;

    public NotificationService(NotificationRepository repository, NotificationDispatcher dispatcher) {
        this.repository = repository;
        this.dispatcher = dispatcher;
    }

    /**
     * Persist the notification immediately (so it's never lost), then
     * attempt delivery. Delivery failures don't throw back to the caller -
     * they're recorded on the row as status=FAILED + failureReason.
     *
     * Dispatch is delegated to NotificationDispatcher (a separate bean) so
     * that @Async actually applies - see NotificationDispatcher for why.
     */
    public NotificationResponse createAndSend(NotificationRequest request) {
        Notification notification = Notification.builder()
                .recipientId(request.getRecipientId())
                .recipientRole(request.getRecipientRole())
                .recipientEmail(request.getRecipientEmail())
                .recipientPhone(request.getRecipientPhone())
                .title(request.getTitle())
                .message(request.getMessage())
                .referenceId(request.getReferenceId())
                .referenceType(request.getReferenceType())
                .type(request.getType())
                .status(NotificationStatus.PENDING)
                .build();

        notification = repository.save(notification);
        dispatcher.dispatch(notification);
        return NotificationResponse.fromEntity(notification);
    }

    public List<NotificationResponse> getForUser(Long recipientId) {
        return repository.findByRecipientIdOrderByCreatedAtDesc(recipientId)
                .stream().map(NotificationResponse::fromEntity).collect(Collectors.toList());
    }

    public Page<NotificationResponse> getAll(Pageable pageable) {
        return repository.findAll(pageable).map(NotificationResponse::fromEntity);
    }

    public NotificationResponse markAsRead(Long id) {
        Notification n = repository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException(id));
        n.setStatus(NotificationStatus.READ);
        n.setReadAt(LocalDateTime.now());
        return NotificationResponse.fromEntity(repository.save(n));
    }

    public long unreadCount(Long recipientId) {
        return repository.countByRecipientIdAndStatus(recipientId, NotificationStatus.SENT);
    }

    public NotificationResponse resend(Long id) {
        Notification n = repository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException(id));
        n.setStatus(NotificationStatus.PENDING);
        n.setFailureReason(null);
        n = repository.save(n);
        dispatcher.dispatch(n);
        return NotificationResponse.fromEntity(n);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NotificationNotFoundException(id);
        }
        repository.deleteById(id);
    }
}
