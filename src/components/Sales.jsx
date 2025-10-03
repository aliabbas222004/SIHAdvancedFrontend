import React, { useState } from "react";

const Sales = () => {
  const [mode, setMode] = useState(""); // "month" or "year"
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [sales, setSales] = useState(null);

  const handleSubmit = async () => {
    let query = "";
    if (mode === "month") query = `month=${month}&year=${year}`;
    if (mode === "year") query = `year=${year}`;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/analytics/sales?${query}`);
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error("Error fetching sales:", err);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">📊 Sales Report</h2>

      {/* Form Section */}
      <div className="d-flex justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          {/* Select Mode */}
          <div className="mb-3">
            <label className="form-label">Select Report Type:</label>
            <select
              className="form-select"
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                setSales(null);
                setMonth("");
                setYear("");
              }}
            >
              <option value="">-- Choose --</option>
              <option value="month">Month Wise</option>
              <option value="year">Year Wise</option>
            </select>
          </div>

          {/* Month Selection */}
          {mode === "month" && (
            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-2">
                <label className="form-label">Month:</label>
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
              <div className="col-12 col-md-6 mb-2">
                <label className="form-label">Year:</label>
                <input
                  type="number"
                  className="form-control"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2025"
                />
              </div>
            </div>
          )}

          {/* Year Selection */}
          {mode === "year" && (
            <div className="mb-3">
              <label className="form-label">Year:</label>
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2025"
              />
            </div>
          )}

          {/* Submit Button */}
          {mode && (
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-primary px-4"
                onClick={handleSubmit}
                disabled={mode === "month" ? !month || !year : !year}
              >
                Show Sales
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {sales && (
        <div className="row mt-5">
          <div className="col-12 col-md-10 col-lg-8 mx-auto">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">📌 Sales Summary</h5>
                <p><strong>Total Quantity:</strong> {sales.totalQuantity}</p>
                <p><strong>Total Revenue:</strong> ₹{sales.totalRevenue}</p>

                <h6 className="mt-4">📦 Item-wise Breakdown</h6>
                <div className="table-responsive">
                  <table className="table table-bordered text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Item ID</th>
                        <th>Quantity Sold</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.items.map((item, i) => (
                        <tr key={i}>
                          <td>{item.itemId}</td>
                          <td>{item.totalQuantity}</td>
                          <td>₹{item.totalRevenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
