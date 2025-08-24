// src/components/SelectedItemsTable.jsx
import React from 'react';

export default function SelectedItemsTable({ items, onUpdate, onRemove }) {
  const handleUpdate = (index, field, value) => {
    const item = items[index];
    if (!item) return;

    if (field === 'quantity') {
      const qty = parseInt(value, 10);
      if (isNaN(qty) || qty < 1) return;
      onUpdate(item.itemId, 'quantity', qty);
    } else if (field === 'givenPrice') {
      const price = parseFloat(value);
      if (isNaN(price) || price < 0) return;
      onUpdate(item.itemId, 'givenPrice', price);
    }
  };

  const handleRemove = (index) => {
    const item = items[index];
    if (item) onRemove(item.itemId);
  };

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
              <th>Available Quantity</th>
              <th>Given Price (₹)</th>
              <th>Quantity</th>
              <th>Total (₹)</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ itemName,availableQuantity, givenPrice, quantity }, i) => (
              <tr key={i}>
                <td>{itemName}</td>
                <td>{availableQuantity}</td>
                <td>
                  <input
                    type="number"
                    value={givenPrice}
                    onChange={(e) => handleUpdate(i, 'givenPrice', e.target.value)}
                    className="form-control form-control-sm text-center"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleUpdate(i, 'quantity', e.target.value)}
                    className="form-control form-control-sm text-center"
                  />
                </td>
                <td className="fw-bold">
                  {(givenPrice * quantity).toFixed(2)}
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
        {items.map(({ itemName, givenPrice, quantity }, i) => (
          <div key={i} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{itemName}</h5>
              <div className="mb-2">
                <label className="form-label small">Given Price (₹)</label>
                <input
                  type="number"
                  value={givenPrice}
                  onChange={(e) => handleUpdate(i, 'givenPrice', e.target.value)}
                  className="form-control form-control-sm"
                />
              </div>
              <div className="mb-2">
                <label className="form-label small">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleUpdate(i, 'quantity', e.target.value)}
                  className="form-control form-control-sm"
                />
              </div>
              <p className="fw-bold mb-2">
                Total: ₹{(givenPrice * quantity).toFixed(2)}
              </p>
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
