// import React, { useState } from 'react';
// import ItemSelector from './components/ItemSelector';
// import SelectedItemsTable from './components/SelectedItemsTable';
// import BillForm from './components/BillForm';

// export default function App() {
//   const [selectedItems, setSelectedItems] = useState([]);

//   // Add item or increase quantity if already selected
//   const addItem = (item) => {
//     setSelectedItems((prev) => {
//       const existing = prev.find((i) => i.itemId === item._id);
//       if (existing) {
//         return prev.map((i) =>
//           i.itemId === item._id
//             ? { ...i, quantity: i.quantity + 1 }
//             : i
//         );
//       } else {
//         return [
//           ...prev,
//           {
//             itemId: item._id,
//             itemName: item.itemName,
//             givenPrice: item.itemPrice,
//             quantity: 1,
//           }
//         ];
//       }
//     });
//   };

//   // Update price or quantity
//   const updateItem = (itemId, field, value) => {
//     setSelectedItems((prev) =>
//       prev.map((item) =>
//         item.itemId === itemId
//           ? {
//               ...item,
//               [field]: field === 'quantity' ? Math.max(1, parseInt(value, 10)) : parseFloat(value)
//             }
//           : item
//       )
//     );
//   };

//   const removeItem = (itemId) => {
//     setSelectedItems((prev) => prev.filter((item) => item.itemId !== itemId));
//   };

//   // Reset after bill generation
//   const resetItems = () => setSelectedItems([]);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">Sunrise Interior Hub - Billing System</h1>

//       <div className="max-w-3xl mx-auto">
//         <ItemSelector onAddItem={addItem} />

//         <div className="my-6">
//           <SelectedItemsTable
//             items={selectedItems}
//             onUpdate={updateItem}    
//             onRemove={removeItem}
//           />
//         </div>

//         <BillForm items={selectedItems} resetItems={resetItems} />
//       </div>
//     </div>
//   );
// }


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrintPreviewPage from './components/PrintPreview';
import HomePage from './components/HomePage';
import Inventory from './Inventory';
import Item from './components/Item';
import HSN from './components/HSN';
import Company from './components/Company';
import ShowInventory from './components/ShowInventory';
import ItemDetails from './components/ItemDetails';
import Customer from './components/Customer';
import Sales from './components/Sales';
import Profit from './components/Profit';
import Transport from './components/Transport';
import ShowTransport from './components/ShowTransport';
import EditCustomer from './components/EditCustomer';
import AddPayment from './components/Customer/AddPayment';
import Ledger from './components/Customer/Ledger';
import MonthReport from './components/Analytics/MonthReport';

export default function App() {
  return (
    // <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/item" element={<Item />} />
        <Route path="/hsn" element={<HSN />} />
        <Route path="/print-preview" element={<PrintPreviewPage />} />
        <Route path="/company" element={<Company />} />
        <Route path='/inventory/show' element={<ShowInventory/>}></Route>
        <Route path='/itemDetails' element={<ItemDetails/>}></Route>
        <Route path='/addCustomer' element={<Customer/>}></Route>
        <Route path='/sales' element={<Sales/>}></Route>
        <Route path='/profit' element={<Profit/>}></Route>
        <Route path='/addTransport' element={<Transport/>}></Route>
        <Route path='/showTransport' element={<ShowTransport/>}></Route>
        <Route path='/editCustomer' element={<EditCustomer/>}></Route>
        <Route path='/addPayment' element={<AddPayment/>}></Route>
        <Route path='/ledger' element={<Ledger/>}></Route>
        <Route path='/monthReport' element={<MonthReport/>}></Route>
        
      </Routes>
    // </Router>
  );
}
