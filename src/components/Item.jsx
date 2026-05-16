import React, { useEffect, useState } from 'react';
import ToastMessage from './ToastMessage';

const Item = () => {
  const initialForm = {
    itemId: '',
    name: '',
    company: '',
    type: '',
  };

  const [form, setForm] = useState(initialForm);
  const [companies, setCompanies] = useState([]);
  const [types, setTypes] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/hsn/company`)
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (form.company) {
      fetch(
        `${import.meta.env.VITE_API_URL}/hsn/itemType?company=${form.company}`
      )
        .then(res => res.json())
        .then(data => setTypes(data))
        .catch(err => console.error(err));
    } else {
      setTypes([]);
    }
  }, [form.company]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "company") {
      setForm(prev => ({
        ...prev,
        company: value,
        type: ''
      }));
      return;
    }

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/items/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (res.ok) {
        showMessage(
          data.message || "Item added successfully.",
          "success"
        );
        setForm(initialForm);
        setTypes([]);
      } else {
        showMessage(
          data.message || "Failed to add item.",
          "danger"
        );
      }

    } catch (err) {
      console.error(err);
      showMessage(
        "Error occurred while adding item.",
        "danger"
      );
    }
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <h2 className="text-center mb-4">
              Add New Item
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  Item ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="itemId"
                  value={form.itemId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Company
                </label>
                <select
                  className="form-select"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option
                      key={company}
                      value={company}
                    >
                      {company}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Type
                </label>
                <select
                  className="form-select"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  {types.map(type => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ToastMessage
        message={message}
        type={messageType}
        onClose={() => {
          setMessage('');
          setMessageType('');
        }}
      />
    </>
  );
};

export default Item;