// src/components/SelectedItemsTable.jsx
import React from 'react';

export default function SelectedItemsForInventory({ items, onUpdate, onRemove }) {
  const handleUpdate = (index, field, value) => {
    const item = items[index];
    if (!item) return;

    if (field === 'quantity') {
      const qty = parseInt(value, 10);
      if (isNaN(qty) || qty < 1) return;
      onUpdate(item.itemId, 'quantity', qty);
    } else if (field === 'price') {
      const price = parseFloat(value);
      if (isNaN(price) || price < 0) return;
      onUpdate(item.itemId, 'price', price);
    } else if (field === 'purchaseDate') {
      onUpdate(item.itemId, 'purchaseDate', value);
    }
  };

  const handleRemove = (index) => {
    const item = items[index];
    if (item) onRemove(item.itemId);
  };

  // get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  if (items.length === 0) {
    return (
      <p className="text-muted text-center mt-3">
        No items selected yet.
      </p>
    );
  }

  return (
    <div className="container my-4">
      {/* Table view for medium+ screens */}
      <div className="d-none d-md-block">
        <table className="table table-bordered table-hover text-center align-middle shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Item Name</th>
              <th>Purchase Quantity</th>
              <th>Purchase Price (₹)</th>
              <th>Purchase Date</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ itemId, quantity, price, purchaseDate  }, i) => (
              <tr key={i}>
                <td>{itemId}</td>
                <td>
                  <input
                    type="number"
                    value={quantity || ""}
                    onChange={(e) => handleUpdate(i, 'quantity', e.target.value)}
                    className="form-control form-control-sm text-center"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={price || ""}
                    onChange={(e) => handleUpdate(i, 'price', e.target.value)}
                    className="form-control form-control-sm text-center"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={
                      purchaseDate
                        ? typeof purchaseDate === "string"
                          ? purchaseDate.split("T")[0]
                          : new Date(purchaseDate).toISOString().split("T")[0]
                        : today
                    }
                    onChange={(e) => handleUpdate(i, 'purchaseDate', e.target.value)}
                    className="form-control form-control-sm text-center"
                  />

                </td>
                <td>
                  <button
                    onClick={() => handleRemove(i)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for small screens */}
      <div className="d-md-none">
        {items.map(({ itemId, quantity, price, date }, i) => (
          <div key={i} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{itemId}</h5>
              <div className="mb-2">
                <label className="form-label small">Purchase Quantity</label>
                <input
                  type="number"
                  value={quantity || ""}
                  onChange={(e) => handleUpdate(i, 'quantity', e.target.value)}
                  className="form-control form-control-sm"
                />
              </div>
              <div className="mb-2">
                <label className="form-label small">Purchase Price (₹)</label>
                <input
                  type="number"
                  value={price || ""}
                  onChange={(e) => handleUpdate(i, 'price', e.target.value)}
                  className="form-control form-control-sm"
                />
              </div>
              <div className="mb-2">
                <label className="form-label small">Purchase Date</label>
                <input
                  type="date"
                  value={date ? date.split('T')[0] : today}
                  onChange={(e) => handleUpdate(i, 'purchaseDate', e.target.value)}
                  className="form-control form-control-sm"
                />
              </div>
              <button
                onClick={() => handleRemove(i)}
                className="btn btn-sm btn-outline-danger"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
