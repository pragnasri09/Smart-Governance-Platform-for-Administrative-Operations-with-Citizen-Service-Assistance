import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const session =
    JSON.parse(localStorage.getItem("civicpulseSession")) || {};

  const logout = () => {
    localStorage.removeItem("civicpulseSession");
    navigate("/");
  };

  return (
    <div className="admin-page">

      <header className="admin-header">

        <div>
          <h2>CivicPulse</h2>
          <p>System Administration Portal</p>
        </div>

        <button
          className="admin-logout"
          onClick={logout}
        >
          Logout
        </button>

      </header>

      <main className="admin-main">

        <p className="admin-eyebrow">
          CIVICPULSE / ADMINISTRATION
        </p>

        <h1>
          Welcome, {session.name || "Administrator"}.
        </h1>

        <p className="admin-description">
          Monitor the CivicPulse platform, departments,
          citizens and complaint activity.
        </p>

        <section className="admin-stats">

          <div className="admin-stat-card">
            <span>REGISTERED CITIZENS</span>
            <h2>1,248</h2>
            <p>Active users on the platform</p>
          </div>

          <div className="admin-stat-card">
            <span>TOTAL COMPLAINTS</span>
            <h2>486</h2>
            <p>Complaints submitted</p>
          </div>

          <div className="admin-stat-card">
            <span>DEPARTMENTS</span>
            <h2>12</h2>
            <p>Connected government departments</p>
          </div>

          <div className="admin-stat-card">
            <span>RESOLVED</span>
            <h2>312</h2>
            <p>Successfully resolved complaints</p>
          </div>

        </section>

        <section className="admin-panel">

          <h2>Administration Overview</h2>

          <p>
            The administrator can monitor complaints,
            coordinate departments, manage users and
            review platform reports.
          </p>

          <div className="admin-actions">

  <button
    onClick={() => navigate("/admin/complaints")}
  >
    Manage Complaints
  </button>

  <button
    onClick={() => navigate("/admin/departments")}
  >
    Manage Departments
  </button>

  <button
    onClick={() => navigate("/admin/citizens")}
  >
    Manage Citizens
  </button>

  <button
    onClick={() => navigate("/admin/reports")}
  >
    View Reports
  </button>

</div>

          

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;