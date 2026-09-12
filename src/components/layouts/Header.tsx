import {Link} from "react-router";
import {AuthButton} from "../shared/AuthButton.tsx";
import {useAuth} from "@/context/AuthProvider.tsx";

const Header = () => {

    const {role} = useAuth();

    return (
        <>
            <div className="fixed w-full h-13 top-0 left-0 flex justify-center bg-secondary-light-purple z-50">
                <div className="w-[60%] flex justify-end items-center ">
                    <AuthButton/>
                </div>

            </div>
            <header className="fixed w-full h-30 left-0 flex justify-center bg-white px-8 mt-13 z-50">
                <div className="w-[60%] flex items-center justify-between">
                    <Link to="/">
                        <h1 className="lobster-two-regular-italic text-6xl text-primary-dark-purple w-70">CareerStart</h1>
                    </Link>
                    <nav>
                        {role !== "ADMIN"
                        ?
                         <div className="flex pt-5 gap-8 text-primary-dark-purple text-xl font-semibold font-sans">
                            <Link to="/job-listings">Browse job listings</Link>
                             {role === "JOB_SEEKER"
                             ? <Link to="/job_seeker/my-applications">My job applications</Link>
                             : <Link to="/employer/create-joblisting">Post a job listing</Link>
                             }
                         </div>
                        :
                         <div className="flex pt-5 gap-8 text-primary-dark-purple text-xl font-semibold font-sans">
                            <Link to="/admin/dashboard/employers">Employers</Link>
                            <Link to="/admin/dashboard/jobseekers">Job Seekers</Link>
                            <Link to="/admin/dashboard/job-listings">Job Listings</Link>
                         </div>
                        }
                    </nav>
                </div>
            </header>
        </>
    )
}

export default Header;