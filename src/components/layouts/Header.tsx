import {Link} from "react-router";
import {AuthButton} from "../shared/AuthButton.tsx";
import {useAuth} from "@/context/AuthProvider.tsx";

const Header = () => {

    const {role} = useAuth();

    return (
        <>
            {/*<div className="fixed w-full h-13 top-0 left-0 flex justify-center bg-secondary-light-purple z-50">*/}


            {/*</div>*/}
            <header className="fixed w-full h-30 left-0 flex justify-center bg-surface px-8 z-50">
                <div className="w-[60%] flex items-center justify-between">
                    <Link to="/">
                        <h1 className="lobster-two-regular-italic text-6xl w-70">CareerStart</h1>
                    </Link>
                    <div className="flex items-end py-auto">
                        <nav className="w-100 flex justify-end pr-3">
                            {role !== "ADMIN"
                            ?
                             <div className="flex pt-5 gap-5 text-xl font-semibold">
                                <Link to="/job-listings">Browse job listings</Link>
                                 {role === "JOB_SEEKER"
                                 ? <Link to="/job_seeker/my-applications">My job applications</Link>
                                 : <Link to="/employer/create-joblisting">Post a job listing</Link>
                                 }
                             </div>
                            :
                             <div className="flex pt-5 gap-5 text-xl font-semibold">
                                <Link to="/admin/dashboard/employers">Employers</Link>
                                <Link to="/admin/dashboard/jobseekers">Job Seekers</Link>
                                <Link to="/admin/dashboard/job-listings">Job Listings</Link>
                             </div>
                            }
                        </nav>
                        <div className="w-[20%] flex justify-end items-end mt-3">
                            <AuthButton/>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;