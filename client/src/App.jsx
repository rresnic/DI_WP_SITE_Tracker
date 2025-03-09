import {Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./components/UserProfile";
import './App.css'
import AdminDash from "./components/AdminDash";
import Home from "./components/Home";
import PasswordReset from "./components/PasswordReset";
import ForgottenPassword from "./components/ForgottenPassword";

function App() {
  return (
  <>
    <div className="app">
      <Navbar/>
      <main className="container">
        <Routes>
          <Route path="/" element={<><Home/></>} />
          <Route path="/login" element={<><Login/></>} />
          <Route path="/register" element={<><Register/></>} />
          <Route path="/dashboard" element={<><ProtectedRoute><Dashboard/></ProtectedRoute></>} />
          <Route path="/profile" element={<><ProtectedRoute><UserProfile/></ProtectedRoute></>} />
          <Route path="/admin" element={<><ProtectedRoute><AdminDash/></ProtectedRoute></>} />
          <Route path="/password-reset" element={<><PasswordReset/></>}/>
          <Route path="/forgotten-password" element={<><ForgottenPassword/></>} />
        </Routes>
      </main>
    </div>
  </>
  )
}

export default App;