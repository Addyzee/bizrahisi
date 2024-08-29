// Inventory.jsx //
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/css/Inventory.css';
import AuthContext from '../context/AuthContext';
const baseURL = import.meta.env.VITE_SERVER_URL;



const Inventory = ({ inventory }) => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [activeSection, setActiveSection] = useState('inventory'); 
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [isAddProductVisible, setAddProductVisible] = useState(false);
    const [isProductDetailsVisible, setProductDetailsVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isChangesSaved, setIsChangesSaved] = useState(false);
    let { user } = useContext(AuthContext)

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
    
    // Event handler to toggle Add Product visibility
    const toggleAddProduct = () => {
        console.log("Add Button Clicked");
        setAddProductVisible(!isAddProductVisible);
        setProductDetailsVisible(false);
        setIsEditMode(false);
    };
     
    const [productData, setProductData] = useState({
        // product_code: '',
        product_name: '',
        product_image: null,
        product_category: '',
        product_quantity: '',
        product_unit: '',
        product_minimum_threshhold: '',
        product_selling_price: '',
    });

    const handleChange = (e) => {
        setProductData({
            ...productData,
            [e.target.id]: e.target.value,
        });
    };


    const handleImageChange = (e) => {
        const previewImage = document.getElementById("previewImage");
        const selectedImage = e.target.files[0];

        if (selectedImage) {
        
            const reader = new FileReader();

            reader.onload = (event) => {
                // Update the image preview
                previewImage.src = event.target.result;
            };


            reader.readAsDataURL(selectedImage);

            // Update the product data
            setProductData({
                ...productData,
                product_image: selectedImage,
            });
        } else {
            // Clear the image preview and product data if no file is selected
            previewImage.src = "";
            setProductData({
                ...productData,
                product_image: null,
            });
        }
    };


    const handleAddProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(productData).forEach(([key, value]) => {
            formData.append(key, value);            
        });



    let response = await fetch(baseURL+'/inventory/products-add/', {
        method: 'POST',
        headers: {
        'Authorization': 'Bearer ' + String(authTokens.access),
        },
        body: formData,
    })


        if (response.status === 201) {
            console.log('Product added')
            getProducts()
        }else{
            alert('Something went wrong!')
            console.log(productData)
        }
        // Update the inventory data state with the new item
        // setInventoryData((prevInventoryData) => [...prevInventoryData, newItem]);

        // Clear the form fields
        e.target.reset();
        // Close the "Add Product" section
        setAddProductVisible(false);
    };

    // Initial widths of the frames
    const InventoryData_frameWidths = {
        Inventory_Data: '1230px',
    };

    // Update the frame widths when the Add Product is visible
    if (isAddProductVisible) {
        for (const frame in InventoryData_frameWidths) {
            InventoryData_frameWidths[frame] = 'calc(' + InventoryData_frameWidths[frame] + ' - 400px)';
        }
    }

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    let [products, setProducts] = useState([])
    let {authTokens} = useContext(AuthContext)

    useEffect(() => {
        getProducts()
    },[])

    let getProducts = async()=>{
        let response = await fetch(baseURL+'/inventory/products/',{
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        setProducts(data)
        console.log(baseDIR)
        }

    // Filter inventory items based on search query
    const filteredInventory = products.filter((item) =>
        item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Event handler to toggle Product detail visibility
    const toggleProductDetails = (product) => {

        // Fetch product details only if product is defined
        if (product && product.product_code) {
            // If the details button is clicked for the same product, hide the details
            if (selectedProduct && selectedProduct.product_code === product.product_code) {
                setProductDetailsVisible(false);
                setSelectedProduct(null);
            } else {
                // Otherwise, show the details for the clicked product
                setSelectedProduct(product);
                getSelectedProduct(product.product_code);
                setProductDetailsVisible(true);
                setAddProductVisible(false);
            }
        
        } else {
            // If product is not defined, simply toggle the visibility
            // Toggle the visibility of the product details
            setProductDetailsVisible(!isProductDetailsVisible);
            setAddProductVisible(false);
        }
    };

    // Update the frame widths when the product details is visible
    if (isProductDetailsVisible) {
        for (const frame in InventoryData_frameWidths) {
            InventoryData_frameWidths[frame] = 'calc(' + InventoryData_frameWidths[frame] + ' - 400px)';
        }
    }

    let [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        getSelectedProduct(selectedProduct)
    },[selectedProduct])

    let getSelectedProduct = async (productCode) =>{
        console.log('Fetching product details for code:', productCode);

        let response = await fetch(baseURL+`/inventory/products/detail/${productCode}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',  
                'Authorization': 'Bearer ' + String(authTokens.access),
            },
        });


        if (response.ok) {
                let data = await response.json();
                setSelectedProduct(data);
                console.log("Is a success")
        } else {
            console.error('Error:: Failed to fetch product details');
        }
    };

    const [editedProduct, setEditedProduct] = useState({
        // Initialize with the selected product's values
        product_image: null,
        product_name: '',
        product_category: '',
        product_cost: '',
        product_selling_price: '',
        product_quantity: '',
        product_unit: '',
        product_minimum_threshhold: '',
        product_stock_level: '',
    });

    useEffect(() => {
        // Update the editedProduct state when selectedProduct changes
        setEditedProduct({
            // product_image: selectedProduct?.product_image || '',
            product_name: selectedProduct?.product_name || '',
            product_category: selectedProduct?.product_category || '',
            product_cost: selectedProduct?.product_cost || '',
            product_selling_price: selectedProduct?.product_selling_price || '',
            product_quantity: selectedProduct?.product_quantity || '',
            product_unit: selectedProduct?.product_unit || '',
            product_minimum_threshhold: selectedProduct?.product_minimum_threshhold || '',
            product_stock_level: selectedProduct?.product_stock_level || '',
        });
    }, [selectedProduct]);

    const handleEditChange = (e, field) => {
        setEditedProduct({
            ...editedProduct,
            [field]: e.target.value,
        });
    };
    const handleEditImage = (e) => {
    const previewImage = document.getElementById("existingImage");
    const selectedImage = e.target.files[0];
    
    console.log("selected image",selectedImage)

    if (selectedImage) {
        
        const reader = new FileReader();

        reader.onload = (event) => {
            // Update the image preview
            previewImage.src = event.target.result;
        };


        reader.readAsDataURL(selectedImage);

        // Update the product data
        setEditedProduct({
            ...editedProduct,
            product_image: selectedImage,
        });
    } 
};

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        console.log(e.target);

        try {
            const formData = new FormData();
            Object.entries(editedProduct).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const response = await fetch(baseURL + `inventory/products/detail/${selectedProduct.product_code}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + String(authTokens.access),
                },
                body: formData,
            });

            if (response.status === 200) {
                console.log('Changes saved successfully:', editedProduct);
                setIsChangesSaved(true); // Set isChangesSaved to true only if the save operation is successful

                setIsEditMode(false);
                await getSelectedProduct();
            } else {
                console.error('Failed to save changes:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving changes:', error.message);
        }
    };


    const confirmDelete = () => {
        const isConfirmed = window.confirm("Are you sure you want to delete this product?");
        if (isConfirmed) {
            handleDeleteProduct(selectedProduct);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            const response = await fetch(baseURL+`inventory/products/detail/${selectedProduct.product_code}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + String(authTokens.access),
                },
            });

            if (response.status === 204) {
                console.log('Product deleted successfully.');


            } else {
                console.error('Failed to delete product:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting product:', error.message);
        }
    };
 
    
    return (
        <div className={`Inventory ${darkMode ? 'dark-mode' : 'light-mode'}`}>
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
                                <path fillRule="evenodd" clipRule="evenodd" d="M20.2075 18.9963C20.0536 19.3547 19.7823 19.4853 19.3946 19.4754C18.6392 19.4566 17.8835 19.4702 17.1277 19.4695C16.67 19.469 16.4193 19.2202 16.4193 18.764C16.4186 15.5248 16.4186 12.2851 16.4193 9.04498C16.4193 8.58829 16.6683 8.34125 17.1281 8.34034C17.8838 8.33981 18.6396 8.35365 19.395 8.33466C19.7828 8.32472 20.054 8.45535 20.2077 8.81371C20.2075 12.2084 20.2075 15.6025 20.2075 18.9962L20.2075 18.9963Z" fill="#99B2C6"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M20.2077 5.06432C20.1166 5.18981 20.0481 5.34582 19.9295 5.4351C19.5424 5.72672 19.003 5.46545 18.9459 4.97205C18.8769 4.37818 18.8108 3.78377 18.7024 3.15419C18.6871 3.18685 18.6754 3.22182 18.6561 3.25199C16.5491 6.5327 13.687 8.96619 10.2411 10.7437C8.34725 11.7208 6.37554 12.4866 4.28697 12.9339C3.19134 13.1687 2.08521 13.3141 0.962592 13.3047C0.805338 13.3031 0.645594 13.296 0.491362 13.2672C0.231874 13.2193 0.0969794 13.0267 0.000593185 12.8001V12.4845C0.172583 12.1136 0.458511 12.0135 0.862131 12.028C1.96471 12.0667 3.05412 11.9181 4.12439 11.6619C8.55136 10.6023 12.4113 8.5334 15.551 5.19839C16.3509 4.34912 17.0531 3.42224 17.6716 2.43221C17.7093 2.37169 17.7432 2.30832 17.7948 2.21762C17.7204 2.23165 17.6727 2.23715 17.6264 2.25028C16.9697 2.43683 16.3147 2.62993 15.6568 2.80957C15.1715 2.94216 14.7625 2.58718 14.8369 2.10652C14.8769 1.84703 15.0352 1.67646 15.2822 1.6053C16.5183 1.24854 17.7556 0.894613 18.9944 0.547654C19.3695 0.44258 19.7291 0.700119 19.7743 1.09381C19.9085 2.24928 20.0377 3.40525 20.1705 4.56072C20.1758 4.61131 20.195 4.6603 20.2076 4.70981C20.2072 4.82785 20.2072 4.94605 20.2072 5.06444L20.2077 5.06432Z" fill="#99B2C6"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M0.000168823 15.6808C0.153343 15.3217 0.423305 15.1909 0.81218 15.2017C1.57326 15.2212 2.33556 15.2065 3.09718 15.2076C3.53629 15.2083 3.78905 15.4671 3.78905 15.9099C3.78923 16.8621 3.78959 17.814 3.78852 18.7664C3.78834 19.2187 3.53453 19.4689 3.07802 19.47C2.3228 19.4705 1.56741 19.4572 0.812374 19.4753C0.425625 19.4842 0.153169 19.356 0 18.9962C0.000177478 17.891 0.000168823 16.7862 0.000168823 15.6808Z" fill="#99B2C6"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M14.7314 15.7598C14.7314 16.7463 14.7314 17.7333 14.7312 18.7198C14.7311 19.2368 14.5005 19.4691 13.989 19.4697C13.2126 19.4697 12.4367 19.4702 11.6605 19.4691C11.1928 19.4686 10.9429 19.2192 10.9429 18.7487C10.9418 16.7495 10.9413 14.7495 10.9427 12.7506C10.9429 12.3088 11.2035 12.0498 11.641 12.0498C12.4303 12.0493 13.2195 12.0482 14.0088 12.05C14.4934 12.0505 14.7317 12.2917 14.7319 12.7798C14.733 13.7728 14.7321 14.7668 14.7321 15.7597H14.7314L14.7314 15.7598Z" fill="#99B2C6"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.47582 16.9193C5.47582 16.3079 5.47458 15.6963 5.476 15.085C5.47724 14.6425 5.73052 14.3894 6.17496 14.3883C6.95717 14.3866 7.73955 14.386 8.52207 14.3883C9.01675 14.3899 9.26506 14.6383 9.26538 15.1276C9.26556 16.3241 9.26556 17.5207 9.26467 18.7172C9.26414 19.2296 9.02648 19.4694 8.51991 19.4699C7.73752 19.4699 6.955 19.4709 6.1728 19.4693C5.7257 19.4686 5.4772 19.22 5.47615 18.7739C5.47473 18.1554 5.47582 17.5375 5.47582 16.9193Z" fill="#99B2C6"/>
                            </svg>
                            POS
                        </button>
                    </div>
                    <div className={`Purchase_Button ${activeSection === 'purchase' ? 'active' : ''}`}>
                        <button type="button" onClick={() => handleNavigation('purchase')}>
                            <svg width="19" height="19" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_1_200)">
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
                                <g clipPath="url(#clip0_1_222)">
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

            <div className="Inventory_Data" style={{ width: InventoryData_frameWidths.Inventory_Data }}>
                <h2>Inventory</h2>
                <div className="button_and_searchbar">
                    <button
                        className="Add_Product_Button"
                        onClick={toggleAddProduct}
                    >
                        Add Product
                    </button>
                    {/*Search Bar */}
                    <div className="Inventory_SearchBar">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search Product"
                        />
                    </div>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th className="sticky-header">Product ID</th>
                                <th className="sticky-header">Product Picture</th>
                                <th className="sticky-header">Product Name</th>
                                <th className="sticky-header">Category</th>
                                <th className="sticky-header">Quantity in stock</th>
                                <th className="sticky-header">Selling Price</th>
                                <th className="sticky-header">Stock Level</th>
                                <th className="sticky-header">Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchQuery !== '' ? (
                                // Render filtered inventory items
                                filteredInventory.map((item) => (
                                    <tr key={item.product_code} className="inventory">
                                        <td>{item.product_code}</td>
                                        <td><img src={baseDIR+item.product_image} width="30px" height="50px"></img></td>
                                        <td>{item.product_name}</td>
                                        <td className='Category'>{item.product_category}</td>
                                        <td>{item.product_quantity}</td>
                                        <td>Ksh {item.product_selling_price}</td>
                                        <td className="Stock_Level">
                                            <span className={`StockLevel ${item.product_stock_level === 'Below Threshhold' ? 'Green' : item.product_stock_level === 'Normal Level' ? 'Normal' : 'Gray'}`}>
                                                {item.product_stock_level}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="product_detail" type="button" onClick={() => toggleProductDetails(item)}>
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                // Render full inventory if search query is empty
                                products.map((product) => (
                                    <tr key={product.product_code} className="inventory">
                                        <td>{product.product_code}</td>
                                        <td><img src={baseURL+product.product_image} width="30px" height="30px"/></td>
                                        <td>{product.product_name}</td>
                                        <td className="Category">{product.product_category}</td>
                                        <td>{product.product_quantity}</td>
                                        <td>Ksh {product.product_selling_price}</td>
                                        <td className="Stock_Level">
                                            <span className={`StockLevel ${product.product_stock_level === 'Below Threshhold' ? 'Green' : product.product_stock_level === 'Normal Level' ? 'Normal' : 'Gray'}`}>
                                                {product.product_stock_level}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="product_detail" type="button" onClick={() => toggleProductDetails(product)}>
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={`Add_Product ${isAddProductVisible ? 'Visible' : ''}`}>
                {/* Content for Add Product */}
                <h2>Add Product</h2>
                <form className="Add_Product_Form" onSubmit={handleAddProduct}>
                    {/* Product Image Field */}
                    <div className="Product_Image">
                        <label htmlFor="ProductImage">Product Image:</label>
                        <div className="Image_Upload">
                            <div className="Image_Preview">
                                {/* Display Uploaded image here */}
                                <img src="" alt="Product Preview" id="previewImage" height="100px" width="100px"/>
                            </div>
                            <label htmlFor="product_image" className="Upload_Label">
                                <span className="Drag_Text">Drag image here</span>
                                <span className="Browse_Text">Or</span>
                                <span className="Browse_Link" >Browse image</span>
                                <input 
                                    type="file"
                                    id="product_image"
                                    name="product_image"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e)}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Product Name */}
                    <div className="Add_Product_Input_Group">
                        <label htmlFor="product_name">Product Name:</label>
                        <input type="text" id="product_name" name="product_name" onChange={(e) => handleChange(e)}/>
                    </div>

                    {/* Category */}
                    <div className="Add_Product_Input_Group">
                        <label htmlFor="product_category">Category:</label>
                        <input type="text" id="product_category" name="product_category" onChange={(e) => handleChange(e)}/>
                    </div>

                    {/* Buying Price */}
                    <div className="Add_Product_Input_Group">
                        <label htmlFor="product_buying_price">Cost/Buying Price:</label>
                        <input type="number" id="product_cost" name="product_cost" onChange={(e) => handleChange(e)}/>
                    </div>

                    {/* Selling Price */}
                    <div className="Add_Product_Input_Group">
                        <label htmlFor="product_selling_price">Selling Price:</label>
                        <input type="number" id="product_selling_price" name="product_selling_price" onChange={(e) => handleChange(e)}/>
                    </div>

                    {/* Quantity */}
                    <div className="Add_Product_Input_Group">
                        <label htmlFor="product_quantity">Quantity in stock:</label>
                        <input type="number" id="product_quantity" name="product_quantity" onChange={(e) => handleChange(e)}/>
                    </div>

                    {/* Unit */}
                    <div className="Add_Product_Input_Group">
                        <label htmlFor="product_unit">Unit eg. liters, KG:</label>
                        <input type="text" id="product_unit" name="product_unit" onChange={(e) => handleChange(e)}/>
                    </div>

                    {/* Threshold Value */}
                    <div className="Add_Product_Input_Group">
                        <label htmlFor="product_minimum_threshhold">Threshold Value:</label>
                        <input type="number" id="product_minimum_threshhold" name="product_minimum_threshhold" onChange={(e) => handleChange(e)}/>
                    </div>

                    {/* Submit Button */}
                    <div className="Submit_Button">
                        <button type="submit">Add</button>
                     </div>

                </form>
            </div>


            {isProductDetailsVisible && selectedProduct && (
                <div className={`Product_Details ${isProductDetailsVisible ? 'Visible' : ''} ${isEditMode ? 'EditMode' : ''}`}>
                    <div className="Heading_and_Close_Button">
                        <h2>{isEditMode ? 'Edit Product' : 'Product Details'}</h2>

                        <button type="button" onClick={() => setProductDetailsVisible(false)}>
                            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.296 0.379124C12.664 0.379124 12.976 0.523124 13.232 0.811124C13.504 1.09912 13.64 1.40312 13.64 1.72312C13.64 2.02712 13.536 2.31512 13.328 2.58712L8.504 8.94712L6.872 6.71512L11.12 1.07512C11.456 0.611124 11.848 0.379124 12.296 0.379124ZM1.592 0.331125C2.056 0.331125 2.448 0.539124 2.768 0.955124L13.328 14.9951C13.52 15.2511 13.616 15.5471 13.616 15.8831C13.616 16.3311 13.456 16.6831 13.136 16.9391C12.816 17.1951 12.496 17.3231 12.176 17.3231C11.712 17.3231 11.32 17.1151 11 16.6991L0.44 2.65912C0.232 2.40312 0.128 2.11512 0.128 1.79512C0.128 1.37912 0.28 1.03512 0.584 0.763124C0.904 0.475124 1.24 0.331125 1.592 0.331125ZM1.376 17.3231C1.024 17.3231 0.72 17.1951 0.464 16.9391C0.208 16.6671 0.08 16.3711 0.08 16.0511C0.08 15.6991 0.2 15.3711 0.44 15.0671L5.312 8.46712L6.896 10.7951L2.576 16.6511C2.256 17.0991 1.856 17.3231 1.376 17.3231Z" fill="black"/>
                            </svg>
                        </button>
                    </div>

                    {/* Display Product Details here */}

                    <form className="Product_Details_Form" onSubmit={handleSaveEdit} >
                        {selectedProduct && (
                            <>
                                <div className="Product_Image">
                                    <div className="Image_Upload">
                                        <div className="Image_Preview">
                                            {/* Display Product image here */}
                                            <img src={baseURL+selectedProduct.product_image} id="existingImage" alt="Product Image" height="100px" width="100px"/>
                                        </div>
                                        {isEditMode && (
                                            <label htmlFor="product_image" className="Upload_Label">
                                                <span className="Drag_Text">Drag image here</span>
                                                <span className="Browse_Text">Or</span>
                                                <span className="Browse_Link" >Browse image</span>
                                                <input 
                                                    type="file"
                                                    id="product_image"
                                                    name="product_image"
                                                    accept="image/*"
                                                    onChange={(e) => handleEditImage(e)}
                                                    disabled={!isEditMode} 
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="Buttons">
                                    {!isEditMode && (
                                        <>
                                            <button type="button" onClick={() => setIsEditMode(true)}>
                                                Edit Product
                                            </button>
                                            <button type="button" onClick={confirmDelete}>
                                                Delete Product
                                            </button>
                                        </>
                                    )}
                                </div>

                                <div className="Product_Details_Input_Group">
                                    <label htmlFor='product_code'>Product Code:</label>
                                    <p>{selectedProduct.product_code}</p>
                                </div>

                                <div className="Product_Details_Input_Group">
                                    <label htmlFor='product_name'>Product Name:</label> 
                                    <input type="text" id="product_name" name="product_name" value={editedProduct.product_name} onChange={(e) => handleEditChange(e, 'product_name')} disabled={!isEditMode} className={` ${isEditMode ? "EditMode" : ""}`}/>
                                </div>

                                <div className="Product_Details_Input_Group">
                                    <label htmlFor='product_name'>Product Category:</label> 
                                    <input type="text" id="product_category" name="product_category" value={editedProduct.product_category} onChange={(e) => handleEditChange(e, 'product_category')} disabled={!isEditMode} className={` ${isEditMode ? "EditMode" : ""}`}/>
                                </div>

                                <div className="Product_Details_Input_Group">
                                    <label htmlFor='product_name'>Buying Price:</label> 
                                    <input type="text" id="product_cost" name="product_cost" value={editedProduct.product_cost} onChange={(e) => handleEditChange(e, 'product_cost')} disabled={!isEditMode} className={` ${isEditMode ? "EditMode" : ""}`}/>
                                </div>

                                <div className="Product_Details_Input_Group">
                                    <label htmlFor='product_name'>selling Price:</label> 
                                    <input type="text" id="product_selling_price" name="product_selling_price" value={editedProduct.product_selling_price} onChange={(e) => handleEditChange(e, 'product_selling_price')} disabled={!isEditMode} className={` ${isEditMode ? "EditMode" : ""}`}/>
                                </div>

                                <div className="Product_Details_Input_Group">
                                    <label htmlFor='product_name'>Product Quantity:</label> 
                                    <input type="text" id="product_quantity" name="product_quantity" value={editedProduct.product_quantity} onChange={(e) => handleEditChange(e, 'product_quantity')} disabled={!isEditMode} className={` ${isEditMode ? "EditMode" : ""}`}/>
                                </div>

                                <div className="Product_Details_Input_Group">
                                    <label htmlFor='product_name'>Product Unit:</label> 
                                    <input type="text" id="product_unit" name="product_unit" value={editedProduct.product_unit} onChange={(e) => handleEditChange(e, 'product_unit')} disabled={!isEditMode} className={` ${isEditMode ? "EditMode" : ""}`}/>
                                </div>

                                <div className="Product_Details_Input_Group">
                                    <label htmlFor='product_name'>Minimum Threshold:</label> 
                                    <input type="text" id="product_minimum_threshhold" name="product_minmum_threshhold" value={editedProduct.product_minimum_threshhold} onChange={(e) => handleEditChange(e, 'product_minimum_threshhold')} disabled={!isEditMode} className={` ${isEditMode ? "EditMode" : ""}`}/>
                                </div>

                                <div className="Product_Details_Input_Group">
                                    <label htmlFor='product_name'>Stock Level:</label> 
                                    <p>{editedProduct.product_stock_level}</p>
                                </div>

                                {isEditMode && (
                                    <div className="Buttons">
                                        <button type="submit">
                                            Save Changes
                                        </button>
                                        <button type="button" onClick={() => setIsEditMode(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </>
                        )}    
                    </form>
                    {isChangesSaved && <div className="Success_Message">Changes saved successfully</div>}
                </div>   
            )}
        </div>
    );
};

export default Inventory;