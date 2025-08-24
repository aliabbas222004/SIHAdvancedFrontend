import React, { useEffect, useState } from 'react';

const Item = () => {
  const [form, setForm] = useState({
    
    itemId: '',
    name: '',
    company:'',
    type: '',
    price: ''
  });

  const [companies,setCompanies]=useState([]);
  const [types, setTypes] = useState([]);
  const [hsnOptions, setHsnOptions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('https://sihadvancedbackend.onrender.com/hsn/company')
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (form.company) {
      fetch(`https://sihadvancedbackend.onrender.com/hsn/itemType?company=${form.company}`)
        .then(res => res.json())
        .then(data => setTypes(data))
        .catch(err => console.error(err));
      
    } else {
      setHsnOptions([]);
    }
  }, [form.company]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('https://sihadvancedbackend.onrender.com/api/items/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setMessage('✅ Item added successfully!');
        setForm({ itemId: '', name: '', type: '', hsn: '', price: '' });
      } else {
        setMessage('❌ Failed to add item.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error occurred while adding item.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-3">
      <div className="card shadow p-4 w-100" style={{ maxWidth: '500px' }}>
        <h3 className="text-center mb-4">Add New Item</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Item ID</label>
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
            <label className="form-label">Name</label>
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
            <label className="form-label">Company</label>
            <select
              className="form-select"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="">Select type</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Add Item
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

export default Item;
