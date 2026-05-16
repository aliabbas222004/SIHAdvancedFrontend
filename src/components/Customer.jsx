import React, { useState } from "react";
import ToastMessage from "./ToastMessage";

const Customer = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        state: "",
        gst: "",
    });

    const [statusMessage, setStatusMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.name && formData.phone && formData.address && formData.state) {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/customer/addCustomer`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ formData }),
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setStatusMessage({
                        type: "success",
                        text: data.message || "Customer added successfully."
                    });

                    setFormData({
                        name: "",
                        phone: "",
                        address: "",
                        state: "",
                        gst: "",
                    });
                } else {
                    setStatusMessage({
                        type: "danger",
                        text: data.message || "Something went wrong."
                    });
                }
            } catch (err) {
                setStatusMessage({
                    type: "danger",
                    text: "Server not reachable."
                });
            }
        } else {
            setStatusMessage({
                type: "danger",
                text: "Please fill all required fields."
            });
        }
    };

    return (
        <>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <h2 className="text-center mb-4">
                            Add Customer
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Enter name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-control"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <textarea
                                    name="address"
                                    className="form-control"
                                    placeholder="Enter address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    className="form-control"
                                    placeholder="Enter state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    GST (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="gst"
                                    className="form-control"
                                    placeholder="Enter GST (optional)"
                                    value={formData.gst}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="d-grid">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <ToastMessage
                message={statusMessage?.text}
                type={statusMessage?.type}
                onClose={() => setStatusMessage(null)}
            />
        </>
    );
};

export default Customer;