import React, { useState } from "react";

const MonthReport = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [report, setReport] = useState([]);

  const handleSubmit = async () => {
    if (!month || !year) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/analytics/monthlyReport?month=${month}&year=${year}`
      );
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Error fetching profit:", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">📅 Monthly Report</h2>

      {/* Form Wrapper */}
      {report.length === 0 && (
        <div className="d-flex justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">

            <div className="card shadow-sm p-4">
              <h5 className="mb-3 fw-bold">Select Month & Year</h5>

              <div className="row">
                {/* Month */}
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label fw-semibold">Month:</label>
                  <select
                    className="form-select"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    <option value="">-- Choose Month --</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>

                {/* Year */}
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label fw-semibold">Year:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g., 2025"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-primary px-4"
                  onClick={handleSubmit}
                  disabled={!month || !year}
                >
                  Show Report
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Report Section */}
      {Array.isArray(report) && report.length > 0 && (
        <div className="mt-5" id="print-section">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Bill ID</th>
                  <th>Customer Name</th>
                  <th>Phone</th>
                  <th>GST</th>
                  <th>Total Amount</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {report.map((bill, index) => (
                  <tr key={index}>
                    <td>{bill.billId}</td>
                    <td>{bill.customerName}</td>
                    <td>{bill.customerPhone}</td>
                    <td>{bill.customerGST || "—"}</td>
                    <td>₹{bill.totalAmount}</td>
                    <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PRINT BUTTON */}
          <div className="text-center mt-4">
            <button className="btn btn-success px-4" onClick={handlePrint}>
              🖨️ Print Report
            </button>
          </div>
        </div>
      )}

      {/* Print-Only CSS */}
      <style>
        {`
  @media print {
    body * {
      visibility: hidden;
    }
    #print-section, #print-section * {
      visibility: visible;
    }
    #print-section {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      padding: 10px;
    }

    /* Reduce font sizes */
    #print-section table {
      font-size: 12px !important;
    }

    #print-section th {
      font-size: 13px !important;
      padding: 4px !important;
    }

    #print-section td {
      font-size: 12px !important;
      padding: 4px !important;
    }

    #print-section h4,
    #print-section h5,
    #print-section h2 {
      font-size: 16px !important;
      margin-bottom: 10px !important;
    }

    /* Remove buttons during print */
    button {
      display: none !important;
    }
  }
`}
      </style>

    </div>
  );
};

export default MonthReport;
