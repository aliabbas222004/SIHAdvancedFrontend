import React from 'react';
import '../InvoiceTemplate.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhoneAlt, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import QRCode from "react-qr-code";

const InvoiceTemplate = ({
  billId,
  billDate,
  custName,
  phoneno,
  custAdd,
  custState,
  custGSTIN,
  shipcustName,
  shipcustPhone,
  shipAdd,
  shipbillState,
  shipcustGST,
  tableData,
  totalQuantity,
  totalPrice
}) => {
  const numberToWords = (num) => {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const numToWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + numToWords(n % 100) : '');
      if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
      if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
      return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
    };

    const [whole, decimal] = num.toFixed(2).split('.');
    const rupees = numToWords(parseInt(whole));
    const paise = parseInt(decimal) > 0 ? ` and ${numToWords(parseInt(decimal))} Paise` : '';
    return `${rupees} Rupees${paise} Only`;
  };

  const MIN_ROWS = 15;
  const emptyRowsCount = Math.max(0, MIN_ROWS - tableData.length);
  const gstAmount = (totalPrice * 18) / 100;
  const grandTotal = totalPrice;

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };



  const calculateTaxRows = () => {
    const taxMap = {};

    tableData.forEach(item => {
      const hsn = item.HSN;
      const total = item.finalPrice * item.selectedQuantity;

      if (!taxMap[hsn]) {
        taxMap[hsn] = {
          taxableValue: 0,
          cgst: 0,
          sgst: 0
        };
      }

      taxMap[hsn].taxableValue += total;
      taxMap[hsn].cgst += (total * 9) / 100;
      taxMap[hsn].sgst += (total * 9) / 100;
    });

    return Object.entries(taxMap).map(([hsn, values], i) => ({
      hsn,
      taxableValue: values.taxableValue,
      cgst: values.cgst,
      sgst: values.sgst,
      totalTax: (values.cgst + values.sgst)
    }));
  };

  const taxRows = calculateTaxRows();
  const emptyTaxRowsCount = Math.max(0, 9 - taxRows.length);
  const renderInvoice = (copyLabel) => (
    <div className="invoice-container">
      <div className="copy-label">{copyLabel}</div>
      <div className="invoice-header">
        <div className='sImg'>
          <img src="/transparentlogo1.png" alt="logo" className="logo1" />
          <br />
          <img src="/transparentlogo2.png" className="logo2" alt="secondary logo" />
        </div>
        <div className="company-details">
          <h2>SUNRISE INTERIOR HUB</h2>
          <p>
            <FontAwesomeIcon icon={faMapMarkerAlt} /> E-39 Sardar Estate, Rd No. 2, Ajwa Rd., Vadodara, Gujarat, India <br />
            <FontAwesomeIcon icon={faPhone} /> +91 9408758155 <br />
            <FontAwesomeIcon icon={faEnvelope} /> sunrise.interior.hub@gmail.com <br />
            GSTIN: 24ABZPB6331R1Z0 <br />
            UDYAM-GJ-24-0140870
          </p>
        </div>
        <div className="qr-section" style={{ paddingRight: '10px' }}>
          <QRCode value={`upi://pay?pa=7048897540@upi&pn=SunriseInteriorHub&am=${totalPrice}.00&cu=INR`}
            size={70}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H" />
          <p>Scan to pay</p>
        </div>
      </div>

      <div className="info-grid row" style={{display:'flex'}}>
        {/* Left Section */}
        <div className="left col-12 col-md-6">
          <p className="fw-bold bill mt-1">Bill Date: <span className="fw-normal">{formatDate(billDate)}</span></p>
          <p className="fw-bold mb-3">Billing To:</p>
          <p><strong>Name:</strong> {custName}</p>
          <p><strong>Phone:</strong> {phoneno}</p>
          <p><strong>Address:</strong> {custAdd}</p>
          <p><strong>State:</strong> {custState}</p>
          <p><strong>GSTIN:</strong> {custGSTIN}</p>
        </div>

        {/* Right Section */}
        <div className="right col-12 col-md-6">
          <p className="fw-bold bill mt-1">Bill Id: <span className="fw-normal">{billId}</span></p>
          <p className="fw-bold mb-3">Shipping To:</p>
          <p><strong>Name:</strong> {shipcustName}</p>
          <p><strong>Phone:</strong> {shipcustPhone}</p>
          <p><strong>Address:</strong> {shipAdd}</p>
          <p><strong>State:</strong> {shipbillState}</p>
          <p><strong>GSTIN:</strong> {shipcustGST}</p>
        </div>
      </div>



      <table className="invoice-table">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Description of Goods</th>
            <th>HSN/SAC</th>
            <th>Quantity</th>
            <th>Rate(Inc. tax)</th>
            <th>GST %</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item.itemName}</td>
              <td>{item.HSN}</td>
              <td>{item.selectedQuantity}</td>
              <td>{item.finalPrice}</td>
              <td>18%</td>
              <td>{(item.finalPrice / 1.18).toFixed(2)}</td>
              <td>{((item.finalPrice / 1.18) * item.selectedQuantity).toFixed(2)}</td>
            </tr>
          ))}
          {[...Array(emptyRowsCount)].map((_, idx) => (
            <tr className='emptyRows' key={`empty-${idx}`}>
              <td colSpan={8}>&nbsp;</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr >
            <td colSpan="3" className='text-right'>Sub total</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><strong>{(totalPrice / 1.18).toFixed(2)} ₹</strong></td>
          </tr>
          <tr className='gst'>
            <td colSpan="3" className='text-right'>SGST</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><strong>{((totalPrice / 1.18 * 0.09).toFixed(2))} ₹</strong></td>
          </tr>
          <tr className='gst'>
            <td colSpan="3" className='text-right'>CGST</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><strong>{((totalPrice / 1.18 * 0.09).toFixed(2))} ₹</strong></td>
          </tr>
          <tr>
            <td colSpan="3" className='text-right'>Total</td>
            <td><strong>{totalQuantity}</strong></td>
            <td></td>
            <td></td>
            <td></td>
            <td><strong>{((totalPrice)).toFixed(2)} ₹
            </strong></td>
          </tr>
          <tr>
            <td colSpan="8" className='amtInWords'><strong>Amount in Words:</strong> {numberToWords(grandTotal)}</td>
          </tr>
        </tfoot>
      </table>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>HSN/SAC</th>
            <th>Taxable Value</th>
            <th>CGST %</th>
            <th>CGST Amt</th>
            <th>SGST %</th>
            <th>SGST Amt</th>
            <th>Total Tax</th>
          </tr>
        </thead>
        <tbody>
          {taxRows.map((row, i) => (
            <tr key={i}>
              <td>{row.hsn}</td>
              <td>{(row.taxableValue / 1.18).toFixed(2)}</td>
              <td>9%</td>
              <td>{(row.taxableValue / 1.18 * 0.09).toFixed(2)}</td>
              <td>9%</td>
              <td>{(row.taxableValue / 1.18 * 0.09).toFixed(2)}</td>
              <td>{(row.taxableValue / 1.18 * 0.09 * 2).toFixed(2)}</td>
            </tr>
          ))}
          {[...Array(emptyTaxRowsCount)].map((_, idx) => (
            <tr className='emptyRows' key={`empty-${idx}`}>
              <td colSpan={8}>&nbsp;</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="7" className='amtInWords'><strong>Amount in Words:</strong> {numberToWords(totalPrice - (totalPrice / 1.18))}</td>
          </tr>
        </tfoot>
      </table>

      <div className="row">
        <div className="col-4 col-md-4">
          <div className="terms">
            <strong className="d-block">Terms and Conditions:</strong>
            <ul className="mb-0 ps-3">
              <li>Goods once sold will not be taken back.</li>
              <li>Our responsibility ceases after goods leave premises.</li>
              <li>Subject to Vadodara jurisdiction only.</li>
              <li>We are not responsible for transport damage.</li>
            </ul>
          </div>
        </div>

        <div className="col-4 col-md-4">
          <div className="terms">
            <strong className="d-block mb-1">Sunrise Interior Hub's bank details</strong>
            <div><strong>Bank Name:</strong> Bank of Baroda</div>
            <div><strong>A/c No.:</strong> 58270200000304</div>
            <div><strong>Branch & IFS Code:</strong> KHODIYARNAGAR / BARBOKHOBAR</div>
            <div><strong>PAN:</strong> 24ABZPB6331R1Z0</div>
          </div>
        </div>

        <div className="col-4 col-md-4 text-center">
          <div className="mb-3" style={{ fontSize: '10px' }}>For Sunrise Interior Hub</div>
          <p>
            <img
              src="/sign.png"
              alt="Authorized Signature"
              style={{ width: '150px' }}
            />
          </p>
          <div className="mb-3" style={{ fontSize: '10px' }}>Authorized Signature</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="print-wrapper">
      {renderInvoice("Original for Buyer")}
      <div className="page-break"></div>
      {renderInvoice("Duplicate for Supplier")}
    </div>
  );
};

export default InvoiceTemplate;
