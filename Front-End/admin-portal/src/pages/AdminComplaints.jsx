import { useNavigate } from "react-router-dom";

function AdminComplaints() {
  const navigate = useNavigate();

  const complaints = [
    {
      id: "CP-1024",
      citizen: "Ananya Rao",
      department: "Water Supply",
      issue: "Water leakage near main road",
      priority: "High",
      status: "In Progress",
    },
    {
      id: "CP-1021",
      citizen: "Rahul Kumar",
      department: "Water Supply",
      issue: "Low water pressure",
      priority: "Medium",
      status: "Assigned",
    },
    {
      id: "CP-1018",
      citizen: "Priya Sharma",
      department: "Roads",
      issue: "Damaged public road",
      priority: "High",
      status: "In Progress",
    },
    {
      id: "CP-1012",
      citizen: "Suresh Babu",
      department: "Sanitation",
      issue: "Garbage collection delay",
      priority: "Low",
      status: "Resolved",
    },
  ];

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
          COMPLAINT MANAGEMENT
        </p>

        <h1>Manage Complaints</h1>

        <p className="admin-description">
          Monitor complaints submitted by citizens and track their
          progress across departments.
        </p>

        <section className="admin-table-card">

          <div className="admin-table-heading">
            <div>
              <h2>All Complaints</h2>
              <p>Platform-wide complaint activity</p>
            </div>

            <span className="admin-count">
              {complaints.length} records
            </span>
          </div>

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Citizen</th>
                  <th>Issue</th>
                  <th>Department</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>

                    <td>
                      <strong>{complaint.id}</strong>
                    </td>

                    <td>{complaint.citizen}</td>

                    <td>{complaint.issue}</td>

                    <td>{complaint.department}</td>

                    <td>
                      <span
                        className={`priority-badge ${complaint.priority.toLowerCase()}`}
                      >
                        {complaint.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${complaint.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {complaint.status}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminComplaints;