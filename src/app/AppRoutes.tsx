import {Route, Routes} from "react-router";
import HomePage from "@/pages/HomePage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import ProtectedRoute from "@/app/ProtectedRoute.tsx";
import EmployerDashboardPage from "../pages/employer/EmployerDashboardPage.tsx";
import PublicRoute from "@/app/PublicRoute.tsx";
import JobSeekerDashboardPage from "../pages/jobseeker/JobSeekerDashboardPage.tsx";
import Layout from "@/components/layouts/Layout.tsx";
import EmployerSignUpPage from "@/pages/employer/EmployerSignUpPage.tsx";
import JobSeekerSignUpPage from "@/pages/jobseeker/JobSeekerSignUpPage.tsx";
import JobSeekerSettingsPage from "@/pages/jobseeker/JobSeekerSettingsPage.tsx";
import EmployerSettingsPage from "@/pages/employer/EmployerSettingsPage.tsx";
import JobListingCreatePage from "@/pages/joblisting/JobListingCreatePage.tsx";
import JobListingUpdatePage from "@/pages/joblisting/JobListingUpdatePage.tsx";
import JobListingViewPage from "@/pages/joblisting/JobListingViewPage.tsx";
import JobListingsPage from "@/pages/joblisting/JobListingsPage.tsx";
import CvCreatePage from "@/pages/cv/CvCreatePage.tsx";
import CvUpdatePage from "@/pages/cv/CvUpdatePage.tsx";
import JobSeekerApplicationsPage from "@/pages/jobseeker/JobSeekerApplicationsPage.tsx";

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
                            <Route path="dashboard" element={<EmployerDashboardPage/>}/>
                            <Route path="settings" element={<EmployerSettingsPage/>}/>
                            <Route path="create-joblisting" element={<JobListingCreatePage/>}/>
                            <Route path="job-listings/:uuid/edit" element={<JobListingUpdatePage/>}/>
                            <Route path="jobseeker/:uuid" element={<JobSeekerDashboardPage/>}/>
                        </Route>
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={["JOB_SEEKER"]}/>}>
                        <Route path="job_seeker">
                            <Route path="dashboard" element={<JobSeekerDashboardPage/>}/>
                            <Route path="settings" element={<JobSeekerSettingsPage/>}/>
                            <Route path="create-cv" element={<CvCreatePage/>} />
                            <Route path=":jobSeekerUuid/cv/edit" element={<CvUpdatePage/>}/>
                            <Route path="employer/:uuid" element={<EmployerDashboardPage/>}/>
                            <Route path="my-applications" element={<JobSeekerApplicationsPage/>} />
                        </Route>
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={["EMPLOYER", "JOB_SEEKER"]}/> }>
                        <Route path="job-listings">
                            <Route index element={<JobListingsPage/>}></Route>
                            <Route path=":uuid" element={<JobListingViewPage/>}></Route>
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    )
}

export default AppRoutes;