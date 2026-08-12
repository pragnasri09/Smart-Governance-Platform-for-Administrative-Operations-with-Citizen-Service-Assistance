import StatusBadge from "./StatusBadge";

function ComplaintTable({ complaints }) {
  return (
    <div className="table-container">
      <table className="complaint-table">
        <thead>
          <tr>
            <th>Complaint ID</th>
            <th>Citizen</th>
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

              <td>{complaint.department}</td>

              <td>
                <span
                  className={`priority-badge ${complaint.priority.toLowerCase()}`}
                >
                  {complaint.priority}
                </span>
              </td>

              <td>
                <StatusBadge status={complaint.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintTable;