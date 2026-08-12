import { useNavigate } from "react-router-dom";

function AdminDepartments() {
  const navigate = useNavigate();

  const departments = [
    {
      name: "Water Supply",
      officer: "Department Staff",
      complaints: 148,
      resolved: 96,
      status: "Active",
    },
    {
      name: "Roads & Transport",
      officer: "Department Staff",
      complaints: 126,
      resolved: 84,
      status: "Active",
    },
    {
      name: "Sanitation",
      officer: "Department Staff",
      complaints: 92,
      resolved: 71,
      status: "Active",
    },
    {
      name: "Electricity",
      officer: "Department Staff",
      complaints: 120,
      resolved: 61,
      status: "Active",
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
          DEPARTMENT MANAGEMENT
        </p>

        <h1>Manage Departments</h1>

        <p className="admin-description">
          Monitor departments and their complaint resolution activity.
        </p>

        <section className="admin-table-card">

          <div className="admin-table-heading">
            <div>
              <h2>Government Departments</h2>
              <p>Department performance overview</p>
            </div>

            <button
              className="admin-primary-button"
              onClick={() => alert("Add department feature will be connected later.")}
            >
              + Add Department
            </button>
          </div>

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Department</th>
                  <th>Staff</th>
                  <th>Complaints</th>
                  <th>Resolved</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {departments.map((department) => (
                  <tr key={department.name}>

                    <td>
                      <strong>{department.name}</strong>
                    </td>

                    <td>{department.officer}</td>

                    <td>{department.complaints}</td>

                    <td>{department.resolved}</td>

                    <td>
                      <span className="status-badge resolved">
                        {department.status}
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

export default AdminDepartments;