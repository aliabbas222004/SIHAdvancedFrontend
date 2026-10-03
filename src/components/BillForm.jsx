import React, { useState, useEffect } from 'react';

export default function BillForm({ items, resetItems }) {

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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

  const [paymentMode, setPaymentMode] = useState('');
  const [sameAsBilling, setSameAsBilling] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [freightCharge_packaging, setFreightCharge_Packaging] = useState(0);


  // =====================================================
  // TOTAL
  // =====================================================

  const itemsTotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.finalPrice || 0) *
      Number(item.quantity || 0),
    0
  );

  const totalAmount =
    itemsTotal +
    Number(freightCharge_packaging || 0);


  // =====================================================
  // PAYMENT MODES
  // =====================================================

  const paymentModes = [
    {
      _id: "CASH",
      name: "Cash"
    },
    {
      _id: "DIGITAL",
      name: "UPI / Card / Net Banking"
    }
  ];


  // =====================================================
  // FETCH CUSTOMERS
  // =====================================================

  useEffect(() => {

    const fetchCustomers = async () => {

      try {

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/customer`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch customers");
        }

        const data = await res.json();

        setCustomers(data);

      } catch (err) {

        console.error(
          "❌ Error fetching customers:",
          err
        );

      }
    };

    fetchCustomers();

  }, []);


  // =====================================================
  // SAME AS BILLING
  // =====================================================

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

  }, [
    sameAsBilling,
    custName,
    custPhone,
    billAdd,
    billState,
    custGST
  ]);


  // =====================================================
  // CUSTOMER SELECTION
  // =====================================================

  const handleCustomerChange = (e) => {

    const custId = e.target.value;

    const customer = customers.find(
      c => c._id === custId
    );

    setSelectedCustomer(customer);

    if (customer) {

      setCustName(customer.name || '');
      setCustPhone(customer.phoneNo || '');
      setBillAdd(customer.address || '');
      setBillState(customer.state || '');
      setCustGST(customer.GSTIN || '');

    }

  };


  // =====================================================
  // GENERATE BILL
  // =====================================================

  const generateBill = async () => {

    // ---------------------------------------------
    // Validation
    // ---------------------------------------------

    if (!date) {

      setMessage({
        type: 'error',
        text: 'Please select bill date.'
      });

      return;
    }


    if (!billId) {

      setMessage({
        type: 'error',
        text: 'Please enter bill number.'
      });

      return;
    }


    if (!billAdd || !shipAdd || !custPhone || !paymentMode) {

      setMessage({
        type: 'error',
        text: 'Please fill all required fields.'
      });

      return;
    }


    if (items.length === 0) {

      setMessage({
        type: 'error',
        text: 'No items selected.'
      });

      return;
    }


    // ---------------------------------------------
    // Stock validation
    // ---------------------------------------------

    for (const item of items) {

      if (
        Number(item.availableQuantity || 0) <
        Number(item.quantity || 0)
      ) {

        setMessage({
          type: 'error',
          text: `You don't have enough stock for ${item.itemName}`
        });

        return;
      }

    }


    setLoading(true);
    setMessage(null);


    try {

      // =================================================
      // BILL DATA
      // =================================================

      const billData = {

        billDate: date,

        billId: billId,

        custName: custName,

        phoneno: custPhone,

        custAdd: billAdd,

        custState: billState,

        custGSTIN: custGST || "NA",


        shipcustName: shipcustName,

        shipcustPhone: shipcustPhone,

        shipAdd: shipAdd,

        shipbillState: shipbillState,

        shipcustGST: shipcustGST || "NA",


        tableData: items.map(item => ({

          itemId: item.itemId,

          HSN: item.HSN,

          itemName:
            item.itemName ||
            `Item ${item.itemId}`,

          initialPrice:
            Number(item.initialPrice || 0),

          finalPrice:
            Number(item.finalPrice || 0),

          selectedQuantity:
            Number(item.quantity || 0),

          gstValue:
            Number(item.gstValue || 0)

        })),


        totalQuantity: items.reduce(
          (sum, item) =>
            sum +
            Number(item.quantity || 0),
          0
        ),


        totalPrice: totalAmount,


        paymentMode: paymentMode,


        freightCharge_packaging:
          Number(
            freightCharge_packaging || 0
          )

      };


      console.log(
        "📄 Sending bill:",
        billData
      );


      // =================================================
      // GENERATE PDF FROM BACKEND
      // =================================================

      const billResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bill/addBill`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(billData)
        }
      );


      // ---------------------------------------------
      // Check response
      // ---------------------------------------------

      if (!billResponse.ok) {

        let errorMessage =
          "Failed to generate bill.";

        try {

          const errorData =
            await billResponse.json();

          errorMessage =
            errorData.message ||
            errorMessage;

        } catch {
          // Response wasn't JSON
        }

        throw new Error(
          errorMessage
        );
      }


      // =================================================
      // RECEIVE PDF
      // =================================================

      const pdfBlob =
        await billResponse.blob();


      // Make sure backend actually returned PDF

      if (
        !pdfBlob ||
        pdfBlob.size === 0
      ) {

        throw new Error(
          "Generated PDF is empty."
        );

      }


      // =================================================
      // DOWNLOAD PDF
      // =================================================

      const pdfUrl =
        window.URL.createObjectURL(
          pdfBlob
        );


      const downloadLink =
        document.createElement("a");

      downloadLink.href = pdfUrl;

      downloadLink.download =
        `${billId}.pdf`;

      document.body.appendChild(
        downloadLink
      );

      downloadLink.click();

      document.body.removeChild(
        downloadLink
      );


      // Release memory

      setTimeout(() => {

        window.URL.revokeObjectURL(
          pdfUrl
        );

      }, 1000);


      // =================================================
      // UPDATE INVENTORY
      // =================================================

      try {

        const inventoryResponse =
          await fetch(
            `${import.meta.env.VITE_API_URL}/inventory/update`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body: JSON.stringify({
                items
              })
            }
          );


        if (!inventoryResponse.ok) {

          console.error(
            "⚠️ Inventory update failed."
          );

        }

      } catch (inventoryError) {

        console.error(
          "❌ Inventory update error:",
          inventoryError
        );

      }


      // =================================================
      // SUCCESS
      // =================================================

      setMessage({
        type: 'success',
        text: 'Bill generated and downloaded successfully!'
      });


      // =================================================
      // RESET FORM
      // =================================================

      resetItems();

      setCustName('');
      setCustPhone('');
      setBillAdd('');
      setBillState('');
      setCustGST('');

      setshipCustName('');
      setshipCustPhone('');
      setShipAdd('');
      setshipBillState('');
      setshipCustGST('');

      setPaymentMode('');

      setSameAsBilling(false);

      setFreightCharge_Packaging(0);

      setSelectedCustomer(null);


    } catch (err) {

      console.error(
        "❌ Error while generating bill:",
        err
      );


      setMessage({
        type: 'error',
        text:
          err.message ||
          'Something went wrong while generating the bill.'
      });

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="container mt-4 mb-5 p-4 bg-white rounded shadow">


      {/* ================================================
          DATE & BILL ID
      ================================================= */}

      <div className="row">

        <div className="col-12 col-md-6">

          <div className="mb-3">

            <label className="form-label">
              Date
            </label>

            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />

          </div>

        </div>


        <div className="col-12 col-md-6">

          <div className="mb-3">

            <label className="form-label">
              Bill No
            </label>

            <input
              type="text"
              className="form-control"
              value={billId}
              onChange={(e) =>
                setBillId(e.target.value)
              }
            />

          </div>

        </div>

      </div>


      {/* ================================================
          CUSTOMER SELECTION
      ================================================= */}

      <div className="mb-3">

        <label className="form-label">
          Select Customer
        </label>

        <select
          className="form-select"
          onChange={handleCustomerChange}
        >

          <option value="">
            -- Select Customer --
          </option>

          {customers.map(cust => (

            <option
              key={cust._id}
              value={cust._id}
            >
              {cust.name} ({cust.phoneNo})
            </option>

          ))}

        </select>

      </div>


      {/* ================================================
          BILLING + SHIPPING
      ================================================= */}

      <div className="row">


        {/* BILLING */}

        <div className="col-12 col-md-6">

          <h5>
            Billing Details
          </h5>


          <div className="mb-3">

            <label className="form-label">
              Customer Name
            </label>

            <input
              type="text"
              className="form-control"
              value={custName}
              onChange={(e) =>
                setCustName(e.target.value)
              }
            />

          </div>


          <div className="mb-3">

            <label className="form-label">
              Customer Phone
            </label>

            <input
              type="tel"
              className="form-control"
              value={custPhone}
              onChange={(e) =>
                setCustPhone(e.target.value)
              }
            />

          </div>


          <div className="mb-3">

            <label className="form-label">
              Billing Address
            </label>

            <textarea
              className="form-control"
              rows="3"
              value={billAdd}
              onChange={(e) =>
                setBillAdd(e.target.value)
              }
            />

          </div>


          <div className="mb-3">

            <label className="form-label">
              Customer State
            </label>

            <input
              type="text"
              className="form-control"
              value={billState}
              onChange={(e) =>
                setBillState(e.target.value)
              }
            />

          </div>


          <div className="mb-3">

            <label className="form-label">
              Customer GST Number
            </label>

            <input
              type="text"
              className="form-control"
              value={custGST}
              onChange={(e) =>
                setCustGST(e.target.value)
              }
            />

          </div>


          <div className="form-check mb-3">

            <input
              type="checkbox"
              className="form-check-input"
              checked={sameAsBilling}
              onChange={(e) =>
                setSameAsBilling(
                  e.target.checked
                )
              }
              id="sameAsBilling"
            />

            <label
              className="form-check-label"
              htmlFor="sameAsBilling"
            >
              Shipping address same as billing
            </label>

          </div>

        </div>


        {/* SHIPPING */}

        <div className="col-12 col-md-6">

          <h5>
            Shipping Details
          </h5>


          <div className="mb-3">

            <label className="form-label">
              Shipping Customer Name
            </label>

            <input
              type="text"
              className="form-control"
              value={shipcustName}
              onChange={(e) =>
                setshipCustName(
                  e.target.value
                )
              }
            />

          </div>


          <div className="mb-3">

            <label className="form-label">
              Shipping Customer Phone
            </label>

            <input
              type="tel"
              className="form-control"
              value={shipcustPhone}
              onChange={(e) =>
                setshipCustPhone(
                  e.target.value
                )
              }
            />

          </div>


          <div className="mb-3">

            <label className="form-label">
              Shipping Address
            </label>

            <textarea
              className="form-control"
              rows="3"
              value={shipAdd}
              onChange={(e) =>
                setShipAdd(e.target.value)
              }
            />

          </div>


          <div className="mb-3">

            <label className="form-label">
              Shipping State
            </label>

            <input
              type="text"
              className="form-control"
              value={shipbillState}
              onChange={(e) =>
                setshipBillState(
                  e.target.value
                )
              }
            />

          </div>


          <div className="mb-3">

            <label className="form-label">
              Shipping GST Number
            </label>

            <input
              type="text"
              className="form-control"
              value={shipcustGST}
              onChange={(e) =>
                setshipCustGST(
                  e.target.value
                )
              }
            />

          </div>

        </div>

      </div>


      {/* ================================================
          PAYMENT + FREIGHT
      ================================================= */}

      <div className="row">

        <div className="col-12 col-md-6">

          <div className="mb-3">

            <label className="form-label">
              Select Payment Mode
            </label>

            <select
              className="form-select"
              value={paymentMode}
              onChange={(e) =>
                setPaymentMode(
                  e.target.value
                )
              }
            >

              <option value="">
                -- Select Payment Mode --
              </option>

              {paymentModes.map(mode => (

                <option
                  key={mode._id}
                  value={mode._id}
                >
                  {mode.name}
                </option>

              ))}

            </select>

          </div>

        </div>


        <div className="col-12 col-md-6">

          <div className="mb-3">

            <label className="form-label">
              Freight Charge/ Packaging Charge
            </label>

            <input
              type="number"
              className="form-control"
              value={freightCharge_packaging}
              onChange={(e) =>
                setFreightCharge_Packaging(
                  Number(e.target.value) || 0
                )
              }
            />

          </div>

        </div>

      </div>


      {/* ================================================
          TOTAL
      ================================================= */}

      <div className="text-center mt-4">

        <h4>
          Total Amount: ₹
          {totalAmount.toFixed(2)}
        </h4>

      </div>


      {/* ================================================
          MESSAGE
      ================================================= */}

      {message && (

        <div
          className={`alert mt-3 ${
            message.type === 'error'
              ? 'alert-danger'
              : 'alert-success'
          }`}
        >
          {message.text}
        </div>

      )}


      {/* ================================================
          BUTTON
      ================================================= */}

      <div className="text-center mt-3">

        <button
          onClick={generateBill}
          disabled={loading}
          className="btn btn-primary px-5"
        >

          {loading
            ? 'Generating Bill...'
            : 'Generate Bill'}

        </button>

      </div>

    </div>

  );

}