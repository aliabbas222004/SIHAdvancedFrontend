import React, { useState } from "react";

const ShowTransport = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [transports, setTransports] = useState([]);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!month || !year) {
      setMessage("❌ Please select both month and year.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/transport/getAll?month=${month}&year=${year}`
      );
      if (!res.ok) {
        setMessage("❌ Failed to fetch transport data.");
        return;
      }

      const data = await res.json();
      // Sort by date (ascending)
      const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setTransports(sortedData);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error occurred while fetching transport data.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-start mt-4">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "600px" }}>
        <h3 className="text-center mb-4">Monthly Transport Report</h3>

        {/* Filter Form */}
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Month</label>
              <input
                type="number"
                className="form-control"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="e.g. 10"
                min="1"
                max="12"
                required
              />
            </div>
            <div className="col">
              <label className="form-label">Year</label>
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2025"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Show Transport
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className="alert alert-info text-center mt-3 mb-0">{message}</div>
        )}

        {/* Transport Table */}
        {transports.length > 0 && (
          <div className="mt-4">
            <h5 className="text-center mb-3">
              Transport Entries for {month}/{year}
            </h5>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transport Cost (₹)</th>
                </tr>
              </thead>
              <tbody>
                {transports.map((t) => (
                  <tr key={t._id}>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td>{t.val}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-end fw-bold">
              Total: ₹
              {transports.reduce((sum, t) => sum + Number(t.val || 0), 0)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowTransport;

