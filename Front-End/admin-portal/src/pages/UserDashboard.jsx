import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();

  const session =
    JSON.parse(localStorage.getItem("civicpulseSession")) || {};

  const logout = () => {
    localStorage.removeItem("civicpulseSession");
    navigate("/");
  };

  return (
    <div className="simple-dashboard">
      <header className="simple-header">
        <div className="brand">
          <div className="brand-mark">CP</div>

          <div>
            <h2>CivicPulse</h2>
            <span>Citizen Portal</span>
          </div>
        </div>

        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </header>

      <main className="user-dashboard-content">
        <span className="eyebrow">CITIZEN PORTAL</span>

        <h1>
          Welcome, {session.name || "Citizen"}.
        </h1>

        <p>
          Manage your civic complaints and stay updated with
          public service activity.
        </p>

        <div className="user-cards">
          <div className="user-card">
            <span>01</span>
            <h3>Submit a complaint</h3>
            <p>
              Report a civic issue that needs attention.
            </p>

            <button>Submit Complaint →</button>
          </div>

          <div className="user-card">
            <span>02</span>
            <h3>My complaints</h3>
            <p>
              Track complaints and see their current status.
            </p>

            <button>View Complaints →</button>
          </div>

          <div className="user-card">
            <span>03</span>
            <h3>Notifications</h3>
            <p>
              Stay informed about updates to your complaints.
            </p>

            <button>View Updates →</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;