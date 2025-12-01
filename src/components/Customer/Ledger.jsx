import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Ledger.css"
const Ledger = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [ledgerEntries, setLedgerEntries] = useState([]);
    const [totals, setTotals] = useState({ credited: 0, debited: 0, balance: 0 });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const printRef = useRef();

    // Fetch customers
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/customer`);
                const data = await res.json();
                setCustomers(data);
            } catch (err) {
                console.error("❌ Error fetching customers:", err);
            }
        };
        fetchCustomers();
    }, []);

    const handleCustomerChange = (e) => {
        const custId = e.target.value;
        const customer = customers.find((c) => c._id === custId);
        setSelectedCustomer(customer || null);
        setLedgerEntries([]);
        setTotals({ credited: 0, debited: 0, balance: 0 });
        setIsSubmitted(false);
    };

    const handleSubmit = async () => {
        if (!selectedCustomer) {
            alert("Please select a customer.");
            return;
        }

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/customer/showLedger?phoneNo=${selectedCustomer.phoneNo}`
            );
            const data = await res.json();

            if (res.ok) {
                const { bills, paymentRecord } = data;
                const combined = [];

                // Add bills
                bills.forEach((bill) => {
                    combined.push({
                        type: "Purchase",
                        date: bill.createdAt,
                        amount: bill.totalAmount,
                        description: `Bill ID: ${bill.billId}`,
                    });
                });

                // Add cash payments
                paymentRecord?.cash?.forEach((c) => {
                    combined.push({
                        type: "Payment (Cash)",
                        date: c.date,
                        amount: c.amount,
                        description: "-",
                    });
                });

                // Add gpay payments
                paymentRecord?.gpay?.forEach((g) => {
                    combined.push({
                        type: "Payment (Online)",
                        date: g.date,
                        amount: g.amount,
                        description: g.transactionId ? `Txn ID: ${g.transactionId}` : "-",
                    });
                });

                combined.sort((a, b) => new Date(a.date) - new Date(b.date));
                setLedgerEntries(combined);

                const totalDebited = combined
                    .filter((e) => e.type === "Purchase")
                    .reduce((sum, e) => sum + e.amount, 0);

                const totalCredited = combined
                    .filter((e) => e.type.startsWith("Payment"))
                    .reduce((sum, e) => sum + e.amount, 0);

                const balance = totalDebited - totalCredited;

                setTotals({ credited: totalCredited, debited: totalDebited, balance });
                setIsSubmitted(true);
            } else {
                console.error("❌ Failed to fetch payments:", data.message);
            }
        } catch (error) {
            console.error("❌ Error fetching payment details:", error);
        }
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return "-";
        const date = new Date(isoDate);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatAmount = (amount) => {
        return amount?.toLocaleString("en-IN") || "0";
    };

    const handleDownloadPDF = async () => {
        const input = printRef.current;

        // Convert visible HTML to canvas
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // --- Company Header ---
        const logoUrl = "/sunrise10-8.png"; // 🔥 Replace this
        const compNameUrl = "/transparentlogo2.png";

        const headerImg = new Image();
        headerImg.src = logoUrl;

        const headerImgName = new Image();
        headerImgName.src = compNameUrl;

        await new Promise((resolve) => {
            headerImg.onload = resolve;
        });

        await new Promise((resolve) => {
            headerImgName.onload = resolve;
        });

        // Logo top center

        // Center both images properly
        const pageWidth = pdf.internal.pageSize.getWidth();

        const logoWidth = 14;
        const logoHeight = 10;
        const logoX = (pageWidth - logoWidth) / 2;
        const logoY = 15;

        pdf.addImage(headerImg, "PNG", logoX, logoY, logoWidth, logoHeight);

        const nameWidth = 33;
        const nameHeight = 9;
        const nameX = (pageWidth - nameWidth) / 2;
        const nameY = logoY + logoHeight + 1;

        pdf.addImage(headerImgName, "PNG", nameX, nameY, nameWidth, nameHeight);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);

        const details = [
            "E-39 Sardar Estate, Road No. 2, Ajwa Road, Vadodara, Gujarat, India",
            "+91 9408758155",
            "sunrise.interior.hub@gmail.com",
            "GSTIN: 24ABZPB6331R1Z0",
            "UDYAM-GJ-24-0140870"
        ];

        let textY = nameY + nameHeight + 3;

        details.forEach((line) => {
            pdf.text(line, pageWidth / 2, textY, { align: "center" });
            textY += 3; // line spacing
        });


        pdf.addImage(imgData, "PNG", 10, textY+5, pdfWidth - 20, pdfHeight);

        pdf.save(`Ledger_${selectedCustomer?.name}.pdf`);
    };

    return (
        <div className="container py-5">
            {/* Form */}
            {!isSubmitted && (
                <div className="row justify-content-center mb-4">
                    <div className="col-md-6">
                        <div className="card shadow-sm p-4">
                            <h4 className="mb-4 text-center">Customer Ledger</h4>

                            <div className="mb-3">
                                <label className="form-label">Select Customer</label>
                                <select className="form-select" onChange={handleCustomerChange}>
                                    <option value="">-- Select Customer --</option>
                                    {customers.map((cust) => (
                                        <option key={cust._id} value={cust._id}>
                                            {cust.name} ({cust.phoneNo})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="d-grid mt-3">
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    Show Ledger
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ledger Section */}
            {ledgerEntries.length > 0 && (
                <>
                    {/* PDF Download Button */}
                    <div className="text-center mb-3">
                        <button className="btn btn-success" onClick={handleDownloadPDF}>
                            📥 Download PDF
                        </button>
                    </div>

                    {/* This part goes into the PDF */}
                    <div ref={printRef}>
                        {/* Totals */}
                        <div className="row justify-content-center mb-3">
                            <h5 className="text-center mb-3">
                                Ledger for <strong>{selectedCustomer?.name}</strong>
                            </h5>
                            <div className="col-md-10 d-flex justify-content-around flex-wrap">
                                <h6>
                                    Total Debited:{" "}
                                    <strong className="text-danger">₹{formatAmount(totals.debited)}</strong>
                                </h6>
                                <h6>
                                    Total Credited:{" "}
                                    <strong className="text-success">₹{formatAmount(totals.credited)}</strong>
                                </h6>
                                <h6>
                                    Balance:{" "}
                                    <strong className="text-primary">₹{formatAmount(totals.balance)}</strong>
                                </h6>
                            </div>
                        </div>

                        {/* Ledger Table */}
                        <div className="row justify-content-center">
                            <div className="col-md-10">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-hover">
                                        <thead className="table-light text-center">
                                            <tr>
                                                <th>Date</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                                <th>Amount (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ledgerEntries.map((entry, index) => (
                                                <tr
                                                    key={index}
                                                    className={
                                                        entry.type.startsWith("Payment")
                                                            ? "payment-row"
                                                            : "purchase-row"
                                                    }
                                                >
                                                    <td className="text-center">{formatDate(entry.date)}</td>
                                                    <td className="text-center">{entry.type}</td>
                                                    <td className="text-center">{entry.description}</td>
                                                    <td className="text-end">{formatAmount(entry.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Ledger;
