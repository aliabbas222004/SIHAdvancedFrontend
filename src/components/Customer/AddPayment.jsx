import React, { useEffect, useState } from "react";
import ToastMessage from "../ToastMessage";

const AddPayment = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] =
        useState(null);

    const [type, setType] = useState("");
    const [mode, setMode] = useState("");

    const [formData, setFormData] = useState({
        date: "",
        amount: "",
        transactionId: "",
        billId: "",
    });

    const [statusMessage, setStatusMessage] =
        useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/customer`
                );

                const data = await res.json();
                setCustomers(data);

            } catch (err) {
                console.error(err);
                setStatusMessage({
                    type: "danger",
                    text: "Failed to load customers"
                });
            }
        };

        fetchCustomers();
    }, []);

    const resetForm = () => {
        setType("");
        setMode("");
        setFormData({
            date: "",
            amount: "",
            transactionId: "",
            billId: "",
        });
    };

    const handleCustomerChange = (e) => {
        const cust = customers.find(
            (c) => c._id === e.target.value
        );

        setSelectedCustomer(cust || null);
        resetForm();
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!selectedCustomer || !type) {
            setStatusMessage({
                type: "danger",
                text: "Select customer and type"
            });
            return;
        }

        let payload = {
            phoneNo: selectedCustomer.phoneNo,
            type,
            date: formData.date,
            amount: Number(formData.amount),
        };

        if (
            type === "paymentReceived" ||
            type === "paymentDone"
        ) {
            payload.mode = mode;
            payload.transactionId =
                mode === "digital"
                    ? formData.transactionId
                    : "";
        }

        if (type === "billReceived") {
            payload.billId = formData.billId;
        }

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/customer/addTransaction`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();

            if (res.ok) {
                setStatusMessage({
                    type: "success",
                    text:
                        data.message ||
                        "Saved successfully"
                });

                setSelectedCustomer(null);
                resetForm();

            } else {
                setStatusMessage({
                    type: "danger",
                    text:
                        data.message ||
                        "Something went wrong"
                });
            }

        } catch (err) {
            console.error(err);

            setStatusMessage({
                type: "danger",
                text: "Server error"
            });
        }
    };

    return (
        <>
            <div className="mt-3 d-flex justify-content-center">
                <div
                    className="w-100"
                    style={{ maxWidth: "500px" }}
                >
                    <h4 className="text-center mb-4">
                        Add Entry
                    </h4>

                    <select
                        className="form-select mb-3"
                        onChange={handleCustomerChange}
                        value={selectedCustomer?._id || ""}
                    >
                        <option value="">
                            -- Select Customer --
                        </option>

                        {customers.map((c) => (
                            <option
                                key={c._id}
                                value={c._id}
                            >
                                {c.name} ({c.phoneNo})
                            </option>
                        ))}
                    </select>

                    {selectedCustomer && (
                        <select
                            className="form-select mb-3"
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                                setMode("");
                            }}
                        >
                            <option value="">
                                -- Select Type --
                            </option>
                            <option value="paymentReceived">
                                Payment Received
                            </option>
                            <option value="paymentDone">
                                Payment Done
                            </option>
                            <option value="billReceived">
                                Bill Received
                            </option>
                        </select>
                    )}

                    {type && (
                        <>
                            <input
                                type="date"
                                className="form-control mb-2"
                                value={formData.date}
                                onChange={(e) =>
                                    handleChange(
                                        "date",
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Amount"
                                value={formData.amount}
                                onChange={(e) =>
                                    handleChange(
                                        "amount",
                                        e.target.value
                                    )
                                }
                            />
                        </>
                    )}

                    {(type === "paymentReceived" ||
                        type === "paymentDone") && (
                            <>
                                <div className="d-flex gap-3 mb-2">
                                    <label>
                                        <input
                                            type="radio"
                                            value="cash"
                                            checked={
                                                mode === "cash"
                                            }
                                            onChange={(e) =>
                                                setMode(
                                                    e.target.value
                                                )
                                            }
                                        />{" "}
                                        Cash
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            value="digital"
                                            checked={
                                                mode ===
                                                "digital"
                                            }
                                            onChange={(e) =>
                                                setMode(
                                                    e.target.value
                                                )
                                            }
                                        />{" "}
                                        Digital
                                    </label>
                                </div>

                                {mode ===
                                    "digital" && (
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Transaction ID (optional)"
                                            value={
                                                formData.transactionId
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    "transactionId",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    )}
                            </>
                        )}

                    {type === "billReceived" && (
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Bill ID"
                            value={formData.billId}
                            onChange={(e) =>
                                handleChange(
                                    "billId",
                                    e.target.value
                                )
                            }
                        />
                    )}

                    {type && (
                        <button
                            className="btn btn-primary w-100 mt-3"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    )}
                </div>
            </div>

            <ToastMessage
                message={statusMessage?.text}
                type={statusMessage?.type}
                onClose={() =>
                    setStatusMessage(null)
                }
            />
        </>
    );
}
export default AddPayment;