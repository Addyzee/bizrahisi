// InvoicePopup.jsx
import React, { useState } from "react";

const InvoicePopup = (props) => {
    const {
        isVisible,
        onClose,
        finalTotalAmount,
        cartItems,
        onGenerate,
        onCustomerDataChange,
        openInvoicePage,
    } = props;

    const [customerData, setCustomerData] = useState({
        customerName: '',
        customerCompany: '',
        customerPhoneNumber: '',
        companyAddress: '',
        dueDate: '',
    });

    // Function to handle input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        // Update the local customerData state
        setCustomerData({
            ...customerData,
            [name]: value,
        });

        // Call the onCustomerDataChange prop to update customerData in the parent component (POS)
        onCustomerDataChange({
            ...customerData,
            [name]: value,
        });
    };

    return (
        isVisible && (
            <div className={`Invoice_Popup ${isVisible ? 'visible' : 'hidden'}`}>
                <button className="back_button" onClick={onClose}>
                    Back
                </button>
                <h2>Generate Invoice</h2>

                <div className="Invoice_Details">
                    <div className="Invoice_Row">
                        <span>Invoice:</span>
                        <span>Ksh {finalTotalAmount.toFixed(2)}</span>
                    </div>
                    <div className="Invoice_Row">
                        <label htmlFor="customerName">Customer Name:</label>
                        <input
                            type="text"
                            id="customerName"
                            placeholder="Customer Name"
                            name="customerName"
                            value={customerData.customerName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="Invoice_Row">
                        <label htmlFor="customerCompany">Customer Company:</label>
                        <input
                            type="text"
                            id="customerCompany"
                            placeholder="Customer Company"
                            name="customerCompany"
                            value={customerData.customerCompany}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="Invoice_Row">
                        <label htmlFor="customerPhoneNumber">Customer Phone Number:</label>
                        <input
                            type="text"
                            id="customerPhoneNumber"
                            placeholder="Customer Phone Number"
                            name="customerPhoneNumber"
                            value={customerData.customerPhoneNumber}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="Invoice_Row">
                        <label htmlFor="companyAddress">Company Physical Address:</label>
                        <input
                            type="text"
                            id="companyAddress"
                            placeholder="Company Physical Address"
                            name="companyAddress"
                            value={customerData.companyAddress}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="Invoice_Row">
                        <label htmlFor="dueDate">Due date:</label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={customerData.dueDate}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button className="Display_Invoice_Button" onClick={openInvoicePage}>
                        Display Invoice
                    </button>
                </div>
            </div>
        )
    );
};

export default InvoicePopup;
