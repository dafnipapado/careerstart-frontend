import {useAuth} from "@/context/AuthProvider.tsx";
import {useEffect, useState} from "react";
import defaultUserPicture from "../../assets/images/default-user-picture.png";
import type {JobSeekerReadDetails} from "@/schemas/jobSeeker.ts";
import {getLoggedInJobSeekerDetails} from "@/api/jobSeeker.ts";
import {Link} from "react-router";
import {Dot, Mail, Phone, Settings} from "lucide-react";
import CustomButton from "@/components/shared/CustomButton.tsx";

const JobSeekerDashboardPage = () => {

    const {isAuthenticated} = useAuth()
    const [jobSeekerInfo, setJobSeekerInfo] = useState<JobSeekerReadDetails | null>(null)

    useEffect(() => {
        const fetchJobSeeker = async () => {
            const jobSeekerData = await getLoggedInJobSeekerDetails()
            setJobSeekerInfo(jobSeekerData)
        }
        void fetchJobSeeker()
    }, [isAuthenticated]);

    return (
        <>
            <div className="relative bg-font-dark-purple w-full h-50 top-0">
                <Link to="/job_seeker/settings" className="flex p-2 m-2">
                    <Settings strokeWidth={1.25}
                              className="text-white border rounded-sm ml-auto w-9 h-9 p-1 cursor-pointer duration-300 ease-in-out opacity-90 hover:opacity-60  hover:scale-[0.98]"/>
                </Link>
                <img className="absolute w-40 h-40 border border-black rounded-3xl left-15 -bottom-20"
                     src={defaultUserPicture} alt="user picture"/>
                <div className="absolute w-fit left-60 -bottom-5 font-sans font-semibold text-3xl text-white">
                    <h1>{jobSeekerInfo?.firstname} {jobSeekerInfo?.lastname}</h1>
                </div>
                <div className="absolute left-60 -bottom-17 flex gap-1 font-medium items-baseline">
                    <a href={`mailto:${jobSeekerInfo?.personalInfoDetailsReadOnlyDTO.email}`}
                       className="flex items-center gap-1"><Mail
                        strokeWidth={1.25}/>{jobSeekerInfo?.personalInfoDetailsReadOnlyDTO.email}</a>
                    {jobSeekerInfo?.personalInfoDetailsReadOnlyDTO.telephoneNumber && (
                        <div className="flex items-baseline gap-1">
                            <Dot/>
                            <span className="flex gap-1">
                                <Phone
                                    strokeWidth={1.25}/>{jobSeekerInfo?.personalInfoDetailsReadOnlyDTO.telephoneNumber}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-35">
                <div className="flex justify-end m-3">
                    <Link to="/job_seeker/update-cv">
                        <CustomButton label="Edit CV"></CustomButton>
                    </Link>
                </div>
                <div className="container w-full h-50 border border-gray-400 rounded-md">
                    <div className="h-full content-center">
                        <p className="pb-3">You haven't posted your CV yet.</p>
                        <Link to="/job_seeker/create-cv">
                            <CustomButton label="Create your CV"></CustomButton>
                        </Link>
                    </div>
                </div>
            </div>

        </>
    )
}

export default JobSeekerDashboardPage