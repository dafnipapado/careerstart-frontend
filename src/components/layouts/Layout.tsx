import Header from "@/components/layouts/Header.tsx";
import {Outlet} from "react-router";

const Layout = () => {
    return(
        <>
        <Header/>
        <main className="container mx-auto pt-28 pb-10">
            <Outlet/>
        </main>
        </>
    )
}

export default Layout