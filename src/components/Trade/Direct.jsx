import React, { useState } from 'react';

const Direct = () => {
    const [date, setDate] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [rows, setRows] = useState([]);
    const [statusMessage, setStatusMessage] = useState(null);

    // ➕ Add empty row
    const addRow = () => {
        setRows([
            ...rows,
            { name: '', purchasePrice: '', sellingPrice: '', quantity: 1 }
        ]);
    };

    // ✏️ Update row field
    const handleRowChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    // ❌ Delete row
    const deleteRow = (index) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    // ✅ Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage(null);

        const payload = {
            date,
            customerName,
            items: rows,
        };

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/bill/direct`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setStatusMessage({
                    type: 'success',
                    text: data.message || '✅ Bill created successfully',
                });

                setDate('');
                setCustomerName('');
                setRows([]);
            } else {
                setStatusMessage({
                    type: 'danger',
                    text: data.message || '❌ Something went wrong',
                });
            }
        } catch (err) {
            setStatusMessage({
                type: 'danger',
                text: '❌ Server not reachable',
            });
        }
    };

    return (
        <div className="container my-4">
            <div className="card shadow-sm">
                <div className="card-body">

                    {statusMessage && (
                        <div className={`alert alert-${statusMessage.type} text-center`}>
                            {statusMessage.text}
                        </div>
                    )}

                    <h5 className="card-title mb-3">Direct Entry</h5>

                    {/* Date & Customer Name */}
                    <div className="row mb-3">
                        <div className="col-md-6 mb-2">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-control text-center"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6 mb-2">
                            <label className="form-label">Customer Name</label>
                            <input
                                type="text"
                                className="form-control text-center"
                                placeholder="Enter customer name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Add Row Button */}
                    <div className="mb-3">
                        <button className="btn btn-primary" onClick={addRow}>
                            + Add Item
                        </button>
                    </div>

                    {/* Items Table */}
                    {rows.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover align-middle text-center">
                                <thead className="table-light">
                                    <tr>
                                        <th>Name</th>
                                        <th>Purchase Price</th>
                                        <th>Selling Price</th>
                                        <th>Quantity</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control text-center"
                                                    value={row.name}
                                                    onChange={(e) =>
                                                        handleRowChange(index, 'name', e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control text-center"
                                                    value={row.purchasePrice}
                                                    onChange={(e) =>
                                                        handleRowChange(index, 'purchasePrice', e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control text-center"
                                                    value={row.sellingPrice}
                                                    onChange={(e) =>
                                                        handleRowChange(index, 'sellingPrice', e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="form-control text-center"
                                                    value={row.quantity}
                                                    onChange={(e) =>
                                                        handleRowChange(index, 'quantity', e.target.value)
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => deleteRow(index)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="text-end mt-3">
                        <button
                            className="btn btn-success"
                            onClick={handleSubmit}
                            disabled={!date || !customerName || rows.length === 0}
                        >
                            Submit
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Direct;
