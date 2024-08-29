import React from "react";
import './assets/css/PrintableReceipt.css'; // Add styles for the printable receipt

const PrintableReceipt = (props) => {
    const {
        isVisible,
        onClose,
        finalTotalAmount,
        cartItems,
        receiptCustomerName,
        paymentMethodSelected,
        amountPaid,
        balance,
        mpesaAmount,
    } = props;

    return (
        isVisible && (
            <div className="TransactionSummary_PrintableReceipt">
                <div className="modal">
                    <div className="PrintableReceipt">
                        <h2>POS Slip</h2>

                        <div className="Receipt_Info">
                            <div className="Receipt-CustomerInfo">
                                <p className="BilledTo">Billed to</p>
                                <p>{receiptCustomerName}</p>
                            </div>

                            <div className="Receipt-CompanyInfo">
                                <p className="From">From</p>
                                <p>{/* businessName */}</p>
                                <p>{/* businessAddress */}</p>
                                <p>{/* businessPhone */}</p>
                            </div>
                        </div>

                        {/* Slip Number and Payment Date */}
                        <div className="SlipInfo">
                            <div className="Slip_Number">
                                <p className="Slip_Title">Slip #</p>
                                <p>{/* slipNumber */}</p>
                            </div>
                            <div className="Date">
                                <p className="Payment_Date">Payment Date</p>
                                <p>{/* paymentDate */}</p>
                            </div>
                        </div>

                        {/* Product Table */}
                        <div className="Receipt_Items">
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

                        {/* Total, Paid, Customer Balance */}
                        <div className="PaymentInfo">
                            <div className="TotalInfo">
                                <p className="Total_Info">Total</p>
                                <p className="Total_Amount">Ksh {finalTotalAmount}</p>
                            </div>
                            <div className="PaidInfo">
                                <p className="Paid_Info">Paid</p>
                                <p className="Paid_Amount">
                                    {paymentMethodSelected === "Cash"
                                    ? `Ksh ${amountPaid}`
                                    : paymentMethodSelected === "Mpesa"
                                    ? `Ksh ${mpesaAmount}`
                                    : ""}
                                </p>
                            </div>
                            <div className="BalanceInfo">
                                <p className="Balance_Info">Balance</p>
                                <p className="Balance_Amount">Ksh {balance.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="ReceiptPaymentMethod">
                            <p className="ReceiptPayment_Method">Payment Method</p>
                            <p className="MethodSelected">
                                {paymentMethodSelected === "Cash"
                                ? "Cash"
                                : paymentMethodSelected === "Mpesa"
                                ? "Mpesa"
                                : ""}
                            </p>
                        </div>

                        {/* Download as PDF (optional) */}
                        <div className="DownloadPDF">
                            <button /* onClick={handleDownloadPDF} */>Download as PDF</button>
                        </div>

                        {/* Footer */}
                        <div className="Footer">
                            <p>BizRahisi</p>
                            <p>decoleather@gmail.com</p>
                        </div>

                        {/* Print Button */}
                        <div className="PrintButton">
                            <button /* onClick={handlePrint} */>Print</button>
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

export default PrintableReceipt;
