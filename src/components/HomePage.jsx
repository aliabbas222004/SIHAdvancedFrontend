import React, { useState } from 'react';
import ItemSelector from './ItemSelector';
import BillForm from './BillForm';
import SelectedItemsTable from './SelectedItemsTable';

export default function HomePage() {
  const [selectedItems, setSelectedItems] = useState([]);

  // Add item or increase quantity if already selected
  const addItem = (item) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.itemId === item.itemId);
      if (existing) {
        return prev.map((i) =>
          i.itemId === item.itemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        return [
          ...prev,
          {
            itemId: item.itemId,
            HSN: item.HSN,
            itemName: item.itemName,
            initialPrice: 0,
            finalPrice: 0,
            purchasePrice:item.latestPurchasePrice,
            quantity: 1,
            availableQuantity:item.quantityInStock,
          }
        ];
      }
    });
  };


  // Update price or quantity
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

  // Reset after bill generation
  const resetItems = () => setSelectedItems([]);

  return (
    <div className="bg-gray-100 p-6 flex flex-col gap-6 max-w-4xl mx-auto">
      
      {/* Selector on single line */}
      <div>
        <ItemSelector onAddItem={addItem} />
      </div>

      {/* Table below selector */}
      <div>
        <SelectedItemsTable
          items={selectedItems}
          onUpdate={updateItem}
          onRemove={removeItem}
        />
      </div>

      {/* Form below table */}
      <div>
        <BillForm items={selectedItems} resetItems={resetItems} />
      </div>

    </div>
  );
}
