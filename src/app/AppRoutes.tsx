import {Route, Routes} from "react-router";
import HomePage from "@/pages/HomePage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import ProtectedRoute from "@/app/ProtectedRoute.tsx";
import EmployerDashboard from "@/pages/EmployerDashboard.tsx";
import PublicRoute from "@/app/PublicRoute.tsx";
import JobSeekerDashboard from "@/pages/JobSeekerDashboard.tsx";
import Layout from "@/components/layouts/Layout.tsx";

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route element={<Layout/>}>
                    <Route element={<PublicRoute/>}>
                        <Route index element={<HomePage/>}/>
                        <Route path="login" element={<LoginPage/>}/>
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={["EMPLOYER"]}/>}>
                        <Route path="employer">
                            <Route path="dashboard" element={<EmployerDashboard/>}/>
                        </Route>
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={["JOB_SEEKER"]}/>}>
                        <Route path="jobseeker">
                            <Route path="dashboard" element={<JobSeekerDashboard/>}/>
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    )
}

export default AppRoutes;