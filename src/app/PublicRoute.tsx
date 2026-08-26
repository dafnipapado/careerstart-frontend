import {useAuth} from "@/context/AuthProvider.tsx";
import {Outlet, useLocation, useNavigate} from "react-router";

const PublicRoute = () => {
    const { isAuthenticated } = useAuth();
    const role = useAuth().role?.toLowerCase();
    const location = useLocation();
    const navigate = useNavigate();

    if (isAuthenticated) {
        navigate(location.state?.from ?? `/${role}/dashboard`, {replace: true})
    }

    return <Outlet/>
}

export default PublicRoute;

