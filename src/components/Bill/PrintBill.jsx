import React, { useState, useRef } from "react";
import InvoiceTemplate from "../InvoiceTemplate";

const PrintBill = () => {
    const [billId, setBillId] = useState("");
    const [billData, setBillData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const invoiceRef = useRef();

    const printInvoice = () => {
        const container = document.createElement("div");
        container.id = "print-wrapper";

        // Original
        const originalDiv = document.createElement("div");
        originalDiv.innerHTML =
            '<div style="text-align:right;font-size:10px;">Original for Buyer</div>';

        const originalInvoice = document.createElement("div");
        originalInvoice.innerHTML =
            document.getElementById("original-invoice")?.innerHTML || "";

        originalDiv.appendChild(originalInvoice);
        container.appendChild(originalDiv);

        // Duplicate
        const duplicateDiv = document.createElement("div");
        duplicateDiv.innerHTML =
            '<div style="text-align:right;font-size:10px;page-break-before: always;">Duplicate for Supplier</div>';

        const duplicateInvoice = document.createElement("div");
        duplicateInvoice.innerHTML =
            document.getElementById("original-invoice")?.innerHTML || "";

        duplicateDiv.appendChild(duplicateInvoice);
        container.appendChild(duplicateDiv);

        document.body.appendChild(container);

        const style = document.createElement("style");
        style.textContent = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        #print-wrapper,
        #print-wrapper * {
          visibility: visible !important;
        }
        #print-wrapper {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;

        document.head.appendChild(style);

        setTimeout(() => {
            window.print();

            window.onafterprint = () => {
                document.body.removeChild(container);
                document.head.removeChild(style);
            };
        }, 500);
    };

    const handleFetchBill = async () => {
        if (!billId) {
            setMessage("Please enter Bill ID");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/bill/getBill/${billId}`
            );

            if (!res.ok) {
                throw new Error("Bill not found");
            }

            const data = await res.json();

            // transform backend data -> InvoiceTemplate format
            const formattedBill = {
                billId: data.billId,
                billDate: data.createdAt,

                custName: data.customerName,
                phoneno: data.customerPhone,
                custAdd: data.billAddress,
                custState: data.customerState,
                custGSTIN: data.customerGST,

                shipcustName: data.shipCustName,
                shipcustPhone: data.shipCustPhone,
                shipAdd: data.shippingAddress,
                shipbillState: data.shipCustState,
                shipcustGST: data.shipCustGST,

                tableData: data.items.map((item) => ({
                    itemId: item.itemId,
                    HSN: item.HSN || "N/A",
                    itemName: item.itemName || item.itemId,
                    initialPrice: item.initialPrice,
                    finalPrice: item.finalPrice,
                    selectedQuantity: item.quantity
                })),

                totalQuantity: data.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                ),

                totalPrice: data.totalAmount,
                paymentMode: data.paymentMode,
                freightCharge_packaging: data.freightCharge_packaging
            };

            setBillData(formattedBill);

            setTimeout(() => {
                printInvoice();
            }, 300);

        } catch (err) {
            setMessage(err.message);
            setBillData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 p-4 bg-white shadow rounded">
            <h3 className="mb-4">Print Existing Bill</h3>

            <div className="mb-3">
                <label className="form-label">Enter Bill ID</label>
                <input
                    type="text"
                    className="form-control"
                    value={billId}
                    onChange={(e) => setBillId(e.target.value)}
                    placeholder="Enter bill number"
                />
            </div>

            <button
                className="btn btn-primary"
                onClick={handleFetchBill}
                disabled={loading}
            >
                {loading ? "Fetching..." : "Fetch & Print"}
            </button>

            {message && (
                <div className="alert alert-danger mt-3">
                    {message}
                </div>
            )}

            {billData && (
                <div style={{ display: "none", width: "800px" }}>
                    <div ref={invoiceRef} id="original-invoice">
                        <InvoiceTemplate {...billData} />
                    </div>
                </div>
            )}

        </div>
    );
};

export default PrintBill;