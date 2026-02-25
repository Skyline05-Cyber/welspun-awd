const ReportsTable = () => {
  const reports = [
    { type: 'Monthly Sales', period: 'Feb 2026', revenue: '₹1.25L', profit: '+15.2%' },
    { type: 'Stock Usage', period: 'Q1 2026', consumed: '1,245m', savings: '+8.7%' },
    { type: 'Production', period: 'Week 8', output: '890 pcs', efficiency: '92%' }
  ];

  return (
    <>
      <h2>📊 Reports</h2>
      <div className="report-actions">
        <button className="generate-btn">🔄 Generate Report</button>
        <button className="pdf-btn">📄 PDF Export</button>
      </div>
      <table className="reports-table">
        <thead><tr><th>Type</th><th>Period</th><th>Metrics</th><th>Performance</th></tr></thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={index}>
              <td>{report.type}</td>
              <td>{report.period}</td>
              <td>{report.revenue || report.consumed || report.output}</td>
              <td><span className="performance-badge">{report.profit || report.savings || report.efficiency}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ReportsTable;
