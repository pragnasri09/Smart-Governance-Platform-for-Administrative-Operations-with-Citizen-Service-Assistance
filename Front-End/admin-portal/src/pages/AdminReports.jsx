import { useNavigate } from "react-router-dom";

function AdminReports() {
  const navigate = useNavigate();

  return (
    <div className="admin-page">

      <header className="admin-header">

        <div>
          <h2>CivicPulse</h2>
          <p>System Administration Portal</p>
        </div>

        <button
          className="admin-logout"
          onClick={() => navigate("/admin/dashboard")}
        >
          Back to Dashboard
        </button>

      </header>

      <main className="admin-main">

        <button
          className="admin-back"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Dashboard
        </button>

        <p className="admin-eyebrow">
          PLATFORM ANALYTICS
        </p>

        <h1>Reports & Analytics</h1>

        <p className="admin-description">
          Review platform-wide complaint and department performance.
        </p>

        <section className="report-grid">

          <div className="report-card">
            <span>COMPLAINTS RECEIVED</span>
            <strong>486</strong>
            <p>Across all departments</p>
          </div>

          <div className="report-card">
            <span>RESOLUTION RATE</span>
            <strong>64%</strong>
            <p>Overall platform resolution</p>
          </div>

          <div className="report-card">
            <span>AVG. RESPONSE TIME</span>
            <strong>18h</strong>
            <p>Average first response</p>
          </div>

          <div className="report-card">
            <span>CITIZEN SATISFACTION</span>
            <strong>84%</strong>
            <p>Based on resolved complaints</p>
          </div>

        </section>

        <section className="report-panel">

          <h2>Department Performance</h2>

          <div className="report-row">
            <span>Water Supply</span>
            <div className="report-bar">
              <div style={{ width: "82%" }}></div>
            </div>
            <strong>82%</strong>
          </div>

          <div className="report-row">
            <span>Roads & Transport</span>
            <div className="report-bar">
              <div style={{ width: "74%" }}></div>
            </div>
            <strong>74%</strong>
          </div>

          <div className="report-row">
            <span>Sanitation</span>
            <div className="report-bar">
              <div style={{ width: "68%" }}></div>
            </div>
            <strong>68%</strong>
          </div>

          <div className="report-row">
            <span>Electricity</span>
            <div className="report-bar">
              <div style={{ width: "61%" }}></div>
            </div>
            <strong>61%</strong>
          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminReports;