import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './utils/PrivateRoute'


import LoginPage from './components/LoginPage'
import SignUpPage from './components/SignUpPage'
import Inventory  from './components/Inventory'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import POS from './components/POS'
import Purchase from './components/Purchase'



function App() {

  return (
    <Router>
      <div>
        <AuthProvider>
          <Routes>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            <Route exact path="/dashboard" element={<PrivateRoute/>} >
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>            

            <Route exact path='/pos' element={<PrivateRoute/>}>
              <Route exact path='/pos' element={<POS/>}/>
            </Route>
            
            <Route exact path='/inventory' element={<PrivateRoute/>}>
              <Route exact path='/inventory' element={<Inventory/>}/>
            </Route>

            <Route exact path='/transactions' element={<PrivateRoute/>}>
              <Route exact path='/transactions' element={<Transactions/>}/>
            </Route>

            <Route exact path='/purchase' element={<PrivateRoute/>}>
              <Route exact path='/purchase' element={<Purchase/>}/>
            </Route>  


          </Routes>
        </AuthProvider>
      </div>
    </Router>
      
  )
}

export default App
