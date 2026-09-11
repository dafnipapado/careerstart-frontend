import {useAuth} from "@/context/AuthProvider.tsx";
import {useEffect, useState} from "react";
import type {JobSeekerReadDetails} from "@/schemas/jobSeeker.ts";
import {
    getJobSeekerCvFile,
    getJobSeekerPage,
    getJobSeekerProfilePicture,
    getLoggedInJobSeekerDetails, uploadJobSeekerCv,
    uploadJobSeekerProfilePicture
} from "@/api/jobSeeker.ts";
import {Link, useParams} from "react-router";
import {Dot, Mail, Phone, Settings} from "lucide-react";
import CustomButton from "@/components/shared/CustomButton.tsx";
import type {CvRead} from "@/schemas/cv.ts";
import {getJobSeekerCv} from "@/api/cv.ts";
import {Separator} from "@/components/ui/separator.tsx";
import PictureHandler from "../../components/shared/PictureHandler.tsx";
import CvFileHandler from "../../components/shared/CvFileHandler.tsx";
import {Button} from "@/components/ui/button.tsx";

const JobSeekerDashboardPage = () => {

    const {uuid} = useParams()
    const {isAuthenticated, role} = useAuth()
    const [jobSeekerInfo, setJobSeekerInfo] = useState<JobSeekerReadDetails | null>(null)
    const [cvInfo, setCvInfo] = useState<CvRead | null>(null)

    useEffect(() => {
        const fetchJobSeeker = async () => {
            const jobSeekerData = role === "JOB_SEEKER"
            ? await getLoggedInJobSeekerDetails()
            : await getJobSeekerPage(uuid!)
            setJobSeekerInfo(jobSeekerData)

            const cvData = await getJobSeekerCv(jobSeekerData.uuid)
            setCvInfo(cvData)
        }
        void fetchJobSeeker()
    }, [isAuthenticated]);

    return (
        <>
            <div className="relative bg-linear-to-bl from-primary-dark-purple from-50% to-secondary-light-purple w-full h-50 top-0">
                {role !== "EMPLOYER" && (
                <Link to="/job_seeker/settings" className="flex p-2 m-2">
                    <Settings strokeWidth={1.25}
                              className="text-white border rounded-sm ml-auto w-9 h-9 p-1 cursor-pointer duration-300 ease-in-out opacity-90 hover:opacity-60  hover:scale-[0.98]"/>
                </Link>)}
                {jobSeekerInfo && (<PictureHandler uuid={jobSeekerInfo.uuid} onUpload={uploadJobSeekerProfilePicture} onGetPicture={getJobSeekerProfilePicture} canUpload={role === "JOB_SEEKER"} />)}
                <div className="absolute w-fit left-60 -bottom-5 font-sans font-semibold text-3xl text-white">
                    <h1>{jobSeekerInfo?.firstname} {jobSeekerInfo?.lastname}</h1>
                </div>
                <div className={`absolute left-60 ${cvInfo?.profession ? "-bottom-18" : "-bottom-10"} font-medium`}>
                    {cvInfo?.profession && (
                        <div className="text-start font-semibold text-2xl mb-2">{cvInfo?.profession}</div>)}
                    <div className="flex gap-1">
                        <a href={`mailto:${jobSeekerInfo?.personalInfoDetailsReadOnlyDTO.email}`}
                           className="flex items-center gap-1 hover:text-primary-dark-purple"><Mail
                            strokeWidth={1.25}/>{jobSeekerInfo?.personalInfoDetailsReadOnlyDTO.email}
                        </a>
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
            </div>

            {jobSeekerInfo && (
                <div>
                    <CvFileHandler uuid={jobSeekerInfo!.uuid} onUpload={uploadJobSeekerCv} onGetCv={getJobSeekerCvFile} canUpload={role === "JOB_SEEKER"} />
                </div>
            )}
            {!cvInfo?.profession
                ?
                <div className="mt-55">
                    <div className="container w-full h-50 border border-gray-300 rounded-md mt-35">
                        {role !== "EMPLOYER" && (
                        <div className="h-full content-center">
                            <p className="pb-3">You haven't posted your CV yet.</p>
                            <Link to="/job_seeker/create-cv">
                                <CustomButton label="Create CV"></CustomButton>
                            </Link>
                        </div>)}
                    </div>
                </div>
                :
                <div className={`${role!=="EMPLOYER" ? "mt-40" : "mt-63"}`}>
                    {role !== "EMPLOYER" && (
                        <div className="grid text-end m-5">
                            <Link to={`/job_seeker/${jobSeekerInfo?.uuid}/cv/edit`}>
                                <Button className="px-5 py-2 rounded-sm border border-primary-dark-purple text-primary-dark-purple cursor-pointer hover:bg-gray-200 mt-3">
                                    Edit CV
                                </Button>
                            </Link>
                        </div>
                    )}
                    <div
                        className="w-full grid grid-cols-[1fr_20fr] mx-auto bg-white border border-gray-200 rounded-sm shadow-xl shadow-gray-200 text-start font-sans">
                        <div className="bg-primary-dark-purple"></div>
                        <div className="p-15">
                            {cvInfo?.bio && (<div>
                                <div className="font-bold text-xl">PROFILE</div>
                                <div className="text-base mt-5">{cvInfo?.bio}</div>
                                <Separator className="mx-auto my-8 bg-gray-300"/>
                            </div>)}
                            {cvInfo?.education && (<div>
                                <div className="font-bold text-xl">EDUCATION</div>
                                <div className="text-base mt-5">{cvInfo?.education}</div>
                                <Separator className="mx-auto my-8 bg-gray-300"/>
                            </div>)}
                            {cvInfo?.experience && (<div>
                                <div className="font-bold text-xl">PROFESSIONAL EXPERIENCE</div>
                                <div className="text-base mt-5">{cvInfo?.experience}</div>
                                <Separator className="mx-auto my-8 bg-gray-300"/>
                            </div>)}
                            {cvInfo?.certificates && (<div>
                                <div className="font-bold text-xl">CERTIFICATES</div>
                                <div className="text-base mt-5">{cvInfo?.certificates}</div>
                                <Separator className="mx-auto my-8 bg-gray-300"/>
                            </div>)}
                            {cvInfo?.languages && (<div>
                                <div className="font-bold text-xl">LANGUAGES</div>
                                <div className="text-base mt-5">{cvInfo?.languages}</div>
                                <Separator className="mx-auto my-8 bg-gray-300"/>
                            </div>)}
                            {cvInfo?.skills && (<div>
                                <div className="font-bold text-xl">SKILLS</div>
                                <div className="text-base mt-5">{cvInfo?.skills}</div>
                            </div>)}
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default JobSeekerDashboardPage