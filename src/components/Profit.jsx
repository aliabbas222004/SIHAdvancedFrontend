import React, { useState } from "react";

const Profit = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [profit, setProfit] = useState(null);
  const [tCost,setTCost]=useState(0);

  const handleSubmit = async () => {
    if (!month || !year) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/analytics/monthly-profit?month=${month}&year=${year}`
      );
      const data = await res.json();
      setProfit(data);

      const transportationCost=await fetch(
        `${import.meta.env.VITE_API_URL}/transport/monthly-transport?month=${month}&year=${year}`
      );
      const cost=await transportationCost.json()
      setTCost(cost.totalTransportCost);
    } catch (err) {
      console.error("Error fetching profit:", err);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">💰 Profit Report</h2>

      {/* Form Section */}
      <div className="d-flex justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          {/* Month Selection */}
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

          {/* Submit Button */}
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-success px-4"
              onClick={handleSubmit}
              disabled={!month || !year}
            >
              Show Profit
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {profit && (
        <div className="row mt-5">
          <div className="col-12 col-md-10 col-lg-8 mx-auto">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-3">📌 Profit Summary</h5>

                {/* Total Profit */}
                <p>
                  <strong>Profit on selling items:</strong>{" "}
                  ₹
                  {(profit
                    .reduce((acc, item) => acc + item.profit, 0)
                    .toFixed(2))}
                </p>

                <p>
                  <strong>Total Transportation Cost:</strong>{" "}
                  ₹
                  {tCost}
                </p>

                <p>
                  <strong>Total Profit:</strong>{" "}
                  ₹
                  {(profit
                    .reduce((acc, item) => acc + item.profit, 0)
                    .toFixed(2))-tCost}
                </p>

                <h6 className="mt-4">📦 Item-wise Breakdown</h6>
                <div className="table-responsive">
                  <table className="table table-bordered text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Item ID</th>
                        <th>Sold Quantity</th>
                        <th>Revenue</th>
                        <th>Cost</th>
                        <th>Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profit.map((item, i) => (
                        <tr key={i}>
                          <td>{item.itemId}</td>
                          <td>{item.soldQuantity}</td>
                          <td>₹{item.revenue.toFixed(2)}</td>
                          <td>₹{item.cost.toFixed(2)}</td>
                          <td
                            className={
                              item.profit >= 0
                                ? "text-success fw-bold"
                                : "text-danger fw-bold"
                            }
                          >
                            ₹{item.profit.toFixed(2)}
                          </td>
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

export default Profit;
