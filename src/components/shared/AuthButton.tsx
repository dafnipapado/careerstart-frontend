import {useNavigate} from "react-router";
import {toast} from "sonner";
import {useAuth} from "@/context/AuthProvider.tsx";
import CustomButtonLight from "@/components/shared/CustomButtonLight.tsx";

export function AuthButton() {
    
    const { isAuthenticated, logoutUser } = useAuth();
    const navigate = useNavigate();
    
    
    const handleLogin = () => {
        navigate("/login");
    }
    
    const handleLogout = () => {
        logoutUser()
        toast.success("Logged out successfully")
        navigate("/login")
    }
    
    return isAuthenticated 
    ? <CustomButtonLight label="Logout" onClick={handleLogout}></CustomButtonLight>
    : <CustomButtonLight label="Login" onClick={handleLogin}></CustomButtonLight>
}