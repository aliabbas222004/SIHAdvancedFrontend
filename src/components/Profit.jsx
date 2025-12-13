import React, { useState } from "react";

const Profit = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [profit, setProfit] = useState(null);        // inventory items
  const [directItems, setDirectItems] = useState(null);
  const [tCost, setTCost] = useState(0);

  const handleSubmit = async () => {
    if (!month || !year) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/analytics/monthly-profit?month=${month}&year=${year}`
      );
      const data = await res.json();

      setProfit(data.itemWiseProfit || []);
      setDirectItems(data.directItems || []);

      const transportationCost = await fetch(
        `${import.meta.env.VITE_API_URL}/transport/monthly-transport?month=${month}&year=${year}`
      );
      const cost = await transportationCost.json();
      setTCost(cost.totalTransportCost || 0);

    } catch (err) {
      console.error("Error fetching profit:", err);
    }
  };

  const inventoryProfitTotal =
    profit?.reduce((acc, item) => acc + item.profit, 0) || 0;

  const directProfitTotal =
    directItems?.reduce((acc, item) => acc + item.profit, 0) || 0;

  const netProfit =
    inventoryProfitTotal + directProfitTotal - tCost;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">💰 Profit Report</h2>

      {/* Filters */}
      <div className="d-flex justify-content-center">
        <div className="col-md-6">
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <label className="form-label">Month</label>
              <select
                className="form-select"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">-- Choose Month --</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-2">
              <label className="form-label">Year</label>
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
              />
            </div>
          </div>

          <div className="text-center">
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

      {/* ================= SUMMARY ================= */}
      {(profit || directItems) && (
        <div className="card shadow-sm mt-5">
          <div className="card-body">
            <h5>📊 Overall Summary</h5>
            <p><strong>Inventory Profit:</strong> ₹{inventoryProfitTotal.toFixed(2)}</p>
            <p><strong>Direct Profit:</strong> ₹{directProfitTotal.toFixed(2)}</p>
            <p><strong>Transportation Cost:</strong> ₹{tCost.toFixed(2)}</p>
            <hr />
            <h5 className="text-success">
              Net Profit: ₹{netProfit.toFixed(2)}
            </h5>
          </div>
        </div>
      )}

      {/* ================= INVENTORY ITEMS ================= */}
      {profit?.length > 0 && (
        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h5>📦 Inventory Item-wise Profit</h5>

            <div className="table-responsive">
              <table className="table table-bordered text-center">
                <thead className="table-light">
                  <tr>
                    <th>Item ID</th>
                    <th>Quantity</th>
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
                      <td className={item.profit >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                        ₹{item.profit.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= DIRECT ITEMS ================= */}
      {directItems?.length > 0 && (
        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h5>🧾 Direct Item-wise Profit</h5>

            <div className="table-responsive">
              <table className="table table-bordered text-center">
                <thead className="table-light">
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Total Purchase</th>
                    <th>Total Selling</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {directItems.map((item, i) => (
                    <tr key={i}>
                      <td>{item.itemName}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.totalPurchase.toFixed(2)}</td>
                      <td>₹{item.totalSelling.toFixed(2)}</td>
                      <td className={item.profit >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                        ₹{item.profit.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profit;
