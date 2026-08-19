function NotificationPanel() {
  const notifications = [
    {
      title: "New high-priority complaint",
      text: "Water leakage reported in Ward 4.",
      time: "8 min ago",
    },
    {
      title: "Complaint resolved",
      text: "CMP-1041 has been marked resolved.",
      time: "24 min ago",
    },
    {
      title: "Department update",
      text: "Sanitation team updated today's queue.",
      time: "1 hr ago",
    },
  ];

  return (
    <div className="panel notification-panel">
      <div className="panel-heading">
        <div>
          <h3>Recent activity</h3>
          <p>Latest system updates</p>
        </div>

        <span className="live-indicator">
          LIVE
        </span>
      </div>

      <div className="notification-list">
        {notifications.map((item, index) => (
          <div
            className="notification-item"
            key={index}
          >
            <div className="notification-dot">
              {index + 1}
            </div>

            <div>
              <strong>{item.title}</strong>

              <p>{item.text}</p>

              <small>{item.time}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationPanel;