import React, { useEffect, useState } from "react";

const Ledger = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [ledgerEntries, setLedgerEntries] = useState([]);
    const [totals, setTotals] = useState({ credited: 0, debited: 0, balance: 0 });
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Fetch customers
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/customer`);
                const data = await res.json();
                setCustomers(data);
            } catch (err) {
                console.error("❌ Error fetching customers:", err);
            }
        };
        fetchCustomers();
    }, []);

    const handleCustomerChange = (e) => {
        const custId = e.target.value;
        const customer = customers.find((c) => c._id === custId);
        setSelectedCustomer(customer || null);
        setLedgerEntries([]);
        setTotals({ credited: 0, debited: 0, balance: 0 });
        setIsSubmitted(false);
    };

    const handleSubmit = async () => {
        if (!selectedCustomer) {
            alert("Please select a customer.");
            return;
        }

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/customer/showLedger?phoneNo=${selectedCustomer.phoneNo}`
            );
            const data = await res.json();

            if (res.ok) {
                const { bills, paymentRecord } = data;
                const combined = [];

                // Add bills
                bills.forEach((bill) => {
                    combined.push({
                        type: "Purchase",
                        date: bill.createdAt,
                        amount: bill.totalAmount,
                        description: `Bill ID: ${bill.billId}`,
                    });
                });

                // Add cash payments
                paymentRecord?.cash?.forEach((c) => {
                    combined.push({
                        type: "Payment (Cash)",
                        date: c.date,
                        amount: c.amount,
                        description: "-",
                    });
                });

                // Add gpay payments
                paymentRecord?.gpay?.forEach((g) => {
                    combined.push({
                        type: "Payment (GPay)",
                        date: g.date,
                        amount: g.amount,
                        description: g.transactionId ? `Txn ID: ${g.transactionId}` : "-",
                    });
                });

                // Sort oldest first
                combined.sort((a, b) => new Date(a.date) - new Date(b.date));

                setLedgerEntries(combined);

                // Calculate totals
                const totalDebited = combined
                    .filter((e) => e.type === "Purchase")
                    .reduce((sum, e) => sum + e.amount, 0);

                const totalCredited = combined
                    .filter((e) => e.type.startsWith("Payment"))
                    .reduce((sum, e) => sum + e.amount, 0);

                const balance = totalDebited - totalCredited;

                setTotals({ credited: totalCredited, debited: totalDebited, balance });
                setIsSubmitted(true); // hide the form
            } else {
                console.error("❌ Failed to fetch payments:", data.message);
            }
        } catch (error) {
            console.error("❌ Error fetching payment details:", error);
        }
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return "-";
        const date = new Date(isoDate);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatAmount = (amount) => {
        return amount?.toLocaleString("en-IN") || "0";
    };

    return (
        <div className="container py-5">
            {/* Form */}
            {!isSubmitted && (
                <div className="row justify-content-center mb-4">
                    <div className="col-md-6">
                        <div className="card shadow-sm p-4">
                            <h4 className="mb-4 text-center">Customer Ledger</h4>

                            <div className="mb-3">
                                <label className="form-label">Select Customer</label>
                                <select className="form-select" onChange={handleCustomerChange}>
                                    <option value="">-- Select Customer --</option>
                                    {customers.map((cust) => (
                                        <option key={cust._id} value={cust._id}>
                                            {cust.name} ({cust.phoneNo})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="d-grid mt-3">
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    Show Ledger
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Totals */}
            {ledgerEntries.length > 0 && (
                <div className="row justify-content-center mb-3">
                    <h5 className="text-center mb-3">
                        Ledger for <strong>{selectedCustomer?.name}</strong>
                    </h5>
                    <div className="col-md-10 d-flex justify-content-around flex-wrap">
                        <h6>
                            Total Debited: <strong className="text-danger">₹{formatAmount(totals.debited)}</strong>
                        </h6>
                        <h6>
                            Total Credited: <strong className="text-success">₹{formatAmount(totals.credited)}</strong>
                        </h6>
                        <h6>
                            Balance: <strong className="text-primary">₹{formatAmount(totals.balance)}</strong>
                        </h6>
                    </div>

                </div>
            )}

            {/* Ledger Table */}
            {ledgerEntries.length > 0 && (
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped table-hover">
                                <thead className="table-light text-center">
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Amount (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ledgerEntries.map((entry, index) => (
                                        <tr
                                            key={index}
                                            className={
                                                entry.type.startsWith("Payment") ? "table-success" : "table-warning"
                                            }
                                        >
                                            <td className="text-center">{formatDate(entry.date)}</td>
                                            <td className="text-center">{entry.type}</td>
                                            <td className="text-center">{entry.description}</td>
                                            <td className="text-end">{formatAmount(entry.amount)}</td>
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

export default Ledger;
