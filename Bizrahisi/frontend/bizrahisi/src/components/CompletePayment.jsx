import React, { useEffect, useState } from "react";
import Mpesa_Logo_1 from './assets/images/Mpesa_Logo_1.png'; 
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const CompletePayment = (props) => {
    const {
        isVisible,
        onClose,
        finalTotalAmount,
        onDataPass,
    } = props;

    const [customerData, setCustomerData] = useState({
        customerName: '',
    });
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [balance, setBalance] = useState(0);
    const [keyboardLayout, setKeyboardLayout] = useState({
        default: ["1 2 3", "4 5 6", "7 8 9", "{bksp} 0 ."],
    });
    const [inputValue, setInputValue] = useState("");
    const [isKeypadActive, setIsKeypadActive] = useState(false);
    const [mpesaAmount, setMpesaAmount] = useState("");

    const onKeyPress = (button) => {
        // Handle button clicks here
        if (button === "{bksp}") {
            // Handle backspace
            setInputValue(inputValue.slice(0, -1));
            if(selectedPaymentMethod === 'Mpesa'){
                setMpesaAmount(mpesaAmount.slice(0, -1));
            }
        } else if (button === ".") {
            // Handle decimal point
            if (inputValue.indexOf(".") === -1 && button === "." && inputValue !== "") {
                setInputValue(inputValue + button);
            }
            if(selectedPaymentMethod === 'Mpesa'){
                if (mpesaAmount.indexOf(".") === -1 && button === "." && mpesaAmount !== "") {
                    setMpesaAmount(mpesaAmount + button);
                }
            }
        } else {
            // Append the button value to the input field
            setInputValue(inputValue + button);
            if(selectedPaymentMethod === 'Mpesa'){
                setMpesaAmount(mpesaAmount + button);
            }
        }
    };

    const handleCashInputChange = (newValue) => {
        setInputValue(newValue);
    };

    const handleMpesaInputChange = (newValue) => {
        setMpesaAmount(newValue);
    };
    
    // Function to handle input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "customerName") {
            setCustomerData({ ...customerData, [name]: value });
        }
    };

    // Function to handle payment method selection
    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
        setIsKeypadActive(true); // Set keypad active for both Cash and Mpesa
        setInputValue(""); // Reset input value for both methods
        setMpesaAmount(""); // Reset mpesa amount
    };

    // Function to calculate the balance
    const calculateBalance = () => {
        if (selectedPaymentMethod === "Cash") {
            let amountPaid = parseFloat(inputValue);

            if (isNaN(amountPaid)) {
                amountPaid = 0;
            }

            const balance = finalTotalAmount - amountPaid;
            setBalance(balance);
        } else if (selectedPaymentMethod === "Mpesa") {
            // Check if mpesaAmount is a valid number
            const parsedMpesaAmount = parseFloat(mpesaAmount);
            const balance = isNaN(parsedMpesaAmount) ? finalTotalAmount : finalTotalAmount - parsedMpesaAmount;
            setBalance(balance);
        }
    };

    // Calling the calculateBalance whenever the selectedPaymentMethod or finalTotalAmount changes
    useEffect(() => {
        calculateBalance();
    }, [selectedPaymentMethod, finalTotalAmount, inputValue, mpesaAmount]);

    // Passing data to POS
    const handleDataPassing = () => {
        const data = {
            amountPaid: selectedPaymentMethod === "Cash" ? inputValue : mpesaAmount,
            receiptCustomerName: customerData.customerName,
            paymentMethodSelected: selectedPaymentMethod,
            balance: balance,
            mpesaAmount: mpesaAmount,
        };

        // Call the function passed from POS to send the data
        onDataPass(data);
    };

    return (
        isVisible && (
            <div className={`Complete_Payment ${isVisible ? 'visible' : 'hidden'}`}>
                <button className="back_button" onClick={onClose}>
                    Back
                </button>
                <div className="CompletePayment_Container">
                    <h2>Complete Payment</h2>

                    <div className="Payment_Container">
                        <div className="PaymentMethod_And_TransactionsReceived">
                            <div className="PaymentMethod">
                                <h2>Payment Method</h2>

                                <button 
                                    className={`Mpesa ${selectedPaymentMethod === "Mpesa" ? "selected" : ""}`}
                                    onClick={() => handlePaymentMethodSelect("Mpesa")}
                                >
                                    <img src={Mpesa_Logo_1} alt="" className="Mpesa_Logo_1" />
                                </button>
                                <button 
                                    className={`Cash ${selectedPaymentMethod === "Cash" ? "selected" : ""}`}
                                    onClick={() => handlePaymentMethodSelect("Cash")}
                                >
                                    Cash
                                </button> 
                            </div>

                            <div className="TransactionsReceived">
                                <div className="ReceivedTransactions">
                                    <h2>Received Transactions</h2>
                                    <button className="RefreshButton">
                                        <svg width="24" height="17" viewBox="0 0 24 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.0947 0C7.60241 0 3.13608 3.62713 3.13608 8.08277C3.13608 8.09174 3.12483 8.09575 3.11915 8.08881L1.16411 5.70032C0.971149 5.4636 0.575815 5.39869 0.28402 5.55523C-0.00777411 5.71177 -0.0877823 6.03249 0.105179 6.26921L2.96665 9.7627C3.07019 9.8887 3.23491 9.96888 3.41846 9.98797C3.4467 9.99179 3.47023 9.99179 3.49847 9.99179C3.65378 9.99179 3.80438 9.94597 3.92204 9.85815L7.89891 6.95263C8.15776 6.76173 8.1813 6.4372 7.94598 6.22339C7.71066 6.0134 7.31062 5.99431 7.04706 6.18521L4.43758 8.09838C4.4248 8.10775 4.40679 8.09862 4.40679 8.08277C4.40679 4.19220 8.30366 1.03087 13.0947 1.03087C17.8858 1.03087 21.7874 4.19220 21.7874 8.08277C21.7874 11.9733 17.8905 15.1347 13.0994 15.1347C10.7792 15.1347 8.59546 14.4016 6.95764 13.0691C6.7082 12.8668 6.30816 12.8668 6.05873 13.0691C5.80929 13.2715 5.80929 13.5960 6.05873 13.7984C7.94127 15.3256 10.4403 16.1655 13.0994 16.1655C18.5871 16.1655 23.0581 12.5422 23.0581 8.08277C23.0581 3.62331 18.5871 0 13.0947 0Z" fill="black"/>
                                        </svg>
                                    </button>
                                </div>

                                <div className="TransactionsList_Table">

                                </div>
                            </div>
                        </div>

                        <div className="Payment_And_Balance">
                            <div className="Payment_Row">
                                <span className="Title">Pay:</span>
                                <span>Ksh {finalTotalAmount.toFixed(2)}</span>
                            </div>

                            <p>Please select Payment Method</p>

                            <div className="Balance_Row">
                                <span className="Title">Balance:</span>
                                <span>Ksh {isNaN(balance) ? "NaN" : balance.toFixed(2)}</span>
                            </div>

                            <div className="PaymentMethod_Selected">
                                {selectedPaymentMethod && (
                                    <div className="Amount_Paid">
                                        {selectedPaymentMethod === "Cash" ? (
                                            <div className="Cash_Amount_Input">
                                                <input
                                                    type="text"
                                                    value={inputValue}
                                                    onChange={(e) => handleCashInputChange(e.target.value)}
                                                    placeholder="Enter Cash Amount paid"
                                                />
                                            </div>
                                        ) : selectedPaymentMethod === "Mpesa" ? (
                                            <div className="Mpesa_Amount_Input">
                                                <input
                                                    type="text"
                                                    value={mpesaAmount}
                                                    onChange={(e) => handleMpesaInputChange(e.target.value)}
                                                    placeholder="Enter Mpesa Amount paid"
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>

                            <div className="Keypad">
                                {isKeypadActive && (
                                    <Keyboard
                                        layoutName="default"
                                        layout={keyboardLayout}
                                        onKeyPress={onKeyPress}
                                    />
                                )}
                            </div>

                            <div className="CustomerDetails_Row">
                                <label htmlFor="CustomerName">CustomerName</label>
                                <input
                                    type="text"
                                    id="customerName"
                                    name="customerName"
                                    value={customerData.customerName}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <button className="PrintReceiptButton" onClick={handleDataPassing}>
                                print Receipt
                            </button>
                        </div>
                    </div>
                </div>    
            </div>
        )
    );
};

export default CompletePayment;
