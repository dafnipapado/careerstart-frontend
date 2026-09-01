import {useAuth} from "@/context/AuthProvider.tsx";
import {Outlet, useLocation, useNavigate} from "react-router";
import {useEffect} from "react";

const PublicRoute = () => {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate(location.state?.from ?? `/${role?.toLowerCase()}/dashboard`, {replace: true})
        }
    }, [isAuthenticated, role, location.state, navigate]);


    return <Outlet/>
}

export default PublicRoute;

