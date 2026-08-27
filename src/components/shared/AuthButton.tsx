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
    ? <CustomButton label="Logout" addClasses="bg-font-dark-purple hover:bg-hover-dark-purple text-white rounded-sm p-2 w-1/12" onClick={handleLogout}></CustomButton>
    : <CustomButton label="Login" addClasses="bg-font-dark-purple hover:bg-hover-dark-purple text-white rounded-sm p-2 w-1/12" onClick={handleLogin}></CustomButton>
}