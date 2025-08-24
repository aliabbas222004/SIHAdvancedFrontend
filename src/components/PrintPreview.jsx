// PrintPreviewPage.js
import React from 'react';
import InvoiceTemplate from './InvoiceTemplate';

const sampleBillData = {
  billId: "BILL-12345",
  billDate: new Date().toISOString(),
  custName: "John Doe",
  phoneno: "9876543210",
  custAdd: "123 Street, City, State",
  custState: "Gujarat",
  custGSTIN: "24ABCDE1234F2Z5",
  custPAN: "ABCDE1234F",
  custNameShipping: "John Doe",
  custAddShipping: "123 Street, City, State",
  tableData: [
    { itemId: "ITM001",HSN:"48239019", itemName: "Chair", selectedQuantity: 2, unitPrice: 500 },
    { itemId: "ITM002",HSN:"48239020", itemName: "Table", selectedQuantity: 1, unitPrice: 1500 },
  ],
  totalQuantity: 3,
  totalPrice: 2500,
};

export default function PrintPreviewPage() {
  return (
    <div>
      <InvoiceTemplate {...sampleBillData} />
    </div>
  );
}
