// src/components/ItemSelector.jsx
import React, { useState } from 'react';

export default function ItemSelector({ onAddItem }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchItems = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/items/search?q=${query}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data);
      console.log(data);
    } catch (e) {
      console.error('Search failed', e);
      setResults([]);
    }
    setLoading(false);
  };

  return (
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
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {results.length > 0 && (
          <ul className="list-group mt-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {results.map((item) => (
              <li
                key={item._id}
                className="list-group-item list-group-item-action"
                onClick={() => {
                  onAddItem(item);
                  setResults([]);
                  setQuery('');
                }}
                style={{ cursor: 'pointer' }}
              >
                {item.itemName} — ₹{item.itemPrice} (ID: {item.itemId})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
