import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {deleteJobListing, getSingleJobListing} from "@/api/jobListing.ts";
import type {JobListingReadDetails} from "@/schemas/jobListing.ts";
import {Dot, Factory, MapPin, Link as LinkIcon} from "lucide-react";
import {Separator} from "@/components/ui/separator.tsx";
import CustomButton from "@/components/shared/CustomButton.tsx";
import {Link} from "react-router";
import {useAuth} from "@/context/AuthProvider.tsx";
import {getLoggedInEmployerDetails} from "@/api/employer.ts";
import type {EmployerReadDetails} from "@/schemas/employer.ts";
import {toast} from "sonner";
import type {ErrorResponse} from "@/schemas/error.ts";

const JobListingViewPage = () => {

    const {uuid} = useParams()
    const {isAuthenticated} = useAuth()
    const [jobListing, setJobListing] = useState<JobListingReadDetails | null>(null)
    const [employerInfo, setEmployerInfo] = useState<EmployerReadDetails | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchJobListing = async () => {
            const data = await getSingleJobListing(uuid!)
            setJobListing(data)
        }

        const fetchEmployer = async () => {
            const employerData = await getLoggedInEmployerDetails()
            setEmployerInfo(employerData)
        }

        void fetchEmployer()
        void fetchJobListing()

    },[uuid, isAuthenticated]);

    const handleDelete = async (uuid: string) => {
        if (!window.confirm("Are you sure you want to delete this job listing?")) return
        try {
            await deleteJobListing(uuid)
            toast.success("Job Listing deleted successfully")
            navigate("/employer/dashboard")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(err.message)
        }
    }

    return (
        <>
            <div className="container w-full bg-white mt-10 border border-gray-200 rounded-sm shadow-xs shadow-gray-200">
                <div className="mx-auto w-full p-20">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-semibold">
                                {jobListing?.title}
                            </div>
                            <div className="text-gray-500">
                                {jobListing?.dateCreated.slice(0, 10)}
                            </div>
                        </div>
                        <div className="flex flex-col text-base font-sans">
                            <div className="self-start mt-3 text-sm figtree-custom-italics text-red-800">
                                {jobListing?.professionalFieldName}
                            </div>
                            <div className="flex items-baseline gap-1 -ml-1 mt-5 text-sm font-medium">
                                <span className="flex gap-1">
                                    <MapPin strokeWidth={1.25} size={20}/>
                                    {jobListing?.regionName}
                                </span>
                                <Dot/>
                                <span className="flex gap-1">
                                    <Factory strokeWidth={1.25} size={20}/>
                                    {jobListing?.employerSummaryReadOnlyDTO.brandName}
                                </span>
                                {jobListing?.employerSummaryReadOnlyDTO.website && (
                                    <div className="flex items-baseline gap-1">
                                        <Dot/>
                                        <span className="flex gap-1">
                                            <LinkIcon strokeWidth={1.25} size={20}/>
                                            <a href={`${jobListing?.employerSummaryReadOnlyDTO.website}`} target="_blank"
                                               rel="noopener noreferrer" className="text-font-link-blue hover:text-blue-950">
                                                 {jobListing?.employerSummaryReadOnlyDTO.website}
                                            </a>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <Separator className=" bg-gray-400 my-10"/>
                    <div className="mb-15">
                        {jobListing?.description}
                    </div>

                    {employerInfo?.uuid === jobListing?.employerSummaryReadOnlyDTO.uuid
                    ?
                    <div className="w-full mx-auto flex justify-center gap-4">
                        <Link to={`/employer/job-listings/${jobListing?.uuid}/edit`}>
                            <CustomButton label="Edit" addClasses="w-40"></CustomButton>
                        </Link>
                        <CustomButton label="Delete" onClick={() => handleDelete(jobListing!.uuid)} addClasses="w-40"></CustomButton>
                    </div>
                    :
                    <div>
                        <Link to="" className="w-full">
                            <CustomButton label="Apply" addClasses="w-1/2"></CustomButton>
                        </Link>
                    </div>
                    }
                </div>
            </div>
        </>
    )
}

export default JobListingViewPage