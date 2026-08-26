import {useAuth} from "@/context/AuthProvider.tsx";
import {Navigate, Outlet} from "react-router";
import ErrorPage from "@/pages/ErrorPage.tsx";

const ProtectedRoute = ({allowedRoles} : { allowedRoles?: string[] }) => {
    const { isAuthenticated, role } = useAuth();

    if(!isAuthenticated) {
        return <Navigate to="/login"/>
    }

    //redirect unauthorized users, after role verification
    if (allowedRoles && !allowedRoles.includes(role!) && role !== "ADMIN") {
        return <ErrorPage/>;
    }

    return <Outlet/>
}

export default ProtectedRoute;