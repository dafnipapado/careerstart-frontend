import {useAuth} from "@/context/AuthProvider.tsx";
import {Navigate, Outlet} from "react-router";
import NotFoundErrorPage from "../pages/NotFoundErrorPage.tsx";

const ProtectedRoute = ({allowedRoles} : { allowedRoles?: string[] }) => {
    const { isAuthenticated, role } = useAuth();

    if(!isAuthenticated) {
        return <Navigate to="/login"/>
    }

    //redirect unauthorized users, after role verification
    if (allowedRoles && !allowedRoles.includes(role!) && role !== "ADMIN") {
        return <NotFoundErrorPage/>;
    }

    return <Outlet/>
}

export default ProtectedRoute;