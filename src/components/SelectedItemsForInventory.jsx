// src/components/SelectedItemsTable.jsx
import React from "react";

export default function SelectedItemsForInventory({
  items,
  onUpdate,
  onRemove,
}) {
  const handleUpdate = (index, field, value) => {
    const item = items[index];
    if (!item) return;

    const qty = item.quantity || 1;

    if (field === "quantity") {
      const newQty = parseInt(value, 10);
      if (isNaN(newQty) || newQty < 1) return;

      const unitPrice = item.unitPrice ?? item.latestPurchasePrice ?? 0;

      onUpdate(item.itemId, "quantity", newQty);
      onUpdate(item.itemId, "price", newQty * unitPrice);
    }

    else if (field === "unitPrice") {
      const unitPrice = parseFloat(value);
      if (isNaN(unitPrice) || unitPrice < 0) return;

      onUpdate(item.itemId, "unitPrice", unitPrice);
      onUpdate(item.itemId, "price", qty * unitPrice);
    }

    else if (field === "price") {
      const total = parseFloat(value);
      if (isNaN(total) || total < 0) return;

      const newUnitPrice = qty ? total / qty : 0;

      onUpdate(item.itemId, "price", total); // backend field
      onUpdate(item.itemId, "unitPrice", newUnitPrice);
    }

    else if (field === "purchaseDate") {
      onUpdate(item.itemId, "purchaseDate", value);
    }
  };

  const handleRemove = (index) => {
    const item = items[index];
    if (item) onRemove(item.itemId);
  };

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

      {/* Desktop */}
      <div className="d-none d-md-block">
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center align-middle shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Item Name</th>
                <th>Previous Price</th>
                <th>Quantity</th>
                <th>Price / Unit (₹)</th>
                <th>Total Price (₹)</th>
                <th>Purchase Date</th>
                <th>Remove</th>
              </tr>
            </thead>

            <tbody>
              {items.map(
                (
                  {
                    itemId,
                    quantity,
                    price,
                    purchaseDate,
                    latestPurchasePrice,
                    unitPrice,
                  },
                  i
                ) => (
                  <tr key={itemId}>
                    <td>{itemId}</td>

                    <td>
                      ₹ {latestPurchasePrice?.toFixed(2)}
                    </td>

                    <td>
                      <input
                        type="number"
                        min="1"
                        value={quantity || ""}
                        onChange={(e) =>
                          handleUpdate(i, "quantity", e.target.value)
                        }
                        className="form-control form-control-sm text-center"
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={unitPrice ?? latestPurchasePrice ?? ""}
                        onChange={(e) =>
                          handleUpdate(i, "unitPrice", e.target.value)
                        }
                        className="form-control form-control-sm text-center"
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price ?? latestPurchasePrice ?? ""}
                        onChange={(e) =>
                          handleUpdate(i, "price", e.target.value)
                        }
                        className="form-control form-control-sm text-center"
                      />
                    </td>

                    <td>
                      <input
                        type="date"
                        value={purchaseDate || today}
                        onChange={(e) =>
                          handleUpdate(i, "purchaseDate", e.target.value)
                        }
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
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="d-md-none">
        {items.map(
          (
            {
              itemId,
              quantity,
              price,
              purchaseDate,
              latestPurchasePrice,
              unitPrice,
            },
            i
          ) => (
            <div key={itemId} className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5>{itemId}</h5>

                <h6>
                  Previous Price: ₹ {latestPurchasePrice?.toFixed(2)}
                </h6>

                <div className="mb-2">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity || ""}
                    onChange={(e) =>
                      handleUpdate(i, "quantity", e.target.value)
                    }
                    className="form-control"
                  />
                </div>

                <div className="mb-2">
                  <label>Price Per Unit</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={unitPrice ?? latestPurchasePrice ?? ""}
                    onChange={(e) =>
                      handleUpdate(i, "unitPrice", e.target.value)
                    }
                    className="form-control"
                  />
                </div>

                <div className="mb-2">
                  <label>Total Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price || ""}
                    onChange={(e) =>
                      handleUpdate(i, "price", e.target.value)
                    }
                    className="form-control"
                  />
                </div>

                <div className="mb-2">
                  <label>Purchase Date</label>
                  <input
                    type="date"
                    value={
                      purchaseDate
                        ? purchaseDate.split("T")[0]
                        : today
                    }
                    onChange={(e) =>
                      handleUpdate(i, "purchaseDate", e.target.value)
                    }
                    className="form-control"
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
          )
        )}
      </div>
    </div>
  );
}