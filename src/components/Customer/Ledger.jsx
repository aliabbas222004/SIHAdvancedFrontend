import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Ledger.css";

const Ledger = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [ledgerEntries, setLedgerEntries] = useState([]);
    const [totals, setTotals] = useState({ credit: 0, debit: 0 });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const printRef = useRef();

    useEffect(() => {
        const fetchCustomers = async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/customer`);
            const data = await res.json();
            setCustomers(data);
        };
        fetchCustomers();
    }, []);

    const handleCustomerChange = (e) => {
        const cust = customers.find(c => c._id === e.target.value);
        setSelectedCustomer(cust || null);
        setLedgerEntries([]);
        setTotals({ credit: 0, debit: 0 });
        setIsSubmitted(false);
    };

    const handleSubmit = async () => {
        if (!selectedCustomer) return alert("Select customer");

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/customer/showLedger?phoneNo=${selectedCustomer.phoneNo}`
            );
            const data = await res.json();

            if (!res.ok) return;

            const { bills, paymentRecord } = data;

            let combined = [];

            // Bills → DEBIT
            bills.forEach(b => {
                combined.push({
                    date: b.createdAt,
                    type: "Sales",
                    description: `Bill ID: ${b.billId}`,
                    debit: b.totalAmount,
                    credit: 0,
                });
            });

            // Payment Received
            paymentRecord?.cash?.forEach(c => {
                combined.push({
                    date: c.date,
                    type: "Cash Receipt",
                    description: "-",
                    debit: 0,
                    credit: c.amount,
                });
            });

            paymentRecord?.gpay?.forEach(g => {
                combined.push({
                    date: g.date,
                    type: "Digital Receipt",
                    description: g.transactionId || "-",
                    debit: 0,
                    credit: g.amount,
                });
            });

            // Payment Done
            paymentRecord?.cashGiven?.forEach(c => {
                combined.push({
                    date: c.date,
                    type: "Cash Payment",
                    description: "-",
                    debit: c.amount,
                    credit: 0,
                });
            });

            paymentRecord?.gpayGiven?.forEach(g => {
                combined.push({
                    date: g.date,
                    type: "Digital Payment",
                    description: g.transactionId || "-",
                    debit: g.amount,
                    credit: 0,
                });
            });

            // Bills Received → CREDIT
            paymentRecord?.billsReceived?.forEach(b => {
                combined.push({
                    date: b.date,
                    type: "Purchase",
                    description: `Bill ID: ${b.billId}`,
                    debit: 0,
                    credit: b.amount,
                });
            });

            // Sort by date
            combined.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Totals
            const totalCredit = combined.reduce((sum, e) => sum + e.credit, 0);
            const totalDebit = combined.reduce((sum, e) => sum + e.debit, 0);

            setLedgerEntries(combined);
            setTotals({
                credit: totalCredit,
                debit: totalDebit,
            });

            setIsSubmitted(true);

        } catch (err) {
            console.error(err);
        }
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    const formatAmount = (a) => a?.toLocaleString("en-IN") || "0";

    // Outstanding Calculation
    const outstandingAmount = Math.abs(totals.debit - totals.credit);
    const outstandingType =
        totals.debit > totals.credit ? "Debit" : "Credit";

    const handleDownloadPDF = async () => {
        const canvas = await html2canvas(printRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, width - 20, height);
        pdf.save(`Ledger_${selectedCustomer?.name}.pdf`);
    };

    return (
        <div className="container py-5">

            {!isSubmitted && (
                <div className="col-md-6 mx-auto card p-4 shadow-sm">
                    <h4 className="text-center mb-3">Customer Ledger</h4>

                    <select className="form-select mb-3" onChange={handleCustomerChange}>
                        <option value="">-- Select Customer --</option>
                        {customers.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.name} ({c.phoneNo})
                            </option>
                        ))}
                    </select>

                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Show Ledger
                    </button>
                </div>
            )}

            {ledgerEntries.length > 0 && (
                <>
                    

                    <div ref={printRef}>
                        <div style={{ textAlign: "center", marginBottom: "10px" }}>
                            <img
                                src="transparentlogo1.png"
                                alt="Company Logo"
                                style={{ width: "70px", height: "auto" }}
                            />

                            <img src="transparentlogo2.png" alt="Company logo" style={{ width: "170px", height: "auto" }}/>
                            <h6 style={{ marginTop: "5px" }}>
                                E-39, Road No.2, Sardar Estate, Ajwa Road, Vadodara, Gujarat <br />
                                +91-9408758155
                            </h6>
                            <br />
                            <h5 style={{ marginTop: "10px" }}>
                                Account statement for <strong>{selectedCustomer?.name}</strong>
                            </h5>
                        </div>
                        <br />
                        <div className="d-flex justify-content-around mb-3">
                            <strong>Debit: ₹{formatAmount(totals.debit)}</strong>
                            <strong>Credit: ₹{formatAmount(totals.credit)}</strong>
                        </div>

                        <table className="table table-bordered">
                            <thead>
                                <tr className="text-center">
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Description</th>
                                    <th>Debit</th>
                                    <th>Credit</th>
                                </tr>
                            </thead>

                            <tbody>
                                {ledgerEntries.map((e, i) => (
                                    <tr key={i}>
                                        <td>{formatDate(e.date)}</td>
                                        <td>{e.type}</td>
                                        <td>{e.description}</td>
                                        <td className="text-end">
                                            {e.debit ? formatAmount(e.debit) : "-"}
                                        </td>
                                        <td className="text-end">
                                            {e.credit ? formatAmount(e.credit) : "-"}
                                        </td>
                                    </tr>
                                ))}

                                {/* TOTAL ROW */}
                                <tr style={{ fontWeight: "bold", background: "#f5f5f5" }}>
                                    <td colSpan="3" className="text-center">TOTAL</td>
                                    <td className="text-end">{formatAmount(totals.debit)}</td>
                                    <td className="text-end">{formatAmount(totals.credit)}</td>
                                </tr>

                                {/* OUTSTANDING ROW */}
                                <tr style={{ fontWeight: "bold", background: "#eaf7ea" }}>
                                    <td colSpan="3" className="text-center">OUTSTANDING</td>
                                    <td colSpan="2" className="text-center">
                                        ₹{formatAmount(outstandingAmount)} {outstandingType}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center mb-3">
                        <button className="btn btn-success" onClick={handleDownloadPDF}>
                            Download PDF
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Ledger;