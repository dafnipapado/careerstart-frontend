import defaultUserPicture from "../../assets/images/default-user-picture.png";
import {useEffect, useState} from "react";
import {getLoggedInEmployerDetails} from "@/api/employer.ts";
import type {EmployerReadDetails} from "@/schemas/employer.ts";
import {Factory, MapPin, Settings, SquareArrowOutUpRight} from "lucide-react";
import {Link} from "react-router";
import {Separator} from "@/components/ui/separator.tsx";

const EmployerDashboardPage = () => {

    const [employerInfo, setEmployerInfo] = useState<EmployerReadDetails | null>(null)

    useEffect(() => {
        const fetchEmployer = async () => {
            setEmployerInfo(await getLoggedInEmployerDetails())
        }
        void fetchEmployer()
    }, []);

    return (
        <>
            {/*banner*/}
            <div className="relative bg-font-dark-purple w-full h-50 top-0">
                <Link to="/employer/settings" className="flex p-2 m-2">
                    <Settings strokeWidth={1.25} className="text-white border rounded-sm ml-auto w-9 h-9 p-1 cursor-pointer duration-300 ease-in-out opacity-90 hover:opacity-60  hover:scale-[0.98]"/>
                </Link>
                <img className="absolute w-40 h-40 border border-black rounded-3xl left-15 -bottom-20" src={defaultUserPicture} alt="user picture" />
                <div className="absolute w-fit left-60 -bottom-5 font-sans font-semibold text-3xl text-white">
                    <h1 className="">{employerInfo?.brandName}</h1>
                </div>
                <div className="absolute left-60 -bottom-17 flex flex-col gap-2 font-medium items-start">
                    <span className="flex items-center gap-1"><Factory strokeWidth={1.25}  />  {employerInfo?.professionalFieldName}</span>
                    <span className="flex items-center gap-1"><MapPin strokeWidth={1.25} />{employerInfo?.personalInfoDetailsReadOnlyDTO.regionName}</span>
                </div>
                {employerInfo?.website && (
                    <div className="absolute right-4 -bottom-13 border border-font-dark-purple rounded-md p-2 duration-300 ease-in-out hover:scale-[0.98]">
                        <a href={`${employerInfo?.website}`} target="_blank" rel="noopener noreferrer">
                            <span className="flex items-center gap-1">Visit our website<SquareArrowOutUpRight size={16} /></span>
                        </a>
                    </div>
                )}
            </div>

            <div className="container mt-35">
                {/*profile*/}
                <div className="text-left">
                    <h1 className="text-2xl font-semibold">Profile</h1>
                    <p>Text Placeholder</p>
                </div>
                <Separator className="bg-gray-400 mt-15 mb-10" />
            </div>
        </>
    )
}

export default EmployerDashboardPage