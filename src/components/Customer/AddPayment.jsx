import React, { useEffect, useState } from "react";

const AddPayment = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentDetails, setPaymentDetails] = useState({
        date: "",
        amount: "",
        transactionId: "",
    });

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
        setPaymentMethod("");
        setPaymentDetails({ date: "", amount: "", transactionId: "" });
    };

    const handlePaymentChange = (field, value) => {
        setPaymentDetails((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!selectedCustomer || !paymentMethod) {
            alert("Please select customer and payment method.");
            return;
        }

        const payload = {
            phoneNo: selectedCustomer.phoneNo,
            mode: paymentMethod,
            amount: Number(paymentDetails.amount),
            date: paymentDetails.date,
            transactionId: paymentMethod === "gpay" ? paymentDetails.transactionId : "",
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/customer/addPayment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                alert("✅ Payment added successfully!");
                setPaymentDetails({ date: "", amount: "", transactionId: "" });
                setPaymentMethod("");
                setSelectedCustomer(null);
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error("❌ Error submitting payment:", error);
            alert("Error submitting payment");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm p-4">
                        <h4 className="mb-4 text-center">Add Payment</h4>

                        {/* Customer Select */}
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

                        {/* Payment Method */}
                        {selectedCustomer && (
                            <div className="mt-4">
                                <h5 className="mb-3 text-center">Payment Method</h5>

                                <div className="d-flex justify-content-center gap-4 mb-3">
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id="cash"
                                            name="paymentMethod"
                                            value="cash"
                                            checked={paymentMethod === "cash"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="cash">
                                            Cash
                                        </label>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id="gpay"
                                            name="paymentMethod"
                                            value="gpay"
                                            checked={paymentMethod === "gpay"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="gpay">
                                            GPay
                                        </label>
                                    </div>
                                </div>

                                {/* Payment Details Form */}
                                {paymentMethod && (
                                    <div className="border p-3 rounded shadow-sm mb-3">
                                        <h6 className="mb-3">{paymentMethod.toUpperCase()} Payment Details</h6>

                                        <div className="mb-2">
                                            <label className="form-label">Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={paymentDetails.date}
                                                onChange={(e) => handlePaymentChange("date", e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-2">
                                            <label className="form-label">Amount</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={paymentDetails.amount}
                                                onChange={(e) => handlePaymentChange("amount", e.target.value)}
                                            />
                                        </div>

                                        {paymentMethod === "gpay" && (
                                            <div className="mb-2">
                                                <label className="form-label">Transaction ID (optional)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Transaction ID"
                                                    value={paymentDetails.transactionId}
                                                    onChange={(e) => handlePaymentChange("transactionId", e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Submit Button */}
                                {paymentMethod && (
                                    <div className="d-grid">
                                        <button className="btn btn-primary" onClick={handleSubmit}>
                                            Submit Payment
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPayment;
