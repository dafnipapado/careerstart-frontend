import {Link} from "react-router";
import {AuthButton} from "../shared/AuthButton.tsx";

const Header = () => {

    return (
        <>
            <div className="fixed w-full h-13 top-0 left-0 flex justify-center bg-black">
                <div className="w-[55%] flex justify-end items-center ">
                    <AuthButton/>
                </div>

            </div>
            <header className="fixed w-full h-30 left-0 flex justify-center bg-white px-8 py-4 mt-13">
                <div className="w-[55%] flex items-center justify-between">
                    <Link to="/">
                        <h1 className="lobster-two-regular-italic text-6xl text-font-dark-purple w-70">CareerStart</h1>
                    </Link>
                    <nav>
                         <div className="flex pt-5 gap-8 text-font-dark-purple text-xl font-semibold font-sans">
                            <Link to="/">Browse job listings</Link>
                            <Link to="/">Post a job listing</Link>
                         </div>
                    </nav>
                </div>
            </header>
        </>
    )
}

export default Header;