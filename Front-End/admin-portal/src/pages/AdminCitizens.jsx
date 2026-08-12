import { useNavigate } from "react-router-dom";

function AdminCitizens() {
  const navigate = useNavigate();

  const citizens = [
    {
      name: "Ananya Rao",
      email: "ananya.rao@gmail.com",
      complaints: 5,
      status: "Active",
    },
    {
      name: "Rahul Kumar",
      email: "rahul.kumar@gmail.com",
      complaints: 3,
      status: "Active",
    },
    {
      name: "Priya Sharma",
      email: "priya.sharma@gmail.com",
      complaints: 7,
      status: "Active",
    },
    {
      name: "Suresh Babu",
      email: "suresh.babu@gmail.com",
      complaints: 2,
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
          CITIZEN MANAGEMENT
        </p>

        <h1>Manage Citizens</h1>

        <p className="admin-description">
          View registered citizens and their complaint activity.
        </p>

        <section className="admin-table-card">

          <div className="admin-table-heading">

            <div>
              <h2>Registered Citizens</h2>
              <p>Citizen accounts on CivicPulse</p>
            </div>

            <span className="admin-count">
              {citizens.length} users
            </span>

          </div>

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Complaints</th>
                  <th>Account Status</th>
                </tr>
              </thead>

              <tbody>

                {citizens.map((citizen) => (
                  <tr key={citizen.email}>

                    <td>
                      <strong>{citizen.name}</strong>
                    </td>

                    <td>{citizen.email}</td>

                    <td>{citizen.complaints}</td>

                    <td>
                      <span className="status-badge resolved">
                        {citizen.status}
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

export default AdminCitizens;