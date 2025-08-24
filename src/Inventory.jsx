import React, { useState } from 'react';
import ItemSelector from './components/ItemSelector';
import SelectedItemsTable from './components/SelectedItemsTable';
import SelectedItemsForInventory from './components/SelectedItemsForInventory';

const Inventory = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const [formData, setFormData] = useState({
    itemId: '',
    quantity: '',
    tPrice: '',
  });

  const [foundItem, setFoundItem] = useState(null);
  const [submittedData, setSubmittedData] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = (item) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.itemId === item._id);
      if (existing) {
        return prev.map((i) =>
          i.itemId === item._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        return [
          ...prev,
          {
            itemId: item.itemId,
            totalPrice: item.itemPrice,
            quantity: 1,
          }
        ];
      }
    });
  };

  const handleFinalSubmit = async () => {
    // You can send `submittedData` to your backend here:
    try {
      console.log(selectedItems);
      const res = await fetch('https://sihadvancedbackend.onrender.com/inventory/addItemtoInventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedItems),
      });

      if (res.ok) {
        alert('Inventory submitted successfully!');
        setSelectedItems([]);
      } else {
        alert('Failed to submit inventory');
      }
    } catch (err) {
      alert('Error submitting inventory');
    }
  };

  const updateItem = (itemId, field, value) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId
          ? {
            ...item,
            [field]: field === 'quantity' ? Math.max(1, parseInt(value, 10)) : parseFloat(value)
          }
          : item
      )
    );
  };

  const removeItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((item) => item.itemId !== itemId));
  };

  return (
    <>
      <ItemSelector onAddItem={addItem} />

      <div>
        <SelectedItemsForInventory
          items={selectedItems}
          onUpdate={updateItem}
          onRemove={removeItem}
        />
      </div>
      {selectedItems.length > 0 && (
        <div className="d-flex justify-content-center mt-4">
          <button
            onClick={handleFinalSubmit}
            className="btn btn-success mt-3"
          >
            Submit Inventory
          </button>
        </div>
      )}

    </>
  );
};

export default Inventory;
