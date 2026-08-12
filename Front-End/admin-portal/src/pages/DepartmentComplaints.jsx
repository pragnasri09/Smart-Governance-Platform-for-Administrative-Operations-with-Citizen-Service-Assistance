import { useNavigate } from "react-router-dom";

function DepartmentComplaints() {
  const navigate = useNavigate();

  const complaints = [
    {
      id: "CP-1024",
      title: "Water leakage near main road",
      citizen: "Ananya Rao",
      priority: "High",
      status: "In Progress",
      date: "12 Aug 2026",
    },
    {
      id: "CP-1021",
      title: "Low water pressure in residential area",
      citizen: "Rahul Kumar",
      priority: "Medium",
      status: "Assigned",
      date: "11 Aug 2026",
    },
    {
      id: "CP-1018",
      title: "Damaged public water pipeline",
      citizen: "Priya Sharma",
      priority: "High",
      status: "In Progress",
      date: "10 Aug 2026",
    },
    {
      id: "CP-1012",
      title: "Irregular water supply",
      citizen: "Suresh Babu",
      priority: "Low",
      status: "Resolved",
      date: "08 Aug 2026",
    },
  ];

  return (
    <div className="department-page">

      <header className="department-header">

        <div className="department-brand">
          <h2>CivicPulse</h2>
          <p>Department Staff Portal</p>
        </div>

        <button
          className="department-logout"
          onClick={() => navigate("/department/dashboard")}
        >
          Back to Dashboard
        </button>

      </header>

      <main className="department-main">

        <button
          className="complaints-back"
          onClick={() => navigate("/department/dashboard")}
        >
          ← Dashboard
        </button>

        <p className="department-eyebrow">
          COMPLAINT MANAGEMENT
        </p>

        <h1>Assigned Complaints</h1>

        <p className="department-description">
          Review complaints assigned to your department and update
          their resolution status.
        </p>

        <section className="complaints-panel">

          <div className="complaints-panel-header">
            <div>
              <h2>Complaint Queue</h2>
              <p>Water Supply Department</p>
            </div>

            <span className="complaint-count">
              {complaints.length} complaints
            </span>
          </div>

          <div className="complaints-table-wrapper">

            <table className="complaints-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Complaint</th>
                  <th>Citizen</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {complaints.map((complaint) => (

                  <tr key={complaint.id}>

                    <td>
                      <strong>{complaint.id}</strong>
                    </td>

                    <td>
                      <span className="complaint-title">
                        {complaint.title}
                      </span>
                    </td>

                    <td>
                      {complaint.citizen}
                    </td>

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

                    <td>
                      {complaint.date}
                    </td>

                    <td>
                      <button
                        className="complaint-action"
                        onClick={() =>
                          alert(
                            `Opening ${complaint.id} - ${complaint.title}`
                          )
                        }
                      >
                        View
                      </button>
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

export default DepartmentComplaints;