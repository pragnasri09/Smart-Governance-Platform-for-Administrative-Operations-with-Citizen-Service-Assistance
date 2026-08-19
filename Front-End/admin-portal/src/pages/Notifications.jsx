import { useNavigate } from "react-router-dom";

function Notifications() {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      type: "Complaint Update",
      title: "Complaint received",
      message:
        "Your complaint has been successfully registered and forwarded to the concerned department.",
      time: "Today",
      unread: true,
    },
    {
      id: 2,
      type: "Service Update",
      title: "Department review started",
      message:
        "The concerned department has started reviewing recently submitted complaints.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      type: "CivicPulse",
      title: "Welcome to CivicPulse",
      message:
        "You can use this portal to submit complaints and track their resolution.",
      time: "Earlier",
      unread: false,
    },
  ];

  return (
    <div className="citizen-page">
      <header className="citizen-header">
        <div className="brand">
          <div className="brand-mark">CP</div>

          <div>
            <h2>CivicPulse</h2>
            <span>Citizen Portal</span>
          </div>
        </div>

        <button
          className="outline-button"
          onClick={() => navigate("/citizen/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="notifications-page">
        <div className="page-heading">
          <span className="eyebrow">UPDATES & ALERTS</span>

          <h1>Notifications</h1>

          <p>
            Stay informed about complaint updates and important CivicPulse
            announcements.
          </p>
        </div>

        <div className="notification-list">
          {notifications.map((notification) => (
            <div
              className={`notification-card ${
                notification.unread ? "notification-unread" : ""
              }`}
              key={notification.id}
            >
              <div className="notification-icon">
                {notification.unread ? "!" : "✓"}
              </div>

              <div className="notification-content">
                <div className="notification-heading">
                  <div>
                    <span>{notification.type}</span>
                    <h3>{notification.title}</h3>
                  </div>

                  <small>{notification.time}</small>
                </div>

                <p>{notification.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="notification-footer">
          <button
            className="secondary-button"
            onClick={() => navigate("/citizen/complaints")}
          >
            View My Complaints
          </button>

          <button
            className="primary-button"
            onClick={() => navigate("/citizen/submit-complaint")}
          >
            Submit a Complaint →
          </button>
        </div>
      </main>
    </div>
  );
}

export default Notifications;