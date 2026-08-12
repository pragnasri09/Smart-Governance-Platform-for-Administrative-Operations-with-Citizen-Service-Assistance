import { useNavigate } from "react-router-dom";

function DepartmentDashboard() {

  const navigate = useNavigate();

  const session =
    JSON.parse(localStorage.getItem("civicpulseSession")) || {};

  const logout = () => {
    localStorage.removeItem("civicpulseSession");
    navigate("/");
  };

  return (
    <div className="department-page">

      {/* Header */}
      <header className="department-header">

        <div className="department-brand">
          <h2>CivicPulse</h2>
          <p>Department Staff Portal</p>
        </div>

        <button
          className="department-logout"
          onClick={logout}
        >
          Logout
        </button>

      </header>


      {/* Main Content */}
      <main className="department-main">

        <p className="department-eyebrow">
          DEPARTMENT STAFF PORTAL
        </p>

        <h1>
          Welcome, {session.name || "Department Staff"}.
        </h1>

        <p className="department-description">
          Manage and resolve complaints assigned to your department.
        </p>


        {/* Statistics */}
        <section className="department-stats">

          <div className="department-stat-card">
            <span className="department-stat-label">
              ASSIGNED
            </span>

            <h2>24</h2>

            <p>
              Complaints assigned to your department
            </p>
          </div>


          <div className="department-stat-card">
            <span className="department-stat-label">
              IN PROGRESS
            </span>

            <h2>12</h2>

            <p>
              Complaints currently being handled
            </p>
          </div>


          <div className="department-stat-card">
            <span className="department-stat-label">
              RESOLVED
            </span>

            <h2>38</h2>

            <p>
              Complaints successfully resolved
            </p>
          </div>

        </section>


        {/* Department Information */}
        <section className="department-info">

          <h2>
            Department
          </h2>

          <p className="department-name">
            {session.department || "Department not assigned"}
          </p>

          <button
            className="department-action"
            onClick={() => navigate("/department/complaints")}
          >
            View Assigned Complaints →
          </button>

        </section>

      </main>

    </div>
  );
}

export default DepartmentDashboard;