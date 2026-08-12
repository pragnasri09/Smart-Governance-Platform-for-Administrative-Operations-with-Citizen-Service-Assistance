function ChartCard() {
  const bars = [45, 62, 50, 78, 58, 88, 70];

  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  return (
    <div className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <h3>Complaint activity</h3>

          <p>
            Complaints received during the last seven days
          </p>
        </div>

        <select defaultValue="7">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>

      <div className="bar-chart">
        <div className="chart-values">
          <span>120</span>
          <span>90</span>
          <span>60</span>
          <span>30</span>
          <span>0</span>
        </div>

        <div className="chart-main">
          <div className="chart-grid">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>

          <div className="bars">
            {bars.map((height, index) => (
              <div
                key={days[index]}
                className="bar-column"
              >
                <div
                  className="bar"
                  style={{
                    height: `${height}%`,
                  }}
                />

                <span>{days[index]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartCard;