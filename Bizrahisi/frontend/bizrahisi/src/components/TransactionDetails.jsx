// TransactionDetails.jsx

import React, { useContext, useRef } from 'react';
import './assets/css/TransactionDetails.css';
import AuthContext from '../context/AuthContext';
import jsPDF from 'jspdf';

const TransactionDetail = ({ isVisible, onClose, details }) => {
  const contentRef = useRef(null);

  if (!isVisible || !details) {
    return null;
  }

  let {businessName} = useContext(AuthContext)
  
  const handleDownloadClick = () => {
    return new Promise((resolve, reject) => {
      const content = contentRef.current;
      if (content) {
        const pdf = new jsPDF('p', 'pt', 'a4'); // Specify paper size (A4) for PDF

        content.style.maxWidth = '100%';
        content.style.transform = 'scale(0.8)';
        content.style.transformOrigin = 'top left';

        const contentWidth = content.offsetWidth;
        const contentHeight = content.offsetHeight;

        // Options for PDF rendering
        const options = {
          background: 'white',
          scale: 0.5, // Adjust scale as needed
        };

        pdf.html(content, {
          ...options,
          callback: () => {
            resolve(pdf); // Resolve the promise with the PDF object once it's generated
          },
        });
      } else {
        reject(new Error('Content element not found.'));
      }
    });
  };

  const handleShareClick = async () => {
    try {
      const pdf = await handleDownloadClick(); // Generate PDF
      const pdfData = pdf.output('blob');
      const filesArray = [new File([pdfData], 'transaction_details.pdf', { type: 'application/pdf' })];

      if (navigator.canShare && navigator.canShare({ files: filesArray })) {
        await navigator.share({
          files: filesArray,
          title: 'Transaction Details',
          text: `Invoice #: ${details.code}\nInvoice Date: ${details.transaction_date}\nReference: ${details.code}\nStatus: ${details.transaction_status}`,
        });
      } else {
        console.log('Sharing files is not supported on this platform.');
        // Implement fallback share method (e.g., open share modal)
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <div className="TransactionDetailPage_Popup">
      <div className="modal">
        <div className="Transaction_Detail_Page" ref={contentRef}>
          <h2>Transaction Details</h2>

          <p className="Transaction_type">{details.transaction_type}</p>

          <div className="TransactionParty_details">
            <div className="LeftSide_Details">
              <p className="Billed_to">Billed to <span className="Transaction_Party">{details.transaction_party}</span> </p>
              <p className="Payment_Method">Through <span className="Paid_Through">{details.paid_through}</span> </p>
            </div>

            <div className="RightSide_Details">
              <p className="BusinessName">{businessName}</p>
              <p className="BusinessLocation">Kiambu</p>
              <p className="PaymentDate_Heading">Payment Date <span className='PaymentDate'>{details.transaction_date}</span></p>
            </div>
          </div> 
          
          {/* Render more transaction details */}
          <div className="More_Transaction_Details"> 
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Invoice date</th>
                  <th>Reference</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{details.code}</td>
                  <td>{details.transaction_date}</td>
                  <td>{details.code}</td>
                  <td>{details.transaction_status}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* <div className="Invoice_Details"> 
            <div className="Invoice_Row">
              <span>Invoice #</span>
              <span>Invoice date</span>
              <span>Reference</span>
              <span>Due date</span>
            </div>
            <div className="Invoice_Row">
              <span>{details.code}</span>
              <span>{details.transaction_date}</span>
              <span>{details.code}</span>
              <span>{details.transaction_status}</span>
            </div>
          </div>  */}

          {/* Render invoice items */}
          <div className="Product_Items">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Line Total</th>
                </tr>
              </thead>
              <tbody>
                {details.transaction.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product.product_name}</td>
                    <td>{item.quantity_affected}</td>
                    <td>{item.unit_price}</td>
                    <td>{item.transaction_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="TransactionItem-Totals">
              <div className="Transaction-Subtotal">
                <p>Subtotal <span className="Transaction_Subtotal">{details.transaction_amount}</span> </p> 
              </div>
              <div className="TransactionAmount-Paid">
                <p>Paid <span className="TransactionAmount_Paid">{details.transaction_amount}</span> </p>
              </div>
            </div>
          </div>

          <div className="Transaction-TotalDue">
            <p>Total Due <span className="Transaction_TotalDue">{details.transaction_amount}</span> </p>
          </div>

          <div className="TransactionPayment-Method">
            <p>Payment Method <span className="TransactionPayment_Method">{details.paid_through}</span></p>
            {/* Mpesa reference */}
          </div>

          {/* Additional Actions */}
          <div className="TransactionDetailsPage-Footer">
            <button className="DownloadButton" onClick={handleDownloadClick}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.32031 11.6799L11.8803 14.2399L14.4403 11.6799" stroke="#3D3D3D" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.8809 4V14.17" stroke="#3D3D3D" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 12.1799C20 16.5999 17 20.1799 12 20.1799C7 20.1799 4 16.5999 4 12.1799" stroke="#3D3D3D" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

              Download as PDF
            </button>
            <button className="ShareButton" onClick={handleShareClick}>Share</button>
          </div>
        </div>
        <button className="close_button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TransactionDetail;
