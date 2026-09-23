ALTER TABLE complaints
    ADD COLUMN verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    ADD COLUMN verified_at TIMESTAMP(6) NULL,
    ADD COLUMN reopen_reason TEXT NULL;

ALTER TABLE complaints
    DROP CONSTRAINT chk_complaint_status,
    ADD CONSTRAINT chk_complaint_status CHECK (status IN ('PENDING','ASSIGNED','IN_PROGRESS','RESOLVED','REOPENED','CLOSED','REJECTED')),
    ADD CONSTRAINT chk_verification_status CHECK (verification_status IN ('PENDING','ACCEPTED','REJECTED'));

CREATE INDEX idx_complaints_status_category_created
    ON complaints(status, category, created_at);
CREATE INDEX idx_complaints_location
    ON complaints(latitude, longitude);

CREATE TABLE complaint_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    event_type VARCHAR(30) NOT NULL,
    description VARCHAR(500) NOT NULL,
    performed_by BIGINT NULL,
    event_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_history_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id),
    CONSTRAINT fk_history_user FOREIGN KEY (performed_by) REFERENCES users(id),
    CONSTRAINT chk_history_event_type CHECK (event_type IN ('CREATED','ASSIGNED','STATUS_CHANGED','RESOLUTION_CREATED','RESOLVED','VERIFIED','REOPENED','CLOSED'))
);
CREATE INDEX idx_history_complaint_time ON complaint_history(complaint_id, event_at);
