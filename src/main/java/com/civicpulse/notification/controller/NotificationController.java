package com.civicpulse.notification.controller;

import com.civicpulse.notification.dto.NotificationRequest;
import com.civicpulse.notification.dto.NotificationResponse;
import com.civicpulse.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // relax for the dummy test frontend; tighten in production
public class NotificationController {

    private final NotificationService notificationService;

    /** Send a notification through EMAIL / SMS / IN_APP / PUSH. */
    @PostMapping("/send")
    public ResponseEntity<NotificationResponse> send(@Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.createAndSend(request));
    }

    /** All notifications for one user, newest first (In-App inbox). */
    @GetMapping("/user/{recipientId}")
    public ResponseEntity<List<NotificationResponse>> getForUser(@PathVariable Long recipientId) {
        return ResponseEntity.ok(notificationService.getForUser(recipientId));
    }

    /** Admin: paginated view of every notification in the system. */
    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> getAll(Pageable pageable) {
        return ResponseEntity.ok(notificationService.getAll(pageable));
    }

    /** Unread (SENT but not READ) count, e.g. for a bell-icon badge. */
    @GetMapping("/user/{recipientId}/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(@PathVariable Long recipientId) {
        return ResponseEntity.ok(Map.of("unread", notificationService.unreadCount(recipientId)));
    }

    /** Mark a single notification as read. */
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    /** Retry delivery for a FAILED notification. */
    @PostMapping("/{id}/resend")
    public ResponseEntity<NotificationResponse> resend(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.resend(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        notificationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
