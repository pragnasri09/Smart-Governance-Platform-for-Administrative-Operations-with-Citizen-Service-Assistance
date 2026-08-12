function Sidebar({
  currentPage,
  onNavigate,
  onLogout,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon small">CP</div>

        <div>
          <strong>CivicPulse</strong>
          <span>Government Platform</span>
        </div>
      </div>

      <div className="menu-label">WORKSPACE</div>

      <button
        className={
          currentPage === "admin"
            ? "sidebar-item active"
            : "sidebar-item"
        }
        onClick={() => onNavigate("admin")}
      >
        <span>▦</span>
        Dashboard
      </button>
      <button
  className={
    currentPage === "department"
      ? "sidebar-item active"
      : "sidebar-item"
  }
  onClick={() => onNavigate("department")}
>
  <span>⌂</span>
  Department Dashboard
</button>

      <button className="sidebar-item">
        <span>◈</span>
        Complaints
      </button>

      <button className="sidebar-item">
        <span>⌂</span>
        Departments
      </button>

      <button className="sidebar-item">
        <span>◎</span>
        Citizens
      </button>

      <button className="sidebar-item">
        <span>◫</span>
        Reports
      </button>

      <button className="sidebar-item">
        <span>♢</span>
        Notifications
      </button>

      <div className="sidebar-bottom">
        <div className="sidebar-profile">
          <div className="profile-avatar">PS</div>

          <div>
            <strong>Administrator</strong>
            <span>System Admin</span>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;