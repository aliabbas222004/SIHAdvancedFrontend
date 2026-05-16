import React, { useState, useEffect } from "react";
import ToastMessage from "./ToastMessage";

const EditCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    state: "",
    gst: "",
  });
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/customer`
        );

        if (!res.ok)
          throw new Error(
            "Failed to fetch customers"
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
  }, [statusMessage]);

  useEffect(() => {
    if (!selectedId) return;

    const customer = customers.find(
      (c) => c._id === selectedId
    );

    if (customer) {
      setFormData({
        name: customer.name || "",
        phone: customer.phoneNo || "",
        address: customer.address || "",
        state: customer.state || "",
        gst: customer.GSTIN || "",
      });

      setStatusMessage(null);
    }
  }, [selectedId, customers]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedId) {
      setStatusMessage({
        type: "danger",
        text: "Please select a customer first"
      });
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/customer/update/${selectedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            name: formData.name,
            phoneNo: formData.phone,
            address: formData.address,
            state: formData.state,
            GSTIN: formData.gst,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({
          type: "success",
          text:
            data.message ||
            "Customer updated successfully."
        });

        setSelectedId("");

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
          text:
            data.message ||
            "Failed to update customer"
        });
      }

    } catch (err) {
      console.error(err);

      setStatusMessage({
        type: "danger",
        text: "Server not reachable"
      });
    }
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <h2 className="text-center mb-4">
              Edit Customer
            </h2>

            <div className="mb-3">
              <label className="form-label">
                Select Customer
              </label>

              <select
                className="form-select"
                value={selectedId}
                onChange={(e) =>
                  setSelectedId(
                    e.target.value
                  )
                }
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
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Address
                </label>
                <textarea
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  className="form-control"
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
                  value={formData.gst}
                  onChange={handleChange}
                />
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Update Customer
                </button>
              </div>
            </form>
          </div>
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
};

export default EditCustomer;