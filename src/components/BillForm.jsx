import React, { useState, useEffect, useRef } from 'react';
import InvoiceTemplate from './InvoiceTemplate';

export default function BillForm({ items, resetItems }) {
  const [date, setDate] = useState('');
  const [billId, setBillId] = useState('');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [billAdd, setBillAdd] = useState('');
  const [billState, setBillState] = useState('');
  const [custGST, setCustGST] = useState('');
  const [shipcustName, setshipCustName] = useState('');
  const [shipcustPhone, setshipCustPhone] = useState('');
  const [shipAdd, setShipAdd] = useState('');
  const [shipbillState, setshipBillState] = useState('');
  const [shipcustGST, setshipCustGST] = useState('');
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [generatedBillData, setGeneratedBillData] = useState(null);
  const invoiceRef = useRef();

  const totalAmount = items.reduce((sum, item) => sum + item.givenPrice * item.quantity, 0);

  useEffect(() => {
    if (sameAsBilling) {
      setshipCustName(custName);
      setshipCustPhone(custPhone);
      setShipAdd(billAdd);
      setshipBillState(billState);
      setshipCustGST(custGST);
    } else {
      setshipCustName('');
      setshipCustPhone('');
      setShipAdd('');
      setshipBillState('');
      setshipCustGST('');
    }
  }, [sameAsBilling, custName, custPhone, billAdd, billState, custGST]);


  useEffect(() => {
    if (generatedBillData && invoiceRef.current) {
      const timer = setTimeout(() => {
        printInvoice();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [generatedBillData]);

  const printInvoice = () => {
    const container = document.createElement('div');
    container.id = 'print-wrapper';

    const originalDiv = document.createElement('div');
    originalDiv.innerHTML = `<div style="text-align:right;font-size:10px;">Original for Buyer</div>`;
    const originalInvoice = document.createElement('div');
    originalInvoice.innerHTML = document.getElementById('original-invoice')?.innerHTML || '';
    originalDiv.appendChild(originalInvoice);
    container.appendChild(originalDiv);

    const duplicateLabel = document.createElement('div');
    duplicateLabel.innerHTML = `<div style="text-align:right;font-size:10px;page-break-before: always;">Duplicate for Supplier</div>`;
    const duplicateInvoice = document.createElement('div');
    duplicateInvoice.innerHTML = document.getElementById('original-invoice')?.innerHTML || '';
    duplicateLabel.appendChild(duplicateInvoice);
    container.appendChild(duplicateLabel);

    document.body.appendChild(container);
    window.print();
    document.body.removeChild(container);
  };


  const generateBill = async () => {
    if (!billAdd || !shipAdd || !custPhone) {
      setMessage({ type: 'error', text: 'Please fill all required fields.' });
      return;
    }
    if (items.length === 0) {
      setMessage({ type: 'error', text: 'No items selected.' });
      return;
    }
    for (const item of items) {
      console.log("Hello", item);
      if (item.availableQuantity < item.quantity) {
        setMessage({ type: 'error', text: `You don't have enough stock for ${item.itemName}` });
        return; // ✅ this now exits the enclosing function
      }
    }


    const mockResponse = {
      billDate: date,
      billId,
      custName,
      phoneno: custPhone,
      custAdd: billAdd,
      custState: billState,
      custGSTIN: custGST || "NA",
      shipcustName,
      shipcustPhone,
      shipAdd,
      shipbillState,
      shipcustGST: shipcustGST || "NA",
      tableData: items.map(item => ({
        itemId: item.itemId,
        HSN: item.HSN,
        itemName: item.itemName || `Item ${item.itemId}`,
        selectedQuantity: item.quantity,
        unitPrice: item.givenPrice
      })),
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: totalAmount
    };
    setGeneratedBillData(mockResponse);
    setMessage({ type: 'success', text: 'Bill generated successfully!' });

    resetItems();
    setCustName('');
    setCustPhone('');
    setBillAdd('');
    setBillState('');
    setCustGST('');
    setSameAsBilling(false);


    const response = await fetch('http://localhost:5000/inventory/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items
      }),
    });


  };

  return (
    <div className="container mt-4 mb-5 p-4 bg-white rounded shadow">
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="mb-3">
            <label className="form-label">Bill No</label>
            <input type="text" className="form-control" value={billId} onChange={(e) => setBillId(e.target.value)} />
          </div>
        </div>
      </div>


      <div className="row">
        {/* Billing Details */}
        <div className="col-12 col-md-6">
          <h5>Billing Details</h5>

          <div className="mb-3">
            <label className="form-label">Customer Name</label>
            <input type="text" className="form-control" value={custName} onChange={(e) => setCustName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Customer Phone</label>
            <input type="tel" className="form-control" value={custPhone} onChange={(e) => setCustPhone(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Billing Address</label>
            <textarea className="form-control" rows="3" value={billAdd} onChange={(e) => setBillAdd(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Customer State</label>
            <input type="text" className="form-control" value={billState} onChange={(e) => setBillState(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Customer GST Number</label>
            <input type="text" className="form-control" value={custGST} onChange={(e) => setCustGST(e.target.value)} />
          </div>
          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" checked={sameAsBilling} onChange={(e) => setSameAsBilling(e.target.checked)} id="sameAsBilling" />
            <label className="form-check-label" htmlFor="sameAsBilling">
              Shipping address same as billing
            </label>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="col-12 col-md-6">
          <h5>Shipping Details</h5>
          <div className="mb-3">
            <label className="form-label">Shipping Customer Name</label>
            <input type="text" className="form-control" value={shipcustName} onChange={(e) => setshipCustName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Shipping Customer Phone</label>
            <input type="tel" className="form-control" value={shipcustPhone} onChange={(e) => setshipCustPhone(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Shipping Address</label>
            <textarea className="form-control" rows="3" value={shipAdd} onChange={(e) => setShipAdd(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Shipping State</label>
            <input type="text" className="form-control" value={shipbillState} onChange={(e) => setshipBillState(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Shipping GST Number</label>
            <input type="text" className="form-control" value={shipcustGST} onChange={(e) => setshipCustGST(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="text-center mt-4">
        <h4>Total Amount: ₹{totalAmount.toFixed(2)}</h4>
      </div>

      {/* Message */}
      {message && (
        <div className={`alert mt-3 ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      {/* Button */}
      <div className="text-center mt-3">
        <button
          onClick={generateBill}
          disabled={loading}
          className="btn btn-primary px-5"
        >
          {loading ? 'Generating Bill...' : 'Generate Bill'}
        </button>
      </div>

      {/* Hidden Template */}
      {generatedBillData && (
        <div style={{ display: 'none' }}>
          <div ref={invoiceRef} id="original-invoice">
            <InvoiceTemplate {...generatedBillData} />
          </div>
        </div>
      )}
    </div>
  );
}
