import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShowInventory = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/getEntireInventory`);
        if (!res.ok) throw new Error('Failed to fetch all items');
        const data = await res.json();
        setResults(data);
      } catch (e) {
        console.error('Fetching all items failed', e);
        setResults([]);
      }
      setLoading(false);
    };

    fetchAllItems();
  }, []);

  const searchItems = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/items/search?q=${query}`
      );
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      console.log(data);
      setResults(data);
    } catch (e) {
      console.error('Search failed', e);
      setResults([]);
    }
    setLoading(false);
  };

  const handleViewMore = (index) => {
    const item = results[index];
    navigate('/itemDetails', { state: { item } });
  };

  return (
    <>
      {/* 🔎 Search box */}
      <div className="d-flex justify-content-center mt-3">
        <div className="mb-4 w-100" style={{ maxWidth: '500px' }}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Search Item by ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-control"
              onKeyDown={(e) => e.key === 'Enter' && searchItems()}
            />
            <button
              onClick={searchItems}
              disabled={!query.trim() || loading}
              className="btn btn-primary"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* 📦 Inventory Results */}
      {results.length > 0 && (
        <div className="container my-4">
          {/* Table view for medium+ screens */}
          <div className="d-none d-md-block">
            <table className="table table-bordered table-hover text-center align-middle shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>Item Id</th>
                  <th>Item Name</th>
                  <th>Available Quantity</th>
                  <th>View More</th>
                </tr>
              </thead>
              <tbody>
                {results.map(
                  ({ itemId, itemName, quantityInStock }, i) => (
                    <tr key={i}>
                      <td>{itemId}</td>
                      <td>{itemName}</td>
                      <td>{quantityInStock}</td>
                      <td>
                        <button
                          onClick={() => handleViewMore(i)}
                          className="btn btn-sm btn-outline-success"
                        >
                          View More
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Card view for small screens */}
          <div className="d-md-none">
            {results.map(
              ({ itemId, itemName, quantityInStock }, i) => (
                <div key={i} className="card mb-3 shadow-sm">
                  <div className="card-body p-3">
                    <h5 className="card-title text-center">
                      {itemName} ({itemId})
                    </h5>
                    <div className="mb-2">
                      <label className="form-label">
                        Available quantity : &nbsp;
                      </label>
                      {quantityInStock}
                    </div>
                    <div className="text-center">
                      <button
                        onClick={() => handleViewMore(i)}
                        className="btn btn-sm btn-outline-success"
                      >
                        View More
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ShowInventory;
