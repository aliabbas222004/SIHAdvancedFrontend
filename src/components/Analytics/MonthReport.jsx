import React, { useState } from "react";
import * as XLSX from "xlsx";

const MonthReport = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [report, setReport] = useState([]);

  const handleSubmit = async () => {
    if (!month || !year) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/analytics/monthlyReport?month=${month}&year=${year}`
      );

      const data = await res.json();

      // Sort by bill number
      const sortedData = data.sort((a, b) => {
        const aNo = parseInt(a.billId.split("/")[0].replace(/\D/g, ""));
        const bNo = parseInt(b.billId.split("/")[0].replace(/\D/g, ""));
        return aNo - bNo;
      });

      setReport(sortedData);
    } catch (err) {
      console.error("Error fetching report:", err);
    }
  };

  const handleExcelExport = () => {
    if (!Array.isArray(report) || report.length === 0) return;

    const excelData = report.map((bill, index) => ({
      "Sr No": index + 1,
      "Bill ID": bill.billId,
      "Bill Date": new Date(bill.createdAt).toLocaleDateString(),
      
      "Customer Name": bill.customerName,
      "Customer Phone": bill.customerPhone,
      "Billing Address": bill.billAddress,
      "Customer GST": bill.customerGST,
      "Customer State": bill.customerState,

      "Shipping Name": bill.shipCustName,
      "Shipping Phone": bill.shipCustPhone,
      "Shipping Address": bill.shippingAddress,
      "Shipping GST": bill.shipCustGST,
      "Shipping State": bill.shipCustState,
      "Total Amount": bill.totalAmount,
      
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Report");

    XLSX.writeFile(
      workbook,
      `Monthly_Report_${month}_${year}.xlsx`
    );
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">📅 Monthly Report</h2>

      {/* Form */}
      {report.length === 0 && (
        <div className="d-flex justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-sm p-4">
              <h5 className="mb-3 fw-bold">Select Month & Year</h5>

              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label fw-semibold">Month</label>
                  <select
                    className="form-select"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    <option value="">-- Choose Month --</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label fw-semibold">Year</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g. 2025"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-primary px-4"
                  onClick={handleSubmit}
                  disabled={!month || !year}
                >
                  Show Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Table */}
      {Array.isArray(report) && report.length > 0 && (
        <div className="mt-5">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Bill ID</th>
                  <th>Bill Date</th>
                  <th>Customer Name</th>
                  <th>Phone</th>
                  <th>GST</th>
                  <th>State</th>
                  <th>Total Amount</th>
                  
                </tr>
              </thead>

              <tbody>
                {report.map((bill, index) => (
                  <tr key={index}>
                    <td>{bill.billId}</td>
                    <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                    <td>{bill.customerName}</td>
                    <td>{bill.customerPhone}</td>
                    <td>{bill.customerGST}</td>
                    <td>{bill.customerState}</td>
                    <td>₹{bill.totalAmount}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EXCEL BUTTON */}
          <div className="text-center mt-4">
            <button
              className="btn btn-success px-4"
              onClick={handleExcelExport}
            >
              📊 Export to Excel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthReport;
