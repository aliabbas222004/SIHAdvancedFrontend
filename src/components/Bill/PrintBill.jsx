import React, { useState } from "react";

const PrintBill = () => {
    const [billId, setBillId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleDownloadBill = async () => {
        if (!billId.trim()) {
            setMessage("Please enter Bill ID");
            return;
        }

        console.log("Bill ID:", billId);

        try {
            setLoading(true);
            setMessage("");

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/bill/getBill/${encodeURIComponent(
                    billId.trim()
                )}`
            );

            if (!res.ok) {
                let errorMessage = "Failed to generate bill.";

                try {
                    const errorData = await res.json();

                    errorMessage =
                        errorData.message || errorMessage;
                } catch {
                    // Response wasn't JSON
                }

                throw new Error(errorMessage);
            }

            // Receive PDF
            const pdfBlob = await res.blob();

            if (!pdfBlob || pdfBlob.size === 0) {
                throw new Error("Generated PDF is empty.");
            }

            // Create temporary URL
            const pdfUrl =
                window.URL.createObjectURL(pdfBlob);

            // Create download link
            const downloadLink =
                document.createElement("a");

            downloadLink.href = pdfUrl;
            downloadLink.download = `${billId.trim()}.pdf`;

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // Release memory
            setTimeout(() => {
                window.URL.revokeObjectURL(pdfUrl);
            }, 1000);

            setMessage("Invoice downloaded successfully.");

        } catch (err) {
            setMessage(
                err.message || "Failed to download invoice."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 p-4 bg-white shadow rounded">

            <h3 className="mb-4">
                Download Existing Bill
            </h3>

            <div className="mb-3">
                <label className="form-label">
                    Enter Bill ID
                </label>

                <input
                    type="text"
                    className="form-control"
                    value={billId}
                    onChange={(e) =>
                        setBillId(e.target.value)
                    }
                    placeholder="Enter bill number"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleDownloadBill();
                        }
                    }}
                />
            </div>

            <button
                className="btn btn-primary"
                onClick={handleDownloadBill}
                disabled={loading}
            >
                {loading
                    ? "Generating..."
                    : "Download Invoice"}
            </button>

            {message && (
                <div
                    className={`alert mt-3 ${message.includes("successfully")
                            ? "alert-success"
                            : "alert-danger"
                        }`}
                >
                    {message}
                </div>
            )}

        </div>
    );
};

export default PrintBill;