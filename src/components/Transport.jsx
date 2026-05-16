import React, { useState } from 'react';
import ToastMessage from './ToastMessage';

const Transport = () => {
  const initialForm = {
    val: '',
    date: '',
  };

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/transport/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        showMessage(
          data.message || 'Transport cost added successfully!',
          'success'
        );
        setForm(initialForm);
      } else {
        showMessage(
          data.message || 'Failed to add transport cost.',
          'danger'
        );
      }
    } catch (err) {
      console.error(err);
      showMessage(
        'Error occurred while adding transport.',
        'danger'
      );
    }
  };

  return (
    <>
      <div className="mt-3 d-flex justify-content-center">
        <div
          className="w-100"
          style={{ maxWidth: '500px' }}
        >
          <h4 className="text-center mb-4">
            Add Transport Cost
          </h4>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                Transport Cost (₹)
              </label>
              <input
                type="number"
                className="form-control"
                name="val"
                value={form.val}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Date
              </label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
              <div className="form-text">
                If left empty, current date will be used.
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Add Transport
            </button>
          </form>
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

export default Transport;