# CivicPulse — Notification Service

Backend module for the **Notifications & Communication Services** box in the
CivicPulse architecture diagram. Built with Spring Boot 3 + MySQL. Supports
Email, In-App, SMS, and Push channels behind one API, plus a plain
HTML/JS dummy frontend to test it without needing the real CivicPulse UI.

## What's included
- `Notification` entity + MySQL table (`notifications`)
- REST API: send, list per user, mark read, unread count, resend, delete
- Pluggable channel senders (strategy pattern):
  - **Email** — real SMTP via Spring Mail (JavaMailSender)
  - **In-App** — stored in DB, read via the API (this *is* the delivery)
  - **SMS** — stub, logs the message; wire in Twilio/MSG91 later
  - **Push** — stub, logs the message; wire in Firebase Cloud Messaging later
- Async dispatch so `POST /send` returns immediately
- `dummy-frontend/index.html` — a self-contained test UI (no build step)

## 1. Set up MySQL
```sql
CREATE DATABASE civicpulse_notifications;
```
Or just run `schema.sql` in this folder — it creates the DB, table, and a
couple of sample rows.

## 2. Configure `src/main/resources/application.properties`
Update these before running:
```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password

spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password   # Gmail: generate an "app password"
```
If you don't set real mail credentials, EMAIL sends will fail gracefully —
the notification row will just show `status=FAILED` with the SMTP error as
`failureReason`. IN_APP, SMS(stub), and PUSH(stub) will still work fine.

## 3. Run the backend
```bash
mvn spring-boot:run
```
It starts on **http://localhost:8082**. `spring.jpa.hibernate.ddl-auto=update`
means Hibernate will create/adjust the table automatically on first boot too.

## 4. Open the dummy frontend
Just open `dummy-frontend/index.html` directly in a browser (double-click it,
or right-click → Open with Browser). It talks to `http://localhost:8082`.
No npm/build step needed.

You can:
- Send a notification on any channel and see the row it created
- Load a user's inbox by ID and mark items as read
- See the full admin table of every notification with delivery status

## API Reference

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/notifications/send` | Create + dispatch a notification |
| GET | `/api/notifications/user/{recipientId}` | A user's notifications, newest first |
| GET | `/api/notifications/user/{recipientId}/unread-count` | Badge count |
| GET | `/api/notifications?page=0&size=20` | Admin: paginated, all notifications |
| PUT | `/api/notifications/{id}/read` | Mark one as read |
| POST | `/api/notifications/{id}/resend` | Retry a FAILED notification |
| DELETE | `/api/notifications/{id}` | Delete a notification |

### Example request body (`POST /send`)
```json
{
  "recipientId": 1,
  "recipientRole": "CITIZEN",
  "recipientEmail": "citizen1@example.com",
  "title": "Complaint Status Update",
  "message": "Your complaint #101 has been marked as Resolved.",
  "type": "EMAIL",
  "referenceType": "COMPLAINT",
  "referenceId": 101
}
```

## How this plugs into the rest of CivicPulse
Other backend modules (Complaint Service, Feedback Service, Announcement
Service) call `POST /api/notifications/send` whenever something happens that
a user should hear about — complaint status change, new announcement, etc.
This service owns delivery + the notification history table; it doesn't need
to know anything about complaints or announcements beyond the optional
`referenceType`/`referenceId` tag for traceability.

## Extending
- Real SMS: implement the provider call inside
  `service/channel/SmsNotificationSender.java` — nothing else changes.
- Real Push: implement FCM/APNs inside
  `service/channel/PushNotificationSender.java`, store device tokens on the
  request/entity when you're ready.
- Auth: currently open (`@CrossOrigin(origins = "*")`) for easy testing —
  restrict this and add JWT/session auth before production, matching the
  "Authentication & Authorization" service in the architecture diagram.
