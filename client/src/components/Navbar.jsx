import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/userAuth";
import UserProfile from "./UserProfile";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

const Navbar = () => {
    const navigate = useNavigate()
    const {logout, isAuthenticated, user} = useAuth();
    const handleLogout = async() => {
        try {
            await axios.post(
                `${apiBaseUrl}/api/users/logout`,
                {},
                {withCredentials: true}
            );
            logout();
            navigate("/login")
        } catch (error) {
            console.log(error)
        }
        
    }
    return (
        <>
            <nav>
                <div style={{display:"flex", gap:"10px"}}>
                    <Link to={"/"}>Home</Link>
                    {!isAuthenticated && (
                            <>
                                <Link to={"/login"}>Login</Link>
                                <Link to={"/register"}>Register</Link>
                            </>
                        )
                    }
                    
                    
                    { isAuthenticated && <Link to={"/dashboard"}>Dashboard</Link>
                    } 
                    { isAuthenticated && user.role =="admin" && <Link to={"/admin"}>Admin</Link>}
                    { isAuthenticated && (<button onClick={handleLogout}>Logout</button>)}
                    <Link to={"/profile"}>Profile</Link>
                    </div>
            </nav>
        </>
    )
}
export default Navbar;