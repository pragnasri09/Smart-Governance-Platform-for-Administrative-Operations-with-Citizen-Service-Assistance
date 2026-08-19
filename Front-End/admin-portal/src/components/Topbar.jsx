function Topbar({ title, description }) {
  return (
    <header className="topbar">
      <div>
        <span className="breadcrumb">
          CIVICPULSE / MANAGEMENT
        </span>

        <h1>{title}</h1>

        <p>{description}</p>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon">
          ⌕
        </button>

        <button className="topbar-icon notification-icon">
          ♢
          <span />
        </button>

        <div className="topbar-avatar">PS</div>
      </div>
    </header>
  );
}

export default Topbar;