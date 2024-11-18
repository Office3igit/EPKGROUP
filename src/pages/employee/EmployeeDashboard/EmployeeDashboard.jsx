import React from 'react';

const EmployeeDashboardPowerBIReport = () => {
  const embedUrl = "https://app.powerbi.com/view?r=eyJrIjoiNDMyYjljNjEtNDk4ZC00YjVhLThmZWYtZGIyNGQ0NGJhZTBlIiwidCI6IjAwY2I0OWZkLTcwN2YtNDU1Yi1hZGQxLTkyMmY5NDVhZGJhNSJ9"; 


  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        title="Power BI Report"
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
};

export default EmployeeDashboardPowerBIReport;
