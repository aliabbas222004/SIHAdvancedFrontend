import React, { useState } from 'react';

const Transport = () => {
  const [form, setForm] = useState({
    val: '',
    date: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/transport/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage('✅ Transport cost added successfully!');
        setForm({ val: '', date: '' });
      } else {
        setMessage('❌ Failed to add transport cost.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error occurred while adding transport.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-3">
      <div className="card shadow p-4 w-100" style={{ maxWidth: '500px' }}>
        <h3 className="text-center mb-4">Add Transport Cost</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Transport Cost (₹)</label>
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
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
            <div className="form-text">If left empty, current date will be used.</div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Add Transport
          </button>

          {message && (
            <div className="alert alert-info text-center mt-3 mb-0">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Transport;
