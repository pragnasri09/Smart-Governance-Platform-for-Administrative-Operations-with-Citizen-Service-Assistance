function StatCard({
  title,
  value,
  change,
  icon,
  variant = "plum",
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${variant}`}>
        {icon}
      </div>

      <div className="stat-information">
        <span>{title}</span>

        <strong>{value}</strong>

        <small>{change}</small>
      </div>
    </div>
  );
}

export default StatCard;