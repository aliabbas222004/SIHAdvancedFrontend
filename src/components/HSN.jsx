import React, { useState, useEffect } from 'react';
import ToastMessage from './ToastMessage';

const HSN = () => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies, setCompanies] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [hsn, setHsn] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/hsn/company`)
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(err => console.error(err));
  }, []);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleAdd = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/hsn/addHsn`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            company: selectedCompany,
            type: selectedType,
            hsn
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        showMessage(
          data.message || 'HSN entry added successfully.',
          'success'
        );

        setSelectedCompany('');
        setSelectedType('');
        setHsn('');
      } else {
        showMessage(
          data.message || 'Failed to add HSN entry.',
          'danger'
        );
      }
    } catch (err) {
      console.error(err);
      showMessage(
        'Error while adding entry.',
        'danger'
      );
    }
  };

  return (
    <>
      <div className="mt-3 d-flex justify-content-center">
        <div
          className="card shadow p-4 w-100"
          style={{ maxWidth: '500px' }}
        >
          <h4 className="text-center mb-4">
            HSN Entry
          </h4>

          <div className="mb-3">
            <label className="form-label">
              Company
            </label>
            <select
              className="form-select"
              value={selectedCompany}
              onChange={(e) =>
                setSelectedCompany(e.target.value)
              }
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
            <input
              type="text"
              className="form-control"
              placeholder="Enter item type"
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value)
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              HSN
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter HSN code"
              value={hsn}
              onChange={(e) =>
                setHsn(e.target.value)
              }
            />
          </div>

          <button
            className="btn btn-primary w-100"
            onClick={handleAdd}
            disabled={
              !selectedCompany ||
              !selectedType ||
              !hsn
            }
          >
            Add
          </button>
        </div>
      </div>

      <ToastMessage
        message={message}
        type={messageType}
        onClose={() => setMessage('')}
      />
    </>
  );
};

export default HSN;