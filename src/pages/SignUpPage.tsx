import {Building2, UserRound} from "lucide-react";
import {Link} from "react-router";

const SignUpPage = () => {
    return (
        <>
            <div className="w-4/5 h-[60vh] bg-surface shadow-xl container-shadow rounded-sm grid grid-cols-2 items-center mx-auto my-auto mt-12 p-5">
                <Link to="/register-jobseeker"
                      className="h-[45vh] flex justify-center items-center flex-col
                        border border-primary-border rounded-sm m-5 duration-300 ease-in-out shadow-xs shadow-primary-border
                        hover:scale-[0.98] hover:shadow-xl">
                    <UserRound size={70} strokeWidth={1} className="text-primary" />
                    <h1 className="font-semibold text-2xl text-primary">Sign Up as a Job Seeker</h1>
                </Link>
                <Link to="/register-employer" className="h-[45vh] flex justify-center items-center flex-col border border-primary-border
                  rounded-sm m-5 duration-300 ease-in-out shadow-xs shadow-primary-border hover:scale-[0.98] hover:shadow-xl">
                    <Building2 size={70} strokeWidth={1} className="text-primary" />
                    <h1 className="font-semibold text-2xl text-primary">Sign Up as an Employer</h1>
                </Link>
            </div>
        </>
    )
}

export default SignUpPage