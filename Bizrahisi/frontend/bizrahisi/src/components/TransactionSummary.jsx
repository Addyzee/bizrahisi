import React from "react";
import './assets/css/TransactionSummary.css';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';


const TransactionSummary = (props) => {
    const {
        isVisible,
        onClose,
        finalTotalAmount,
        cartItems,
        data,
        openPrintableReceipt,
    } = props;

    const {
        receiptCustomerName,
        paymentMethodSelected,
        amountPaid,
        balance,
        mpesaAmount,
    } = data;

    let {authTokens} = useContext(AuthContext)
    const baseURL = import.meta.env.VITE_SERVER_URL;

    const handlePrintReceipt = () => {
        // Prepare the data to send to backend
        const transactionData = {
            // inventory: 1, // Assuming correct inventory ID is 1
            transaction_type: 'sale', // Use lowercase and valid choices
            paid_through: 'cash', // Use lowercase and valid choices
            transaction_status: 'complete', // Use lowercase and valid choices
            transactions: cartItems.map(item => ({
                product: item.product_code, // Provide correct product ID
                quantity_affected: item.quantity,
                unit_price: item.product_selling_price
            })),
            transaction_party: receiptCustomerName,
            transaction_amount: amountPaid,
            balance,
            mpesaAmount,
        };

        // Send the POST request to backend
        fetch(baseURL + `/transactions/records/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access) 
            },
            body: JSON.stringify(transactionData),
        })
        .then(response => {
            if (response.ok) {
                // Handle success response
                console.log('Transaction Data Sent Successfully');
                openPrintableReceipt();
            } else {
                // Handle error response
                console.error('Failed to send transaction data to backend');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        isVisible && (
            <div className="CompletePayment_TransactionSummary">
                <div className="modal">
                    <div className="Transaction_Summary">
                        <button className="back_button" onClick={onClose}>
                            Back
                        </button>
                        <h2>Transaction Summary</h2>

                        <div className="Transaction_Details">
                            <div className="Detail_Row">
                                <span className="Title">Goods sold for:</span>
                                <span>Ksh {finalTotalAmount.toFixed(2)}</span>
                            </div>

                            <div className="Detail_Row">
                                <span className="Title">Customer Name:</span>
                                <span>{receiptCustomerName}</span>
                            </div>

                            <div className="Detail_Row">
                                <span className="Title">Paid Via:</span>
                                <span>
                                    {paymentMethodSelected === "Cash"
                                    ? "Cash"
                                    : paymentMethodSelected === "Mpesa"
                                    ? "Mpesa"
                                    : ""}
                                </span>
                            </div>

                            <div className="Detail_Row">
                                <span className="Title">Amount paid:</span>
                                <span>
                                    {paymentMethodSelected === "Cash"
                                    ? `Ksh ${amountPaid}`
                                    : paymentMethodSelected === "Mpesa"
                                    ? `Ksh ${mpesaAmount}`
                                    : ""}
                                </span>
                            </div>

                            <div className="Detail_Row">
                                <span className="Title">Customer balance:</span>
                                <span>Ksh {balance.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="Actions">
                            <button onClick={onClose}>Cancel</button>
                            <button onClick={handlePrintReceipt}>Print Receipt</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default TransactionSummary;
