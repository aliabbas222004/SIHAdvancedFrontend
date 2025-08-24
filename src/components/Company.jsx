import React, { useState } from 'react';

const Company = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNo: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting company data:', formData);

    try {
      const response = await fetch('http://localhost:5000/company/addCompany', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        alert('Company added successfully');
        setFormData({ name: '', address: '', phoneNo: '' });
      } else {
        alert(result.message || 'Error adding company');
      }
    } catch (err) {
      alert('Server error');
      console.error(err);
    }
  };

  return (
    <div className="mt-3 d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow w-100" style={{ maxWidth: '500px' }}>
        <h3 className="text-center mb-4">Company Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Company Name</label>
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
            <label htmlFor="address" className="form-label">Address</label>
            <textarea
              className="form-control"
              id="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
              placeholder="Enter address"
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="phoneNo" className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              id="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              required
              placeholder="Enter Phone number"
              pattern="[0-9]{10}"
              title="Enter 10 digit Phone number"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Company;
