// Purchase.jsx //
import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/css/Purchase.css';
import TransactionDetails from './TransactionDetails';
import AuthContext from '../context/AuthContext';

const Purchase = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [activeSection, setActiveSection] = useState('purchase'); 
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [isRecordPurchaseVisible, setRecordPurchaseVisible] = useState(false);
    const [isTransactionDetailsPageVisible, setIsTransactionDetailsPageVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const baseURL = import.meta.env.VITE_SERVER_URL;

    // Functions to handle navigation to different sections
    const handleNavigation = (section) => {
        setActiveSection(section);
        switch (section) {
            case 'dashboard':
                //Navigate to the Dashboard page
                navigate('/dashboard');
                break;
            case 'pos':
                //Navigate to the POS page
                navigate('/pos')
                break;
            case 'purchase':
                //Navigate to the Purchase page
                navigate('/purchase');
                break;
            case 'transactions':
                //Navigate to the Transactions page
                navigate('/transactions');
                break;
            case 'inventory':
                //Navigate to the Inventory page
                navigate('/inventory');
                break;
            default:
                // handles for other sections
        }
    };

    // Function to togg;e dark mode
    const toggleDarkMode = () => {
        // Togglr dark mode
        setDarkMode(!darkMode);

        // Saving the user's preferences in local storage or cookies
        // to remember their choice across sessions.
        localStorage.setItem('darkMode', !darkMode);
    };

    // Update the date and time every second
    useEffect(() => {
        // Function to get the formatted date and time
        const getFormattedDateTime = () => {
            const options = {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            };
            const dateTime = new Date().toLocaleDateString('en-US', options);
            return dateTime;
        };

        // Update the current date and time every minute
        const interval = setInterval(() => {
            setCurrentDateTime(getFormattedDateTime());
        }, 60000);

        // Initial update
        setCurrentDateTime(getFormattedDateTime());

        // Clear the interval when the component unmounts
        return () => clearInterval(interval)
    }, []);  

    // Event handler to toggle visibility
    const toggleRecordPurchase = () => {
        setRecordPurchaseVisible(!isRecordPurchaseVisible);
    };
    
    let {authTokens} = useContext(AuthContext)
    let [purchaseData, setpurchaseData] = useState([])
    let [productsRestock, setproductsRestock] = useState([])
    let [transactionStats, settransactionStats] = useState([])
    let [inventoryStats, setInventoryStats] = useState([])
    let [topStock, settopStock] = useState([])

    useEffect(() => {
        getpurchaseData()
    },[])
    useEffect(() => {
        getTransactionStats()
    },[])
    useEffect(() => {
        getproductsRestock()
    },[])
    useEffect(() => {
        getInventoryStats()
    },[])
    useEffect(() => {
        gettopStock()
    },[])


    let getpurchaseData = async()=>{
         let response = await fetch(baseURL+'/transactions/records/purchases',{
            method: 'GET',
            headers:{
                'Content-Type':'appliation/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        setpurchaseData(data)
    }

    

    let getproductsRestock = async()=>{
         let response = await fetch(baseURL+'/inventory/products/restock',{
            method: 'GET',
            headers:{
                'Content-Type':'appliation/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        setproductsRestock(data)
    }
    let getTransactionStats = async()=>{
         let response = await fetch(baseURL+'/transactions/records/stats',{
            method: 'GET',
            headers:{
                'Content-Type':'appliation/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        settransactionStats(data)
    }

    let getInventoryStats = async()=>{
         let response = await fetch(baseURL+'/inventory/products/stats',{
            method: 'GET',
            headers:{
                'Content-Type':'appliation/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        setInventoryStats(data)
    }

    let gettopStock = async()=>{
         let response = await fetch(baseURL+'/transactions/records/top-stock',{
            method: 'GET',
            headers:{
                'Content-Type':'appliation/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        settopStock(data)
    }


    

    // Initial widths of the frames
    const Purchase_frameWidths = {
        Purchase_Overview: '1260px',
        Purchase_History: '1215px',
    };

    // Update the frame widths when Record Purchase is visible
    if (isRecordPurchaseVisible) {
        for (const frame in Purchase_frameWidths) {
            Purchase_frameWidths[frame] = 'calc(' + Purchase_frameWidths[frame] + ' - 390px)';
        }
    }

    // Initial widths of the frames
    const TopSellingStocks_frameWidths = {
        TopSelling_Stock: '640px',
    };

    // Update the frame widths when Record Purchase is visible
    if (isRecordPurchaseVisible) {
        for (const frame in TopSellingStocks_frameWidths) {
            TopSellingStocks_frameWidths[frame] = 'calc(' + TopSellingStocks_frameWidths[frame] + ' - 180px)';
        }
    }

    // Initial widths of the frames
    const LowQuantityStocks_frameWidths = {
        LowQuantity_Stock: '510px',
    };

    // Update the frame widths when Record Purchase is visible
    if (isRecordPurchaseVisible) {
        for (const frame in LowQuantityStocks_frameWidths) {
            LowQuantityStocks_frameWidths[frame] = 'calc(' + LowQuantityStocks_frameWidths[frame] + ' - 200px)';
        }
    }

    // Left margin for Low Quantity Stock
    const Stocks_frameMargins = {
        LowQuantity_Stock: '950px',
    };

    // Update the frame margin when Record Purchase is visible
    if (isRecordPurchaseVisible) {
        for (const frame in Stocks_frameMargins) {
            Stocks_frameMargins[frame] = 'calc(' + Stocks_frameMargins[frame] + ' - 185px)';
        }
    }

    const openTransactionDetailsPage = async (code) => {
        try {
            const response = await fetch(baseURL + `/transactions/records/detail/${code.replace(/\//g, 's').substring(1)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSelectedTransaction(data);
                setIsTransactionDetailsPageVisible(true);
            } else {
                // Handle error if needed
                console.error('Failed to fetch transaction details');
            }
        } catch (error) {
            // Handle fetch error if needed
            console.error('Error during fetch:', error);
        }
        setIsTransactionDetailsPageVisible(true)
    };

    const closeTransactionDetailsPage = () => {
        setIsTransactionDetailsPageVisible(false)
    };
  
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedPurchaseProduct, setSelectedPurchaseProduct] = useState('');
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const [supplier, setSupplier] = useState('');
    const [buyingPrice, setBuyingPrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [quantityBought, setQuantityBought] = useState('');
    const [dateDelivered, setDateDelivered] = useState('');
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [paymentPlatform, setPaymentPlatform] = useState('');

    const handleProductChange = (event) => {
        setSelectedPurchaseProduct(event.target.value);
    };    

    const handleAddProduct = () => {
        if (selectedPurchaseProduct && supplier && buyingPrice && quantityBought) {
            const selectedProduct = products.find(product => product.product_code === selectedPurchaseProduct);
            if (selectedProduct) {
                const newProduct = {
                    product: selectedPurchaseProduct,
                    product_name: selectedProduct.product_name, // Include product name
                    supplier: purchasedProducts.length === 0 ? supplier : purchasedProducts[0].supplier,
                    buyingPrice: buyingPrice,
                    quantityBought: quantityBought,
                    sellingPrice: sellingPrice
                };
                setPurchasedProducts([...purchasedProducts, newProduct]);
                // Reset form fields except for supplier
                setBuyingPrice('');
                setQuantityBought('');
                setSellingPrice('');
                setSelectedPurchaseProduct('');
            }
        }
    };    
    
    const [products, setProducts] = useState([]);
    // const { authTokens } = useContext(AuthContext);
    
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(baseURL + '/inventory/products/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                console.error('Failed to fetch products:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching products:', error.message);
        }
    };
    
    const handleCancelEdit = () => {
        setEditingProduct(null);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setSupplier(product.supplier);
        setBuyingPrice(product.buyingPrice);
        setSellingPrice(product.sellingPrice);
        setQuantityBought(product.quantityBought);
    };

    const handleSaveEdit = () => {
        // Save the edited product details temporarily
        if (editingProduct) {
            const updatedProducts = purchasedProducts.map(product => {
                if (product.product === editingProduct.product) {
                    return {
                        ...product,
                        supplier: supplier,
                        buyingPrice: buyingPrice,
                        sellingPrice: sellingPrice,
                        quantityBought: quantityBought
                    };
                }
                return product;
            });
            // Once saved, clear the editing state
            setPurchasedProducts(updatedProducts);
            setEditingProduct(null);
            setSelectedPurchaseProduct('');
            setSupplier('');
            setBuyingPrice('');
            setSellingPrice('');
            setQuantityBought('');
        }
    };

    const calculateTransactionAmount = () => {
        // Calculate the total transaction amount based on purchasedProducts
        return purchasedProducts.reduce((totalAmount, product) => {
            // Convert buying price and quantity bought to numbers
            const buyingPrice = parseFloat(product.buyingPrice);
            const quantityBought = parseInt(product.quantityBought);
    
            // Calculate the subtotal for the current product
            const subtotal = buyingPrice * quantityBought;
    
            // Add the subtotal to the total amount
            return totalAmount + subtotal;
        }, 0); // Initial value of totalAmount is 0
    };    

    const handleRecordPurchase = async (event) => {
        event.preventDefault();
    
        try {
            const transactionResponse = await fetch(`${baseURL}/transactions/records/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access),
                },
                body: JSON.stringify({
                    transaction_type: "PO",
                    paid_through: paymentPlatform ? 'MM' : 'SH',
                    transaction_status: paymentComplete ? 'CMP' : 'ICMP',
                    transaction_party: supplier,
                    transaction_date: dateDelivered || null,
                    transaction_amount: calculateTransactionAmount(),
                    transactions: purchasedProducts.map(product => ({
                        product: product.product, // Assuming product.productId contains the primary key (pk) value
                        quantity_affected: parseInt(product.quantityBought),
                        unit_price: product.buyingPrice,
                        transaction_value: product.buyingPrice * parseInt(product.quantityBought),
                    })),
                    inventory: purchasedProducts.inventory, // Pass the primary key (pk) value for the inventory
                }),
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    return (
        <div className={`Purchase ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="Sidebar">
                <div className="BizRahisi">BizRahisi</div>
                <div className="Administrator">Administrator</div>
                <div className="Navigation_Buttons">
                    <div className={`Dashboard_Button ${activeSection === 'dashboard' ? 'active' : ''}`}>
                        <button type="button" onClick={() => handleNavigation('dashboard')}>
                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.91016 21.8635H5.91016C4.81016 21.8635 3.91016 20.9635 3.91016 19.8635V5.86353C3.91016 4.76353 4.81016 3.86353 5.91016 3.86353H9.91016C11.0102 3.86353 11.9102 4.76353 11.9102 5.86353V19.8635C11.9102 20.9635 11.0102 21.8635 9.91016 21.8635ZM15.9102 21.8635H19.9102C21.0102 21.8635 21.9102 20.9635 21.9102 19.8635V14.8635C21.9102 13.7635 21.0102 12.8635 19.9102 12.8635H15.9102C14.8102 12.8635 13.9102 13.7635 13.9102 14.8635V19.8635C13.9102 20.9635 14.8102 21.8635 15.9102 21.8635ZM21.9102 8.86353V5.86353C21.9102 4.76353 21.0102 3.86353 19.9102 3.86353H15.9102C14.8102 3.86353 13.9102 4.76353 13.9102 5.86353V8.86353C13.9102 9.96353 14.8102 10.8635 15.9102 10.8635H19.9102C21.0102 10.8635 21.9102 9.96353 21.9102 8.86353Z" fill="#99B2C6"/>
                            </svg>
                            Dashboard
                        </button>
                    </div>
                    <div className={`POS_Button ${activeSection === 'pos' ? 'active' : ''}`}>
                        <button type="button" onClick={() => handleNavigation('pos')}>
                            <svg width="15" height="15" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M20.2075 18.9963C20.0536 19.3547 19.7823 19.4853 19.3946 19.4754C18.6392 19.4566 17.8835 19.4702 17.1277 19.4695C16.67 19.469 16.4193 19.2202 16.4193 18.764C16.4186 15.5248 16.4186 12.2851 16.4193 9.04498C16.4193 8.58829 16.6683 8.34125 17.1281 8.34034C17.8838 8.33981 18.6396 8.35365 19.395 8.33466C19.7828 8.32472 20.054 8.45535 20.2077 8.81371C20.2075 12.2084 20.2075 15.6025 20.2075 18.9962L20.2075 18.9963Z" fill="#99B2C6"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M20.2077 5.06432C20.1166 5.18981 20.0481 5.34582 19.9295 5.4351C19.5424 5.72672 19.003 5.46545 18.9459 4.97205C18.8769 4.37818 18.8108 3.78377 18.7024 3.15419C18.6871 3.18685 18.6754 3.22182 18.6561 3.25199C16.5491 6.5327 13.687 8.96619 10.2411 10.7437C8.34725 11.7208 6.37554 12.4866 4.28697 12.9339C3.19134 13.1687 2.08521 13.3141 0.962592 13.3047C0.805338 13.3031 0.645594 13.296 0.491362 13.2672C0.231874 13.2193 0.0969794 13.0267 0.000593185 12.8001V12.4845C0.172583 12.1136 0.458511 12.0135 0.862131 12.028C1.96471 12.0667 3.05412 11.9181 4.12439 11.6619C8.55136 10.6023 12.4113 8.5334 15.551 5.19839C16.3509 4.34912 17.0531 3.42224 17.6716 2.43221C17.7093 2.37169 17.7432 2.30832 17.7948 2.21762C17.7204 2.23165 17.6727 2.23715 17.6264 2.25028C16.9697 2.43683 16.3147 2.62993 15.6568 2.80957C15.1715 2.94216 14.7625 2.58718 14.8369 2.10652C14.8769 1.84703 15.0352 1.67646 15.2822 1.6053C16.5183 1.24854 17.7556 0.894613 18.9944 0.547654C19.3695 0.44258 19.7291 0.700119 19.7743 1.09381C19.9085 2.24928 20.0377 3.40525 20.1705 4.56072C20.1758 4.61131 20.195 4.6603 20.2076 4.70981C20.2072 4.82785 20.2072 4.94605 20.2072 5.06444L20.2077 5.06432Z" fill="#99B2C6"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.000168823 15.6808C0.153343 15.3217 0.423305 15.1909 0.81218 15.2017C1.57326 15.2212 2.33556 15.2065 3.09718 15.2076C3.53629 15.2083 3.78905 15.4671 3.78905 15.9099C3.78923 16.8621 3.78959 17.814 3.78852 18.7664C3.78834 19.2187 3.53453 19.4689 3.07802 19.47C2.3228 19.4705 1.56741 19.4572 0.812374 19.4753C0.425625 19.4842 0.153169 19.356 0 18.9962C0.000177478 17.891 0.000168823 16.7862 0.000168823 15.6808Z" fill="#99B2C6"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.7314 15.7598C14.7314 16.7463 14.7314 17.7333 14.7312 18.7198C14.7311 19.2368 14.5005 19.4691 13.989 19.4697C13.2126 19.4697 12.4367 19.4702 11.6605 19.4691C11.1928 19.4686 10.9429 19.2192 10.9429 18.7487C10.9418 16.7495 10.9413 14.7495 10.9427 12.7506C10.9429 12.3088 11.2035 12.0498 11.641 12.0498C12.4303 12.0493 13.2195 12.0482 14.0088 12.05C14.4934 12.0505 14.7317 12.2917 14.7319 12.7798C14.733 13.7728 14.7321 14.7668 14.7321 15.7597H14.7314L14.7314 15.7598Z" fill="#99B2C6"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.47582 16.9193C5.47582 16.3079 5.47458 15.6963 5.476 15.085C5.47724 14.6425 5.73052 14.3894 6.17496 14.3883C6.95717 14.3866 7.73955 14.386 8.52207 14.3883C9.01675 14.3899 9.26506 14.6383 9.26538 15.1276C9.26556 16.3241 9.26556 17.5207 9.26467 18.7172C9.26414 19.2296 9.02648 19.4694 8.51991 19.4699C7.73752 19.4699 6.955 19.4709 6.1728 19.4693C5.7257 19.4686 5.4772 19.22 5.47615 18.7739C5.47473 18.1554 5.47582 17.5375 5.47582 16.9193Z" fill="#99B2C6"/>
                            </svg>
                            POS
                        </button>
                    </div>
                    <div className={`Purchase_Button ${activeSection === 'purchase' ? 'active' : ''}`}>
                        <button type="button" onClick={() => handleNavigation('purchase')}>
                            <svg width="19" height="19" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_1_200)">
                                    <path d="M21.5356 3.95557H4.34811C3.93371 3.95557 3.53629 4.12019 3.24326 4.41321C2.95023 4.70624 2.78561 5.10367 2.78561 5.51807V19.5806C2.78561 19.995 2.95023 20.3924 3.24326 20.6854C3.53629 20.9784 3.93371 21.1431 4.34811 21.1431H21.5356C21.95 21.1431 22.3474 20.9784 22.6405 20.6854C22.9335 20.3924 23.0981 19.995 23.0981 19.5806V5.51807C23.0981 5.10367 22.9335 4.70624 22.6405 4.41321C22.3474 4.12019 21.95 3.95557 21.5356 3.95557ZM12.9419 13.3306C11.6987 13.3306 10.5064 12.8367 9.6273 11.9576C8.74822 11.0786 8.25436 9.88627 8.25436 8.64307C8.25436 8.43587 8.33667 8.23715 8.48319 8.09064C8.6297 7.94413 8.82841 7.86182 9.03561 7.86182C9.24281 7.86182 9.44153 7.94413 9.58804 8.09064C9.73455 8.23715 9.81686 8.43587 9.81686 8.64307C9.81686 9.47187 10.1461 10.2667 10.7322 10.8528C11.3182 11.4388 12.1131 11.7681 12.9419 11.7681C13.7707 11.7681 14.5655 11.4388 15.1516 10.8528C15.7376 10.2667 16.0669 9.47187 16.0669 8.64307C16.0669 8.43587 16.1492 8.23715 16.2957 8.09064C16.4422 7.94413 16.6409 7.86182 16.8481 7.86182C17.0553 7.86182 17.254 7.94413 17.4005 8.09064C17.5471 8.23715 17.6294 8.43587 17.6294 8.64307C17.6294 9.88627 17.1355 11.0786 16.2564 11.9576C15.3774 12.8367 14.1851 13.3306 12.9419 13.3306Z" fill="#99B2C6"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_1_200">
                                        <rect width="25" height="21" fill="white" transform="translate(0 0.5)"/>
                                    </clipPath>
                                </defs>
                            </svg>
                            Purchase
                        </button>
                    </div>
                    <div className={`Transactions_Button ${activeSection === 'transactions' ? 'active' : ''}`}>
                        <button type="button" onClick={() => handleNavigation('transactions')}>
                            <svg width="19" height="19" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.4375 13C9.51494 13 10.5483 12.572 11.3101 11.8101C12.072 11.0483 12.5 10.0149 12.5 8.9375C12.5 7.86006 12.072 6.82675 11.3101 6.06488C10.5483 5.30301 9.51494 4.875 8.4375 4.875C7.36006 4.875 6.32675 5.30301 5.56488 6.06488C4.80301 6.82675 4.375 7.86006 4.375 8.9375C4.375 10.0149 4.80301 11.0483 5.56488 11.8101C6.32675 12.572 7.36006 13 8.4375 13ZM15.5463 19.4313C16.2088 19.7025 17.0512 19.875 18.1237 19.875C23.1237 19.875 23.1238 16.125 23.1238 16.125C23.1238 15.6279 22.9264 15.1512 22.575 14.7996C22.2237 14.448 21.7471 14.2503 21.25 14.25H15.465C15.9562 14.845 16.2513 15.6062 16.2513 16.4375V16.8825C16.2487 16.9878 16.2416 17.0929 16.23 17.1975C16.1457 17.9785 15.9128 18.7365 15.5463 19.4313ZM21.25 9.875C21.25 10.7038 20.9208 11.4987 20.3347 12.0847C19.7487 12.6708 18.9538 13 18.125 13C17.2962 13 16.5013 12.6708 15.9153 12.0847C15.3292 11.4987 15 10.7038 15 9.875C15 9.0462 15.3292 8.25134 15.9153 7.66529C16.5013 7.07924 17.2962 6.75 18.125 6.75C18.9538 6.75 19.7487 7.07924 20.3347 7.66529C20.9208 8.25134 21.25 9.0462 21.25 9.875ZM1.875 16.75C1.875 16.087 2.13839 15.4511 2.60723 14.9822C3.07607 14.5134 3.71196 14.25 4.375 14.25H12.5C13.163 14.25 13.7989 14.5134 14.2678 14.9822C14.7366 15.4511 15 16.087 15 16.75C15 16.75 15 21.75 8.4375 21.75C1.875 21.75 1.875 16.75 1.875 16.75ZM16.25 16.8825L16.2463 16.9625L16.2487 16.8825H16.25Z" fill="#99B2C6"/>
                            </svg>
                            Transactions
                        </button>
                    </div>
                    <div className={`Inventory_Button ${activeSection === 'inventory' ? 'active' : ''}`}>
                        <button type="button" onClick={() => handleNavigation('inventory')}>
                            <svg width="19" height="" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 16V8C10 7.46957 10.2107 6.96086 10.5858 6.58579C10.9609 6.21071 11.4696 6 12 6H21V5C21 3.9 20.1 3 19 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C20.1 21 21 20.1 21 19V18H12C11.4696 18 10.9609 17.7893 10.5858 17.4142C10.2107 17.0391 10 16.5304 10 16ZM13 8C12.45 8 12 8.45 12 9V15C12 15.55 12.45 16 13 16H22V8H13ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="#99B2C6"/>
                            </svg>
                            Inventory
                        </button>
                    </div>
                </div>
                <div className="Account">Account</div>
                <div className="Account_Buttons">
                    <div className={`Profile_Button ${activeSection === 'profile' ? 'active' : ''}`}>
                        <button type="button" onClick={() => handleNavigation('profile')}>
                            <svg width="17" height="17" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 9.19999C11.1139 9.19999 12.1822 8.75749 12.9699 7.96984C13.7575 7.18218 14.2 6.1139 14.2 4.99999C14.2 3.88608 13.7575 2.81779 12.9699 2.03014C12.1822 1.24249 11.1139 0.799988 10 0.799988C8.88609 0.799988 7.81781 1.24249 7.03015 2.03014C6.2425 2.81779 5.8 3.88608 5.8 4.99999C5.8 6.1139 6.2425 7.18218 7.03015 7.96984C7.81781 8.75749 8.88609 9.19999 10 9.19999ZM0.851 18.2902C0.721032 18.6376 0.706693 19.0176 0.810116 19.3738C0.913539 19.73 1.1292 20.0432 1.425 20.267C3.87687 22.1725 6.89477 23.2047 10 23.2C13.234 23.2 16.2132 22.1024 18.5834 20.26C19.1854 19.7938 19.429 18.9958 19.1546 18.286C18.4437 16.4352 17.1884 14.8435 15.5542 13.7209C13.9201 12.5983 11.984 11.9976 10.0014 11.998C8.01876 11.9985 6.08291 12.6001 4.44927 13.7234C2.81564 14.8468 1.56102 16.4391 0.851 18.2902Z" fill="#99B2C6"/>
                            </svg>
                            Profile
                        </button>
                    </div>
                    <div className={`Settings_Button ${activeSection === 'settings' ? 'active' : ''}`}>
                        <button type="button" onClick={() => handleNavigation('profile')}>
                            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_1_222)">
                                    <path d="M11.078 1.82514e-06C11.372 1.82514e-06 11.635 0.183002 11.734 0.457002L12.44 2.414C12.693 2.477 12.91 2.54 13.094 2.606C13.295 2.678 13.554 2.787 13.874 2.936L15.518 2.066C15.6522 1.99491 15.8058 1.96925 15.9558 1.99287C16.1058 2.01649 16.2441 2.08811 16.35 2.197L17.796 3.692C17.988 3.891 18.042 4.182 17.934 4.436L17.163 6.243C17.291 6.478 17.393 6.679 17.471 6.847C17.555 7.03 17.659 7.282 17.783 7.607L19.58 8.377C19.85 8.492 20.017 8.762 19.999 9.051L19.867 11.126C19.858 11.2608 19.8096 11.39 19.7278 11.4975C19.646 11.6051 19.5345 11.6863 19.407 11.731L17.705 12.336C17.656 12.571 17.605 12.772 17.551 12.942C17.4639 13.2045 17.3645 13.4628 17.253 13.716L18.108 15.606C18.1683 15.7388 18.1846 15.8874 18.1544 16.0301C18.1241 16.1728 18.049 16.3021 17.94 16.399L16.314 17.851C16.2069 17.9462 16.0733 18.0064 15.931 18.0236C15.7888 18.0408 15.6446 18.014 15.518 17.947L13.842 17.059C13.5798 17.1978 13.3093 17.3204 13.032 17.426L12.3 17.7L11.65 19.5C11.6018 19.6318 11.5149 19.746 11.4007 19.8276C11.2865 19.9091 11.1503 19.9542 11.01 19.957L9.11 20C8.96596 20.0038 8.82429 19.9628 8.70449 19.8828C8.58468 19.8027 8.49263 19.6875 8.441 19.553L7.675 17.526C7.41365 17.4367 7.15488 17.34 6.899 17.236C6.68971 17.1454 6.48359 17.0477 6.281 16.943L4.381 17.755C4.25581 17.8084 4.11779 17.8243 3.98374 17.8007C3.8497 17.7771 3.7254 17.715 3.626 17.622L2.22 16.303C2.11532 16.2052 2.04403 16.077 2.01622 15.9365C1.9884 15.796 2.00547 15.6503 2.065 15.52L2.882 13.74C2.77334 13.5292 2.67261 13.3144 2.58 13.096C2.4719 12.8287 2.37186 12.5583 2.28 12.285L0.489999 11.74C0.3445 11.696 0.217594 11.6052 0.128989 11.4817C0.0403845 11.3582 -0.00495942 11.2089 -6.49161e-07 11.057L0.0699994 9.136C0.0749819 9.01066 0.114136 8.88907 0.183227 8.78438C0.252319 8.67968 0.348718 8.59587 0.461999 8.542L2.34 7.64C2.427 7.321 2.503 7.073 2.57 6.892C2.66434 6.65025 2.76911 6.41269 2.884 6.18L2.07 4.46C2.00822 4.32938 1.98947 4.18254 2.01642 4.04059C2.04337 3.89864 2.11465 3.76889 2.22 3.67L3.624 2.344C3.72242 2.25117 3.84557 2.18876 3.97863 2.16428C4.11168 2.1398 4.24898 2.15429 4.374 2.206L6.272 2.99C6.482 2.85 6.672 2.737 6.844 2.646C7.049 2.537 7.323 2.423 7.668 2.3L8.328 0.459002C8.37679 0.32427 8.46598 0.207883 8.58339 0.125733C8.7008 0.0435827 8.8407 -0.000326251 8.984 1.82514e-06H11.078ZM10.024 7.019C8.357 7.019 7.006 8.354 7.006 10.002C7.006 11.65 8.357 12.986 10.024 12.986C11.69 12.986 13.041 11.65 13.041 10.002C13.041 8.354 11.691 7.019 10.024 7.019Z" fill="#99B2C6"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_1_222">
                                        <rect width="20" height="20" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                            Settings
                        </button>
                    </div>
                </div>
                <div className="Mode_Selection">
                    <div className="ri_Sun_Fill">
                        {/* Icon for ri_Sun_Fill */}
                    </div>
                    <label className="Switch_Label">
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={toggleDarkMode}
                            className="Switch_Input"
                        />
                        <div className="Slider"></div>
                    </label>
                    <div className="ic_Sharp_Dark_Mode">
                        {/* Icon for ic_Sharp_Dark_Mode */}
                    </div>
                </div>
                <div className="Copyright">
                    <div className="Vaadin_Copyright">
                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_2_264)">
                            <path d="M8.48564 1.83104C12.0823 1.83104 14.9795 4.60145 14.9795 8.04059C14.9795 11.4797 12.0823 14.2501 8.48564 14.2501C4.88903 14.2501 1.99175 11.4797 1.99175 8.04059C1.99175 4.60145 4.88903 1.83104 8.48564 1.83104ZM8.48564 0.398071C4.08978 0.398071 0.493164 3.8372 0.493164 8.04059C0.493164 12.244 4.08978 15.6831 8.48564 15.6831C12.8815 15.6831 16.4781 12.244 16.4781 8.04059C16.4781 3.8372 12.8815 0.398071 8.48564 0.398071Z" fill="#99B2C6"/>
                            <path d="M10.384 10.2378C9.88444 10.62 9.1851 10.9066 8.48576 10.9066C6.78736 10.9066 5.48858 9.66465 5.48858 8.04061C5.48858 6.41658 6.78736 5.17467 8.48576 5.17467C9.28501 5.17467 10.0843 5.46127 10.5838 6.03445L11.6828 4.98361C10.8835 4.21936 9.68463 3.7417 8.48576 3.7417C5.98811 3.7417 3.98999 5.65233 3.98999 8.04061C3.98999 10.4289 5.98811 12.3395 8.48576 12.3395C9.58473 12.3395 10.4839 11.9574 11.2831 11.3842L10.384 10.2378Z" fill="#99B2C6"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_2_264">
                            <rect width="15.985" height="15.285" fill="white" transform="translate(0.493164 0.398071)"/>
                            </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div className="Copyright_BizRahisi">Copyright BizRahisi 2024</div>
                </div>
            </div>

            <div className="Top_Content">
                <div className="Search_Bar">
                    <div className="Search">Search</div>
                    <div className="ri_search_line">
                        <svg width="17" height="20" viewBox="0 0 33 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.3638 18.117L23.6468 22.399L22.2318 23.814L17.9498 19.531C16.3565 20.8082 14.3748 21.5029 12.3328 21.5C7.36476 21.5 3.33276 17.468 3.33276 12.5C3.33276 7.532 7.36476 3.5 12.3328 3.5C17.3008 3.5 21.3328 7.532 21.3328 12.5C21.3357 14.542 20.641 16.5237 19.3638 18.117ZM17.3578 17.375C18.6269 16.0699 19.3356 14.3204 19.3328 12.5C19.3328 8.632 16.1998 5.5 12.3328 5.5C8.46476 5.5 5.33276 8.632 5.33276 12.5C5.33276 16.367 8.46476 19.5 12.3328 19.5C14.1532 19.5029 15.9026 18.7941 17.2078 17.525L17.3578 17.375Z" fill="#B8B8B8"/>
                        </svg>
                    </div>
                </div>
                <div className="Date_Time">
                    {currentDateTime.toLocaleString()}
                </div>
                <div className="Notifications_Bar">
                    <div className="ion_notifications">
                        <svg width="20" height="20" viewBox="0 0 22 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.3177 18.332C21.2237 18.2187 21.1313 18.1054 21.0407 17.9961C19.7946 16.4889 19.0407 15.5793 19.0407 11.3125C19.0407 9.10355 18.5123 7.29105 17.4706 5.93168C16.7026 4.92744 15.6644 4.16563 14.2959 3.60262C14.2783 3.59282 14.2626 3.57997 14.2495 3.56467C13.7573 1.91643 12.4104 0.8125 10.8913 0.8125C9.37217 0.8125 8.02582 1.91643 7.53362 3.56297C7.52048 3.57771 7.50497 3.59015 7.48774 3.59979C4.29434 4.91441 2.74238 7.43662 2.74238 11.3108C2.74238 15.5793 1.98963 16.4889 0.742405 17.9944C0.65178 18.1038 0.559455 18.2148 0.465432 18.3303C0.222557 18.6232 0.0686763 18.9796 0.0220001 19.3572C-0.0246761 19.7348 0.0378063 20.1179 0.202053 20.4611C0.551526 21.1975 1.29635 21.6546 2.14653 21.6546H19.6422C20.4885 21.6546 21.2282 21.198 21.5788 20.4651C21.7437 20.1218 21.8068 19.7384 21.7605 19.3603C21.7143 18.9823 21.5606 18.6254 21.3177 18.332ZM10.8913 26.1875C11.7097 26.1868 12.5128 25.9647 13.2152 25.5445C13.9176 25.1244 14.4933 24.522 14.881 23.8012C14.8993 23.7667 14.9083 23.728 14.9072 23.6889C14.9061 23.6499 14.8949 23.6118 14.8748 23.5783C14.8546 23.5448 14.8261 23.5172 14.7921 23.498C14.758 23.4788 14.7196 23.4687 14.6805 23.4688H7.10315C7.06402 23.4686 7.02553 23.4786 6.99142 23.4978C6.9573 23.5169 6.92873 23.5446 6.90848 23.5781C6.88824 23.6115 6.87701 23.6497 6.87588 23.6888C6.87476 23.7279 6.88378 23.7666 6.90207 23.8012C7.2898 24.5219 7.86533 25.1243 8.56765 25.5444C9.26997 25.9645 10.0729 26.1867 10.8913 26.1875Z" fill="black"/>
                        </svg>
                    </div>
                </div>
                <div className="Avatar">
                    {/* Business Avatar */}
                </div>
            </div>

            <button 
                className="Record_Purchase_Button"
                onClick={toggleRecordPurchase}
            >
                Record Purchase
            </button>

            <div className="Frame_Container">
                <div className="Purchase_Overview" style={{ width: Purchase_frameWidths.Purchase_Overview }}>
                    <div className="PurchaseOverviewContent">
                        <h2>Purchase Overview</h2>
                        <div className="Transaction_Info">
                            <div className="Transaction_Text">
                                <div className="Transaction_Logo">
                                    <svg width="20" height="20" viewBox="0 0 30 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.29289 26.1673C7.68342 26.5579 8.31658 26.5579 8.70711 26.1673L15.0711 19.8034C15.4616 19.4129 15.4616 18.7797 15.0711 18.3892C14.6805 17.9986 14.0474 17.9986 13.6569 18.3892L8 24.046L2.34315 18.3892C1.95262 17.9986 1.31946 17.9986 0.928932 18.3892C0.538408 18.7797 0.538408 19.4129 0.928932 19.8034L7.29289 26.1673ZM7 6.31738L7 25.4602H9L9 6.31738H7Z" fill="#34A853"/>
                                        <path d="M23.2071 0.292843C22.8166 -0.097681 22.1834 -0.097681 21.7929 0.292843L15.4289 6.65681C15.0384 7.04733 15.0384 7.68049 15.4289 8.07102C15.8195 8.46154 16.4526 8.46154 16.8431 8.07102L22.5 2.41416L28.1569 8.07102C28.5474 8.46154 29.1805 8.46154 29.5711 8.07102C29.9616 7.68049 29.9616 7.04733 29.5711 6.65681L23.2071 0.292843ZM23.5 21.2063L23.5 0.99995L21.5 0.99995L21.5 21.2063L23.5 21.2063Z" fill="#34A853"/>
                                    </svg>
                                </div>
                                <div className="Transaction_Count">{transactionStats.purchase_transactions} Transactions</div>
                            </div>
                        </div>

                        <div className="Supplier_Info">
                            <div className="Supplier_Text">
                                <div className="Supplier_Logo">
                                    <svg width="20" height="20" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.9999 0C7.1778 0 0 7.40224 0 16.5002C0 20.568 1.43749 24.2935 3.81247 27.173C3.84288 27.2213 3.87776 27.267 3.9185 27.3091C3.92771 27.3186 3.93803 27.3246 3.94724 27.3335C6.88278 30.8022 11.1958 33 16 33C20.8042 33 25.1171 30.8022 28.0528 27.3335C28.062 27.3249 28.0729 27.3183 28.0815 27.3091C28.1222 27.2671 28.1574 27.2207 28.1875 27.173C30.5625 24.2932 32 20.5676 32 16.5002C32 7.40224 24.8219 0 15.9999 0ZM15.9999 31.3503C11.9106 31.3503 8.21708 29.5807 5.59353 26.7485L6.68952 25.6182C7.74837 24.5265 9.15571 23.9252 10.6521 23.9252H21.3478C22.8441 23.9252 24.2515 24.5265 25.3101 25.6179L26.4061 26.7482C23.7827 29.5804 20.0893 31.3503 15.9999 31.3503ZM27.4498 25.4913L26.4414 24.4515C25.0807 23.0481 23.2718 22.275 21.3478 22.275H10.6521C8.728 22.275 6.91945 23.0481 5.55867 24.4515L4.55032 25.4913C2.70126 22.9938 1.59999 19.8775 1.59999 16.5002C1.59999 8.31203 8.05951 1.65009 15.9999 1.65009C23.9398 1.65009 30.3998 8.31159 30.3998 16.5002C30.3998 19.8778 29.2986 22.9939 27.4498 25.4913ZM15.9999 7.42514C12.4712 7.42514 9.59978 10.386 9.59978 14.0254C9.59978 17.6644 12.4708 20.6256 15.9999 20.6256C19.5286 20.6256 22.4 17.6647 22.4 14.0254C22.4 10.386 19.5286 7.42514 15.9999 7.42514ZM15.9999 18.9753C13.3531 18.9753 11.2 16.7547 11.2 14.0253C11.2 11.2958 13.3532 9.07531 15.9999 9.07531C18.6466 9.07531 20.7998 11.2958 20.7998 14.0253C20.7998 16.7548 18.6466 18.9753 15.9999 18.9753Z" fill="#34A853"/>
                                    </svg>
                                </div>
                                <div className="Supplier_Count">{transactionStats.suppliers_number} Suppliers</div>
                            </div>
                        </div>

                        <div className="CostOfGoods_Info">
                            <div className="CostOfGoods_Text">
                                <div className="CostOfGoodsLogo">
                                    <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M23.2579 8.47911C23.2217 8.15261 22.9676 7.89851 22.6411 7.89851H19.6295C19.6295 5.21341 17.4161 3 14.731 3C12.0458 3 9.83245 5.17719 9.83245 7.89851H6.82085C6.49435 7.89851 6.24024 8.15262 6.20405 8.47911L4.75281 24.6619V24.7345C4.75281 26.5488 6.42201 28 8.45387 28H21.0082C23.0401 28 24.7093 26.5488 24.7093 24.7345V24.6619L23.2579 8.47911ZM14.7311 4.27007C16.7268 4.27007 18.3595 5.9028 18.3595 7.8985H11.1026C11.1026 5.90306 12.7354 4.27007 14.7311 4.27007ZM21.0082 26.7663H8.45381C7.11135 26.7663 6.02276 25.8592 5.9866 24.7706L7.36547 9.16839H9.83267V11.3456C9.83267 11.6721 10.123 11.9624 10.4495 11.9624C10.776 11.9624 11.0663 11.6721 11.0663 11.3456V9.16839H18.3594V11.3456C18.3594 11.6721 18.6497 11.9624 18.9762 11.9624C19.3027 11.9624 19.593 11.6721 19.593 11.3456V9.16839H22.0602L23.4391 24.7706C23.4393 25.8592 22.351 26.7663 21.0083 26.7663H21.0082Z" fill="#34A853"/>
                                    </svg>
                                </div>
                                <div className="CostOfGoods_Amount">Ksh {transactionStats.cost_of_goods_sold} Cost of Goods Sold</div>
                            </div>
                        </div>

                        <div className="Restock_Info">
                            <div className="Restock_Text">
                                <div className="Restock_Logo">
                                    <svg width="20" height="20" viewBox="0 0 38 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M37.8614 14.9103C37.3963 17.6131 35.7551 20.1506 33.1609 22.179C30.5665 24.2071 27.1443 25.6282 23.3579 26.2494C19.5714 26.8706 15.6036 26.662 11.9915 25.6519C8.37992 24.6421 5.29914 22.8792 3.16664 20.6026V22.5357C3.16664 22.9318 2.86482 23.2977 2.37498 23.4956C1.88514 23.6935 1.28149 23.6935 0.791659 23.4956C0.301826 23.2977 0 22.9318 0 22.5357V18.8414C0.0010602 18.1559 0.39088 17.4985 1.08326 17.0137C1.77596 16.5288 2.71498 16.2561 3.69429 16.2554H8.97226C9.53773 16.2554 10.0604 16.4666 10.3431 16.8095C10.6262 17.1524 10.6262 17.575 10.3431 17.9179C10.0604 18.2607 9.5377 18.472 8.97226 18.472H5.02771C6.59864 20.5595 9.08146 22.2411 12.1134 23.2714C15.1458 24.3019 18.569 24.6271 21.8838 24.1999C25.1986 23.7726 28.2316 22.6151 30.5409 20.8962C32.8498 19.1773 34.314 16.9871 34.7194 14.6448C34.7872 14.252 35.1491 13.9143 35.669 13.7589C36.1892 13.6036 36.7879 13.654 37.2399 13.8915C37.6923 14.129 37.9293 14.5174 37.8614 14.9103ZM36.4162 2.9556C35.9964 2.9556 35.5938 3.07237 35.297 3.28018C34.9997 3.48798 34.8329 3.77002 34.8329 4.06392V5.99703C32.7004 3.72028 29.6197 1.9576 26.0077 0.947505C22.3961 -0.0623359 18.4283 -0.270891 14.6422 0.350296C10.8556 0.971502 7.43347 2.39252 4.83918 4.42088C2.24507 6.44899 0.603843 8.98654 0.138709 11.6896C0.0881699 11.9813 0.205505 12.2752 0.464564 12.5064C0.723622 12.7378 1.10319 12.8874 1.51987 12.9228C1.58348 12.928 1.64746 12.9305 1.71178 12.9307C2.09841 12.9302 2.47127 12.8308 2.76039 12.6512C3.04948 12.4713 3.23432 12.2239 3.28062 11.955C3.68599 9.61272 5.1502 7.42254 7.45913 5.70363C9.76834 3.98471 12.8014 2.82718 16.1162 2.39994C19.4313 1.97269 22.8545 2.29801 25.8866 3.3284C28.9186 4.35882 31.4014 6.04031 32.9723 8.12782H29.0277C28.4623 8.12782 27.9396 8.33909 27.6569 8.68198C27.3738 9.02487 27.3738 9.44742 27.6569 9.7903C27.9396 10.1332 28.4623 10.3445 29.0277 10.3445H34.3057C35.285 10.3437 36.2241 10.0711 36.9167 9.58618C37.6091 9.10129 37.9989 8.44398 38 7.75846V4.06414C38 3.77024 37.8332 3.4882 37.536 3.28039C37.2391 3.07259 36.8365 2.95581 36.4167 2.95581L36.4162 2.9556Z" fill="#34A853"/>
                                    </svg>
                                </div>
                                <div className="Restock_Number"> {inventoryStats.restock_recommended} Items Restock Recommended</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Middle_Frames">
                    <div className="TopSelling_Stock" style={{ width: TopSellingStocks_frameWidths.TopSelling_Stock }}>
                        {/* Table of Top Selling Stock */}
                        <h2>Top Selling Stock</h2>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="sticky-header">Name</th>
                                        <th className="sticky-header">Sold Quantity</th>
                                        <th className="sticky-header">Remaining Quantity</th>
                                        <th className="sticky-header">Price</th>
                                        <th className="sticky-header">Last Stocked</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topStock.map((item) => (
                                        <tr key={item.product_id} className="TopSelling_Row">
                                            <td>{item.product_name}</td>
                                            <td>{item.quantity_sold}</td>
                                            <td>{item.quantity_remaining}</td>
                                            <td>{item.selling_price}</td>
                                            <td>{item.last_stocked}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="LowQuantity_Stock" style={{ width: LowQuantityStocks_frameWidths.LowQuantity_Stock, left: Stocks_frameMargins.LowQuantity_Stock }}>
                        {/* Low Quantity Table */}
                        <h2>Low Quantity Stock</h2>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="sticky-header"></th>
                                        <th className="sticky-header"></th>
                                        <th className="sticky-header">Last Stocked</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productsRestock.map((item) => (
                                        <tr key={item.product_id} className="LowQuantity_Row">
                                            <td><img src={baseURL+item.product_image} alt={''} width="60" height="60" /></td>
                                            <td><strong>{item.product_name}</strong><br />Remaining Quantity: {item.product_quantity} </td>
                                            <td>{item.product_date_added}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="Purchase_History" style={{ width: Purchase_frameWidths.Purchase_History }}>
                    {/* Table of Purchase History */}
                    <h2>Purchase History</h2>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th className="sticky-header">Reference</th>
                                    <th className="sticky-header">To</th>
                                    <th className="sticky-header">Date</th>
                                    <th className="sticky-header">Amount</th>
                                    <th className="sticky-header">Paid through</th>
                                    <th className="sticky-header">Status</th>
                                    <th className="sticky-header">Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchaseData.map((item) => (
                                    <tr key={item.code} className="PurchaseHistory_Row">
                                        <td>{item.code}</td>
                                        <td>{item.transaction_party}</td>
                                        <td>{item.transaction_date}</td>
                                        <td className="Amount">Ksh {item.transaction_amount}</td>
                                        <td>{item.paid_through}</td>
                                        <td className="Status">{item.transaction_status}</td>
                                        <td>
                                            <button className="Option" onClick={() => openTransactionDetailsPage (item.code) }>
                                            Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <TransactionDetails
                        isVisible={isTransactionDetailsPageVisible}
                        onClose={closeTransactionDetailsPage}
                        details={selectedTransaction}
                    />
                </div>
                
                
                <div className={`Record_Purchase ${isRecordPurchaseVisible ? 'Visible' : ''}`}>
                    <h2>Record Purchase</h2>
                    {/* Dropdown to select product from inventory */}
                    <div className="SelectProduct_Input_Group">
                        <label>Select Product</label>
                        <div className="SelectProductInput">
                            <select value={selectedPurchaseProduct} onChange={handleProductChange}>
                                <option value="">Select Product</option>    
                                {/* Render options dynamically from inventory */}
                                {products.map(product => {
                                    // Check if the product is not already selected or edited
                                    const isSelectedOrEdited = purchasedProducts.some(p => p.product === product.product_code);
                                    if (!isSelectedOrEdited) {
                                        return (
                                            <option key={product.product_code} value={product.product_code}>
                                                {product.product_name}
                                            </option>
                                        );
                                    }
                                    return null; // Exclude already selected or edited products
                                })}
                            </select>
                        </div>
                    </div>
                    {/* Display list of purchased products */}
                    {purchasedProducts.length > 0 && (
                        <div className="Purchased_Products">
                            <h3>Purchased Products</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Quantity Added</th>
                                        <th>Buying Price</th>
                                        <th>Selling Price</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchasedProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td>{product.product_name}</td>
                                            <td>{product.quantityBought}</td>
                                            <td>{product.buyingPrice}</td>
                                            <td>{product.sellingPrice}</td>
                                            <td>
                                                <button onClick={() => handleEditProduct(product)}>Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}


                    {/* Form for adding product details */}
                    {selectedPurchaseProduct && !editingProduct && (
                        <form className="Record_Purchase_Form">
                            <div className="Input_Group">
                                <label>Supplier</label>
                                <div className="Input">
                                    <input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
                                </div>
                            </div>
                            <div className="Input_Group">
                                <label>Buying Price</label>
                                <div className="Input">
                                    <input type="number" value={buyingPrice} onChange={(e) => setBuyingPrice(e.target.value)} />
                                </div>
                            </div>
                            <div className="Input_Group">
                                <label>Selling Price</label>
                                <div className="Input">
                                    <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
                                </div>
                            </div>
                            <div className="Input_Group">
                                <label>Quantity Bought</label>
                                <div className="Input">
                                    <input type="number" value={quantityBought} onChange={(e) => setQuantityBought(e.target.value)} />
                                </div>
                            </div>
                            <div className="Submit_Button">
                                <button type="button" onClick={handleAddProduct}>Add Product</button>
                            </div>
                        </form>
                    )}
                    {editingProduct && (
                        <form className="Record_Purchase_Form">
                            <form className="Record_Purchase_Form">
                            <div className="Input_Group">
                                <label>Supplier</label>
                                <div className="Input">
                                    <input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
                                </div>
                            </div>
                            <div className="Input_Group">
                                <label>Buying Price</label>
                                <div className="Input">
                                    <input type="number" value={buyingPrice} onChange={(e) => setBuyingPrice(e.target.value)} />
                                </div>
                            </div>
                            <div className="Input_Group">
                                <label>Selling Price</label>
                                <div className="Input">
                                    <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
                                </div>
                            </div>
                            <div className="Input_Group">
                                <label>Quantity Bought</label>
                                <div className="Input">
                                    <input type="number" value={quantityBought} onChange={(e) => setQuantityBought(e.target.value)} />
                                </div>
                            </div>
                            <div className="Submit_Button">
                                <button type="button" onClick={handleAddProduct}>Add Product</button>
                            </div>
                        </form>
                            <div className="Submit_Button">
                                <button type="button" onClick={handleSaveEdit}>Save</button>
                                <button type="button" onClick={handleCancelEdit}>Cancel</button>
                            </div>
                    </form>
                    )}
                    {/* Remaining form fields */}
                    <form className="Record_Purchase_Form" onSubmit={handleRecordPurchase}>
                        {/* Input fields for payment completion, date delivered, and payment platform */}
                        <div className="DateDeliveredInput_Group">
                            <label>Date Delivered</label>
                            <div className="DateDeliveredInput">
                                <input type="datetime-local" value={dateDelivered} onChange={(e) => setDateDelivered(e.target.value)} />
                            </div>
                        </div>
                        <div className="PaymentCompleteInput_Group">
                            <label>Payment Complete</label>
                            <div className="PaymentCompleteInput">
                                <input type="checkbox" checked={paymentComplete} onChange={(e) => setPaymentComplete(e.target.checked)} />
                            </div>
                        </div>
                        <div className="PaymentPlatformInput_Group">
                            <label>Payment Platform</label>
                            <div className="PaymentPlatformInput">
                                <input type="text" value={paymentPlatform} onChange={(e) => setPaymentPlatform(e.target.value)} />
                            </div>
                        </div>
                        <div className="Submit_Button">
                            <button type="submit" onClick={handleRecordPurchase}>Record Purchase</button>
                            <button type="button" onClick={handleCancelEdit}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Purchase;