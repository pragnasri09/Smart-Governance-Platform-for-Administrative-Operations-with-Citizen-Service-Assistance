import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const savedComplaints =
      JSON.parse(localStorage.getItem("civicpulseComplaints")) || [];

    setComplaints(savedComplaints);
  }, []);

  const getStatusClass = (status) => {
    if (status === "Resolved") return "status-resolved";
    if (status === "In Progress") return "status-progress";

    return "status-submitted";
  };

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

      <main className="complaints-page">
        <div className="page-heading">
          <span className="eyebrow">COMPLAINT TRACKING</span>

          <h1>My Complaints</h1>

          <p>
            Track the complaints you have submitted and monitor their current
            status.
          </p>
        </div>

        {complaints.length === 0 ? (
          <div className="empty-card">
            <div className="empty-icon">○</div>

            <h2>No complaints yet</h2>

            <p>
              You have not submitted any complaints. Once you submit a
              complaint, it will appear here.
            </p>

            <button
              className="primary-button"
              onClick={() => navigate("/citizen/submit-complaint")}
            >
              Submit Your First Complaint →
            </button>
          </div>
        ) : (
          <div className="complaints-list">
            {complaints.map((complaint) => (
              <div className="complaint-card" key={complaint.id}>
                <div className="complaint-top">
                  <div>
                    <span className="complaint-id">
                      {complaint.id}
                    </span>

                    <h2>{complaint.title}</h2>
                  </div>

                  <span
                    className={`complaint-status ${getStatusClass(
                      complaint.status
                    )}`}
                  >
                    {complaint.status}
                  </span>
                </div>

                <div className="complaint-details">
                  <div>
                    <span>Category</span>
                    <strong>{complaint.category}</strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>{complaint.location}</strong>
                  </div>

                  <div>
                    <span>Priority</span>
                    <strong>{complaint.priority}</strong>
                  </div>

                  <div>
                    <span>Submitted</span>
                    <strong>{complaint.date}</strong>
                  </div>
                </div>

                <div className="complaint-description">
                  <span>Description</span>

                  <p>{complaint.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="secondary-button page-back-button"
          onClick={() => navigate("/citizen/submit-complaint")}
        >
          + Submit Another Complaint
        </button>
      </main>
    </div>
  );
}

export default MyComplaints;