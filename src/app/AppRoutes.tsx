import {Route, Routes} from "react-router";
import HomePage from "@/pages/HomePage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import ProtectedRoute from "@/app/ProtectedRoute.tsx";
import EmployerDashboard from "../pages/employer/EmployerDashboard.tsx";
import PublicRoute from "@/app/PublicRoute.tsx";
import JobSeekerDashboard from "../pages/jobseeker/JobSeekerDashboard.tsx";
import Layout from "@/components/layouts/Layout.tsx";
import EmployerSignUpPage from "@/pages/employer/EmployerSignUpPage.tsx";
import JobSeekerSignUpPage from "@/pages/jobseeker/JobSeekerSignUpPage.tsx";

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route element={<Layout/>}>
                    <Route element={<PublicRoute/>}>
                        <Route index element={<HomePage/>}/>
                        <Route path="login" element={<LoginPage/>}/>
                        <Route path="register-employer" element={<EmployerSignUpPage/>}/>
                        <Route path="register-jobseeker" element={<JobSeekerSignUpPage/>}/>
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