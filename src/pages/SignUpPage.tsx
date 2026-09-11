import {Building2, UserRound} from "lucide-react";
import {Link} from "react-router";

const SignUpPage = () => {
    return (
        <>
            <div className="w-4/5 h-[60vh] mx-auto my-auto bg-white p-5 mt-12 border border-gray-200 rounded-sm grid grid-cols-2 items-center">
                <Link to="/register-jobseeker" className="h-[45vh] flex justify-center items-center flex-col
                border border-primary-dark-purple rounded-sm m-5 duration-300 ease-in-out shadow-xs shadow-primary-dark-purple
                hover:scale-[0.98] hover:shadow-xl">
                    <UserRound size={70} color="#4f0341" strokeWidth={1} />
                    <h1 className="font-sans font-semibold text-2xl text-primary-dark-purple">Sign Up as a Job Seeker</h1>
                </Link>
                <Link to="/register-employer" className="h-[45vh] flex justify-center items-center flex-col border border-primary-dark-purple
                  rounded-sm m-5 duration-300 ease-in-out shadow-xs shadow-primary-dark-purple hover:scale-[0.98] hover:shadow-xl">
                    <Building2 size={70} color="#4f0341" strokeWidth={1} />
                    <h1 className="font-sans font-semibold text-2xl text-primary-dark-purple">Sign Up as an Employer</h1>
                </Link>
            </div>
        </>
    )
}

export default SignUpPage