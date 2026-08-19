package com.civicpulse.notification.service.channel;

import com.civicpulse.notification.entity.Notification;
import com.civicpulse.notification.entity.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailNotificationSender implements NotificationChannelSender {

    private final JavaMailSender mailSender;

    @Value("${notification.mail.from:no-reply@civicpulse.gov}")
    private String fromAddress;

    @Override
    public NotificationType getType() {
        return NotificationType.EMAIL;
    }

    @Override
    public void send(Notification notification) throws Exception {
        if (!StringUtils.hasText(notification.getRecipientEmail())) {
            throw new IllegalArgumentException("recipientEmail is required for EMAIL notifications");
        }
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(fromAddress);
        mail.setTo(notification.getRecipientEmail());
        mail.setSubject(notification.getTitle());
        mail.setText(notification.getMessage());
        mailSender.send(mail);
        log.info("Email sent to {}", notification.getRecipientEmail());
    }
}
