function StatusBadge({ status }) {
  const className = status
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`status-badge ${className}`}>
      {status}
    </span>
  );
}

export default StatusBadge;