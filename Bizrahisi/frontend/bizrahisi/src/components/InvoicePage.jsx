import React from 'react';
import './assets/css/InvoicePage.css';

const InvoicePage = ({ isVisible, onClose, customerData, finalTotalAmount, cartItems }) => {
  if (!isVisible) {
    return null;
  }

  return (
    isVisible && (
      <div className="InvoicePage_Popup">
        <div className="modal">
          <div className="Invoice_Page">
            <h2>INVOICE</h2>

            {/* Customer Information */}
            <div className="InvoicePage-CustomerInfo">
              <p className="Billed_To">Billed to </p>
              <p>{customerData.customerName}</p>
              <p>{customerData.customerCompany}</p>
              <p>{customerData.companyAddress}</p>
              <p>{customerData.customerPhoneNumber}</p>
            </div>

            {/* Invoice Details */}
            <div className="Invoice_Details">
              <div className="Invoice_Row">
                <span>Invoice #</span>
                <span>Invoice date</span>
                <span>Reference</span>
                <span>Due date</span>
              </div>
              <div className="Invoice_Row">
                {/* Add invoice details here */}
              </div>
            </div>

            {/* Invoice Items */}
            <div className="Invoice_Items">
              {/*Invoice Items */}
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
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>Ksh {item.product_selling_price}</td>
                      <td>Ksh {item.quantity * parseFloat(item.product_selling_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subtotal and Total Due */}
            <div className="InvoicePage-Totals">
              <div className="Subtotal">Subtotal</div>
              <div className="TotalDue">Total due</div>
            </div>

            {/* Additional Actions */}
            <div className="InvoicePage-Footer">
              <button className="DownloadButton">Download as PDF</button>
              <button className="ShareButton">Share</button>
            </div>
          </div>
          <button className="close_button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default InvoicePage;
