-- Reference schema. Hibernate (ddl-auto=update) will create/update this
-- automatically on startup, but keep this file for manual setup, migrations,
-- or handing off to the Database/MySQL teammate.

CREATE DATABASE IF NOT EXISTS civicpulse_notifications;
USE civicpulse_notifications;

CREATE TABLE IF NOT EXISTS notifications (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_id     BIGINT NOT NULL,
    recipient_role   VARCHAR(30),
    recipient_email  VARCHAR(255),
    recipient_phone  VARCHAR(20),
    title            VARCHAR(150) NOT NULL,
    message          VARCHAR(1000) NOT NULL,
    reference_id     BIGINT,
    reference_type   VARCHAR(40),
    type             VARCHAR(20) NOT NULL,   -- EMAIL | SMS | IN_APP | PUSH
    status           VARCHAR(20) NOT NULL,   -- PENDING | SENT | FAILED | READ
    created_at       DATETIME NOT NULL,
    sent_at          DATETIME,
    read_at          DATETIME,
    failure_reason   VARCHAR(500),

    INDEX idx_recipient (recipient_id),
    INDEX idx_status (status),
    INDEX idx_type (type)
);

-- Sample rows for quick manual testing
INSERT INTO notifications (recipient_id, recipient_role, recipient_email, title, message, type, status, created_at)
VALUES
(1, 'CITIZEN', 'citizen1@example.com', 'Complaint Registered', 'Your complaint #101 has been registered.', 'IN_APP', 'SENT', NOW()),
(1, 'CITIZEN', 'citizen1@example.com', 'Status Update', 'Your complaint #101 is now In Progress.', 'EMAIL', 'SENT', NOW());

