import {useNavigate} from "react-router";
import {toast} from "sonner";
import {useAuth} from "@/context/AuthProvider.tsx";
import CustomButton from "@/components/shared/CustomButton.tsx";

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
    ? <CustomButton label="Logout" onClick={handleLogout}></CustomButton>
    : <CustomButton label="Login" onClick={handleLogin}></CustomButton>
}