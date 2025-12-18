import React, { useState, useEffect } from 'react';

const ShowHSN = () => {
    const [selectedCompany, setSelectedCompany] = useState('');
    const [companies, setCompanies] = useState([]);
    const [types, setTypes] = useState([]);

    const [selectedType, setSelectedType] = useState('');
    const [hsn, setHsn] = useState('');
    const [message, setMessage] = useState('');


    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/hsn/company`)
            .then(res => res.json())
            .then(data => setCompanies(data))
            .catch(err => console.error(err));
    }, []);


    const handleShow = async () => {
        try {
            fetch(`${import.meta.env.VITE_API_URL}/hsn/getHsn?company=${selectedCompany}&itemType=${selectedType}`)
                .then(res => res.json())
                .then(data => setHsn(data))
                .catch(err => console.error(err));

        } catch (err) {
            console.error(err);
            setMessage('❌ Error while showing hsn.');
        }
    };

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/hsn/itemType?company=${selectedCompany}`)
            .then(res => res.json())
            .then(data => setTypes(data))
            .catch(err => console.error(err));
    }, [selectedCompany]);

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
                    <label className="form-label">Type</label>
                    <select
                        className="form-select"
                        name="type"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        {types.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="mb-3">
                    <label htmlFor="hsn" className="form-label">HSN</label>
                    <input
                        type="text"
                        className="form-control"
                        id="hsn"
                        placeholder="Enter HSN code"
                        value={hsn}
                        readOnly
                    />
                </div>

                <button
                    className="btn btn-primary w-100"
                    onClick={handleShow}
                    disabled={!selectedCompany || !selectedType}
                >
                    Show
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

export default ShowHSN;
