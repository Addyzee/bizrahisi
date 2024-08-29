import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'


const AuthContext = createContext()
const baseURL = import.meta.env.VITE_SERVER_URL;

export default AuthContext;


export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState( () => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState( () => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)
    
    const [loginComplete, setLoginComplete] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    let loginUser = async (e)=> {
        e.preventDefault()
        let response = await fetch(baseURL+'/user/login/', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'email':e.target.email.value, 'password':e.target.password.value})
        })

        let data = await response.json()
        console.log('data:',data)
        
        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            setLoginComplete(true)
            console.log('Login successful')
            navigate("/inventory")

        }else{
            console.log(response.status)
            setError('Login failed. Please try again.');
            setLoginComplete(false)
            alert('Something went wrong!')
        }
    }

    let updateToken = async ()=> {
        let response = await fetch(baseURL+'/user/token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh':authTokens?.refresh})
        })

        let data = await response.json()
        
        if (response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            logoutUser()
        }
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authtokens')
        navigate("/login")
    }

    let [userDetails, setuserDetails] = useState([])
    let [firstName, setFirstName] = useState([])
    let [businessName, setBusinessName] = useState([])

    useEffect(() => {
        if(authTokens){
        setuserDetails(getuserDetails())
        //setFirstName(userDetails.user.user_profile.first_name)
        console.log(userDetails)
        }
    },[])

    let getuserDetails = async () => {
        try {
        let response = await fetch(baseURL+'/user/user-details',{
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        });
        if (response.status == 200){
            let data = await response.json()
            setFirstName(data.user.user_profile.first_name)
            setBusinessName(data.user.user_profile.business_name)
            return data
        } else {
            if (window.location.href.indexOf('/login') === -1) {
                window.location.href = '/login';
            }
        }
        } catch (error){
            console.error('Error:', error)
            if (window.location.href.indexOf('/login') === -1) {
                window.location.href = '/login';
            }
        }
    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        firstName: firstName,
        businessName: businessName,

        loginComplete: loginComplete,
        error: error,

        loginUser: loginUser,
        logoutUser: logoutUser

    }

    useEffect(() => {
      let nineMinutes = 1000 * 60 * 5
      let interval = setInterval(() => {
            if(authTokens){
                updateToken()
            }
      }, nineMinutes)
      return () => clearInterval(interval)
    }, [authTokens, loading])


    return(
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    )
}