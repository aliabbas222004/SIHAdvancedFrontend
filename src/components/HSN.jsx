import React, { useState,useEffect } from 'react';

const HSN = () => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies,setCompanies]=useState([]);
  
  const [selectedType, setSelectedType] = useState('');
  const [hsn, setHsn] = useState('');
  const [message, setMessage] = useState('');


  useEffect(() => {
      fetch(`${import.meta.env.VITE_API_URL}/hsn/company`)
        .then(res => res.json())
        .then(data => setCompanies(data))
        .catch(err => console.error(err));

    }, []);


  const handleAdd = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/hsn/addHsn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: selectedCompany,
          type: selectedType,
          hsn: hsn,
        }),
      });

      if (res.ok) {
        setMessage('✅ HSN entry added successfully!');
        setSelectedCompany('');
        setSelectedType('');
        setHsn('');
      } else {
        const data=await res.json();
        setMessage(data.message);
        setSelectedType('');
        setHsn('');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error while adding entry.');
    }
  };

  return (
    <div className="mt-3 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '500px' }}>
        <h3 className="text-center mb-4">HSN Entry</h3>

        <div className="mb-3">
            <label className="form-label">Company</label>
            <select
              className="form-select"
              name="company"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
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
          <label htmlFor="type" className="form-label">Type</label>
          <input
            type="text"
            className="form-control"
            id="type"
            placeholder="Enter item type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="hsn" className="form-label">HSN</label>
          <input
            type="text"
            className="form-control"
            id="hsn"
            placeholder="Enter HSN code"
            value={hsn}
            onChange={(e) => setHsn(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleAdd}
          disabled={!selectedCompany || !selectedType || !hsn}
        >
          Add
        </button>

        {message && (
          <div className="alert alert-info mt-3 text-center py-2">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default HSN;
