import React, { useState } from 'react';
import ItemSelector from './components/ItemSelector';
import SelectedItemsForInventory from './components/SelectedItemsForInventory';

const Inventory = () => {
  const [selectedItems, setSelectedItems] = useState([]);

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
            quantity: 1,
            purchaseDate: new Date().toISOString().split("T")[0], // default today's date
          }
        ];
      }
    });
  };

  const handleFinalSubmit = async () => {
    try {
      console.log(selectedItems);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/addItemtoInventory`, {
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
              [field]:
                field === 'quantity'
                  ? Math.max(1, parseInt(value, 10))
                  : field === 'purchaseDate'
                  ? value
                  : parseFloat(value),
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
