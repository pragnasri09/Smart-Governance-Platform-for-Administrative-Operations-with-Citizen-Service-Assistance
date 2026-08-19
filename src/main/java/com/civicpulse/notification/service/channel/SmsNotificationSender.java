package com.civicpulse.notification.service.channel;

import com.civicpulse.notification.entity.Notification;
import com.civicpulse.notification.entity.NotificationType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * SMS Gateway is marked "Optional" in the architecture diagram.
 * This is a stub: it validates input and logs the outgoing message.
 * Swap the body of send() for a real provider call (Twilio, MSG91, etc.)
 * when a gateway is chosen - no other code needs to change.
 */
@Component
@Slf4j
public class SmsNotificationSender implements NotificationChannelSender {

    @Override
    public NotificationType getType() {
        return NotificationType.SMS;
    }

    @Override
    public void send(Notification notification) throws Exception {
        if (!StringUtils.hasText(notification.getRecipientPhone())) {
            throw new IllegalArgumentException("recipientPhone is required for SMS notifications");
        }
        // TODO: integrate real SMS gateway here
        log.info("[SMS-STUB] To: {} | {}", notification.getRecipientPhone(), notification.getMessage());
    }
}
