// LoginPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/css/LoginPage.css';
import Layer_1_2 from './assets/images/Layer_1_2.png';
import Layer_2_1 from './assets/images/Layer_2_1.png';
import AuthContext from '../context/AuthContext';



const LoginPage = () => {
    let {loginUser} = useContext(AuthContext)
    let {loginComplete} = useContext(AuthContext)
    let {error} = useContext(AuthContext)
    

    // Initialize the navigate function
    const navigate = useNavigate();

    const handleResetPassword = () => {
        //Password reset logic
        
    };

    const handleGoogleAuthentication = () => {
        //GoogleAuthentication logic
    };

    const handleRegistration = () => {
        //navigation to the registration page
        navigate('/');
    };

    return (
        <div className="Login_Light">
            <div className="Group_2397">
                <div className="Rectangle_5">
                    <div className="LoginPage_BizRahisi_Left">BizRahisi</div>
                    <div className="Login">Login to your account</div>
                    <div className="LoginPage_Form_Container">
                        <form onSubmit={loginUser}>
                            {error && <p className="error">{error}</p>}
                            {loginComplete && (
                                <p className="loginComplete">Login Successful!</p>
                            )}

                            <div className="LoginPage_Form_Group">
                                <div className="Your_Email">Your Email</div>
                                <div className="LoginPage_Frame_3914">
                                    <div className="material_symbols_mail_rounded">
                                        <svg width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 20.5C3.45 20.5 2.97933 20.3043 2.588 19.913C2.196 19.521 2 19.05 2 18.5V6.5C2 5.95 2.196 5.47933 2.588 5.088C2.97933 4.696 3.45 4.5 4 4.5H20C20.55 4.5 21.021 4.696 21.413 5.088C21.8043 5.47933 22 5.95 22 6.5V18.5C22 19.05 21.8043 19.521 21.413 19.913C21.021 20.3043 20.55 20.5 20 20.5H4ZM12 13.325C12.0833 13.325 12.1707 13.3123 12.262 13.287C12.354 13.2623 12.4417 13.225 12.525 13.175L19.6 8.75C19.7333 8.66667 19.8333 8.56267 19.9 8.438C19.9667 8.31267 20 8.175 20 8.025C20 7.69167 19.8583 7.44167 19.575 7.275C19.2917 7.10833 19 7.11667 18.7 7.3L12 11.5L5.3 7.3C5 7.11667 4.70833 7.11233 4.425 7.287C4.14167 7.46233 4 7.70833 4 8.025C4 8.19167 4.03333 8.33733 4.1 8.462C4.16667 8.58733 4.26667 8.68333 4.4 8.75L11.475 13.175C11.5583 13.225 11.646 13.2623 11.738 13.287C11.8293 13.3123 11.9167 13.325 12 13.325Z" fill="#B8B8B8"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Your Email"
                                        required
                                    />
                                </div>
                                <div className="Password">Password</div>
                                <div className="LoginPage_Frame_3915">
                                    <div className="material_symbols_lock">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 22.5C5.45 22.5 4.97933 22.3043 4.588 21.913C4.196 21.521 4 21.05 4 20.5V10.5C4 9.95 4.196 9.479 4.588 9.087C4.97933 8.69567 5.45 8.5 6 8.5H7V6.5C7 5.11667 7.48767 3.93733 8.463 2.962C9.43767 1.98733 10.6167 1.5 12 1.5C13.3833 1.5 14.5627 1.98733 15.538 2.962C16.5127 3.93733 17 5.11667 17 6.5V8.5H18C18.55 8.5 19.021 8.69567 19.413 9.087C19.8043 9.479 20 9.95 20 10.5V20.5C20 21.05 19.8043 21.521 19.413 21.913C19.021 22.3043 18.55 22.5 18 22.5H6ZM12 17.5C12.55 17.5 13.021 17.3043 13.413 16.913C13.8043 16.521 14 16.05 14 15.5C14 14.95 13.8043 14.479 13.413 14.087C13.021 13.6957 12.55 13.5 12 13.5C11.45 13.5 10.9793 13.6957 10.588 14.087C10.196 14.479 10 14.95 10 15.5C10 16.05 10.196 16.521 10.588 16.913C10.9793 17.3043 11.45 17.5 12 17.5ZM9 8.5H15V6.5C15 5.66667 14.7083 4.95833 14.125 4.375C13.5417 3.79167 12.8333 3.5 12 3.5C11.1667 3.5 10.4583 3.79167 9.875 4.375C9.29167 4.95833 9 5.66667 9 6.5V8.5Z" fill="#B8B8B8"/>
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Password"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <p className="forgotPassword">  
                                Forgot Password?{' '} 
                                <button onClick={handleResetPassword}>
                                    Reset Password
                                </button>
                            </p>
                            
                            <div className="LoginPage_Frame_3984">
                                <button type="submit" className="Login_Button">
                                    Login
                                </button>
                            </div>
                            
                            <p className="socialLogin">
                                or continue with {' '}
                                <button 
                                    type="button" 
                                    onClick={handleGoogleAuthentication}
                                    className="googleButton"
                                >
                                    Google
                                </button>
                            </p>

                            <p className="notRegistered">
                                Not registered yet?{' '} 
                                <button type="button"
                                onClick={handleRegistration}>
                                    Try Sign up
                                </button>
                            </p>
                        </form>

                        <div className="Group_4">
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
                                <div className="copyright">Copyright BizRahisi 2024</div>
                            </div> 
                        </div>
                    </div>
                </div>


                <div className="LoginPage_Frame_3983">
                    <div className="Layer_2_2_variant3">
                        <img src={Layer_1_2} alt="" className="Layer_1_2"/>
                    </div>
                    <div className="Layer_2_1_Default">
                        <img src={Layer_2_1} alt="" className="Layer_2_1" />
                    </div>
                    <div className="LoginPage_Group_3">
                        <div className="LoginPage_Group_2">
                            <svg width="90" height="50" viewBox="0 0 90 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.62559 40.6495C4.43208 34.638 4.43207 25.7274 9.62559 19.7159L17.9974 10.0256C21.0386 6.50535 25.4606 4.48196 30.1127 4.48196L59.8682 4.48195C64.5202 4.48195 68.9422 6.50535 71.9834 10.0256L80.3552 19.7159C85.5488 25.7274 85.5488 34.638 80.3552 40.6495L71.9835 50.3398C68.9422 53.8601 64.5202 55.8835 59.8682 55.8835L30.1127 55.8835C25.4606 55.8835 21.0386 53.8601 17.9974 50.3398L9.62559 40.6495Z" fill="#616161"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M30.0037 4.48168L35.6643 4.48168C40.3163 4.48168 44.7383 6.50507 47.7796 10.0253L56.1514 19.7156C61.3449 25.7271 61.3449 34.6377 56.1514 40.6492L47.7796 50.3395C44.7619 53.8325 40.3849 55.8517 35.7726 55.8828L30.1127 55.8828C25.4607 55.8828 21.0387 53.8594 17.9974 50.3392L9.62561 40.6488C4.43209 34.6374 4.43209 25.7268 9.6256 19.7153L17.9974 10.0249C21.0149 6.53219 25.3917 4.513 30.0037 4.48168Z" fill="white"/>
                            </svg>
                            <div className="LoginPage_BizRahisi_right">BizRahisi</div>
                        </div>
                        <div className="LoginPage_For_All_Your_Business_Needs">For all your business needs</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
