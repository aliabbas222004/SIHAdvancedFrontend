import React, { useState } from 'react';
import ToastMessage from './ToastMessage';

const Company = () => {
  const initialForm = {
    name: '',
    address: '',
    phoneNo: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/company/addCompany`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      const result = await response.json();

      if (response.ok) {
        showMessage(
          result.message || 'Company added successfully.',
          'success'
        );
        setFormData(initialForm);
      } else {
        showMessage(
          result.message || 'Error adding company.',
          'danger'
        );
      }

    } catch (err) {
      console.error(err);
      showMessage(
        'Server error.',
        'danger'
      );
    }
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <h2 className="text-center mb-4">
              Company Details
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label
                  htmlFor="name"
                  className="form-label"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter company name"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="address"
                  className="form-label"
                >
                  Address
                </label>
                <textarea
                  className="form-control"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                  placeholder="Enter address"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="phoneNo"
                  className="form-label"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                  pattern="[0-9]{10}"
                  title="Enter 10 digit phone number"
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

export default Company;