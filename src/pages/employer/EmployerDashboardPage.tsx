import {useEffect, useState} from "react";
import {
    getLoggedInEmployerDetails,
    getEmployerProfilePicture,
    uploadEmployerProfilePicture,
    getEmployerPage, getEmployerJobListingsCount, getLoggedInEmployerJobListingsCount
} from "@/api/employer.ts";
import type {EmployerReadDetails} from "@/schemas/employer.ts";
import {
    ChevronLeft,
    ChevronRight,
    Factory,
    MapPin,
    Settings,
    SquareArrowOutUpRight,
    SquarePen,
    Trash2
} from "lucide-react";
import {Link, useParams} from "react-router";
import {Separator} from "@/components/ui/separator.tsx";
import CustomButton from "@/components/shared/CustomButton.tsx";
import {deleteJobListing, getPaginatedFilteredJobListings} from "@/api/jobListing.ts";
import {defaultJobListingFilters} from "@/schemas/jobListingFilters.ts";
import type {JobListingReadSummary} from "@/schemas/jobListing.ts";
import {useAuth} from "@/context/AuthProvider.tsx";
import type {ErrorResponse} from "@/schemas/error.ts";
import {toast} from "sonner";
import type {Pagination} from "@/schemas/pagination.ts";
import {Button} from "@/components/ui/button.tsx";
import PictureHandler from "../../components/shared/PictureHandler.tsx";
import {hasJobSeekerApplied} from "@/api/jobSeeker.ts";
import {getErrorMessage} from "@/utils/errorMessages.ts";
import banner from "@/assets/images/banner.jpg";
import JobListingCard from "@/components/shared/JobListingCard.tsx";

const EmployerDashboardPage = () => {

    const { uuid } = useParams()
    const { isAuthenticated, role } = useAuth()
    const [employerInfo, setEmployerInfo] = useState<EmployerReadDetails | null>(null)
    const [jobListingsPage, setJobListingsPage] = useState<Pagination<JobListingReadSummary> | null>(null)
    const [refresh, setRefresh] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [jobListingsNumber, setJobListingsNumber] = useState<number>(0)
    const [appliedJobListings, setAppliedJobListings] = useState<Record<string, boolean>>({})

    useEffect(() => {
        const fetchEmployer = async () => {
            const employerData = role === "EMPLOYER"
            ? await getLoggedInEmployerDetails()
            : await getEmployerPage(uuid!)
            setEmployerInfo(employerData)

            const jobListings = await getPaginatedFilteredJobListings({
                ...defaultJobListingFilters, employerUuid: employerData.uuid, deleted:false, page: currentPage
            })
            setJobListingsPage(jobListings)

            if (role === "JOB_SEEKER") {
                for (const listing of jobListings.content) {
                    const hasApplied = await hasJobSeekerApplied(listing.uuid)
                    setAppliedJobListings(prev => ({
                        ...prev,
                        [listing.uuid]: hasApplied
                    }))
                }
            }

            const jobListingsCount = role === "EMPLOYER"
            ? await getLoggedInEmployerJobListingsCount()
            : await getEmployerJobListingsCount(employerData.uuid)
            setJobListingsNumber(jobListingsCount)
        }
        void fetchEmployer()
    }, [isAuthenticated, refresh, currentPage]);

    const handleDelete = async (uuid: string) => {
        if (!window.confirm("Are you sure you want to delete this job listing?")) return
        try {
            await deleteJobListing(uuid)
            if (jobListingsPage?.content.length === 1 && !jobListingsPage.first) {
                setCurrentPage(prev => prev - 1)
            }
            setRefresh((prev) => !prev)
            toast.success("Job Listing deleted successfully")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    return (
        <>
            {/*banner*/}
            <div className="relative w-full rounded-lg h-70 top-0">
                <img src={banner} className="absolute w-full object-cover rounded-lg h-70 top-0" />
                {role !== "JOB_SEEKER" && (
                    <Link to="/employer/settings" className="flex p-2 m-2">
                        <Settings strokeWidth={1.25} className="border rounded-sm ml-auto w-9 h-9 p-1 cursor-pointer duration-300 ease-in-out opacity-90 hover:opacity-60  hover:scale-[0.98]"/>
                    </Link>
                )}
                {employerInfo && (<PictureHandler uuid={employerInfo.uuid} onUpload={uploadEmployerProfilePicture} onGetPicture={getEmployerProfilePicture} canUpload={role === "EMPLOYER"} />)}
                <div className="absolute w-fit left-60 -bottom-5 font-semibold text-3xl">
                    <h1 className="">{employerInfo?.brandName}</h1>
                </div>
                <div className="absolute left-60 -bottom-17 flex flex-col gap-2 font-medium items-start">
                    <span className="flex items-center gap-1"><Factory strokeWidth={1.25}  />  {employerInfo?.professionalFieldName}</span>
                    <span className="flex items-center gap-1"><MapPin strokeWidth={1.25} />{employerInfo?.personalInfoDetailsReadOnlyDTO.regionName}</span>
                </div>
                {employerInfo?.website && (
                    <div className="absolute right-4 -bottom-13 border border-primary-dark-purple rounded-md p-2 duration-300 ease-in-out hover:scale-[0.98]">
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
                    <p>{employerInfo?.profile}</p>
                </div>
                <Separator className="bg-gray-400 mt-15 mb-10" />
            </div>

            {/*job listings*/}
            <div>
                <div className="text-left left-5 flex justify-between items-center">
                    <div className="text-2xl font-semibold text-text p-3 mb-5">
                        {role !== "JOB_SEEKER"
                            ? <span>My Job Listings ({jobListingsNumber})</span>
                            : <span>{jobListingsNumber} Job Listings</span>}
                    </div>
                    {role !== "JOB_SEEKER" && (
                        <Link to="/employer/create-joblisting">
                            <CustomButton label="+ New job listing"></CustomButton>
                        </Link>
                    )}
                </div>

                {(jobListingsPage?.content?.length ?? 0) > 0
                ?
                <div className="container w-full">
                    {jobListingsPage?.content.map((jobListing) => (
                        <JobListingCard role={role} jobListing={jobListing} hasApplied={appliedJobListings[jobListing.uuid]}>
                            {role !== "JOB_SEEKER" &&
                                <div className="flex items-center gap-x-0.5">
                                    <Link to={`/employer/job-listings/${jobListing.uuid}/edit`} className="text-primary-light duration-300 ease-in-out hover:scale-[0.95]">
                                        <SquarePen className="w-5 h-5"/>
                                    </Link>
                                    <Button onClick={() => handleDelete(jobListing.uuid)} className="text-danger duration-300 ease-in-out hover:scale-[0.95] bg-white hover:bg-white cursor-pointer">
                                        <Trash2 className="w-5! h-5!"/>
                                    </Button>
                                </div>
                            }
                        </JobListingCard>
                    ))}
                </div>
                :
                <div className="container w-full h-50 border border-gray-400 rounded-md">
                    <div className="h-full content-center">
                        <p>You have no active job listings yet.</p>
                        <Link to="/employer/create-joblisting" className="text-link hover:text-link-hover hover:underline">Post your first job listing</Link>
                    </div>
                </div>}

                {/*pagination control*/}
                {(jobListingsPage?.totalPages ?? 0) > 0 &&
                    <div className="flex justify-center gap-5">
                        <button
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            disabled={jobListingsPage?.first}
                            className="rounded-4xl cursor-pointer ease-in-out duration-300 hover:bg-primary-hover disabled:text-gray-400"
                        >
                            <ChevronLeft />
                        </button>
                        <span className="font-semibold text-primary">
                            {currentPage + 1}/{jobListingsPage?.totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={jobListingsPage?.last}
                            className="rounded-4xl cursor-pointer ease-in-out duration-300 hover:bg-primary-hover disabled:text-gray-400"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                }
            </div>
        </>
    )
}

export default EmployerDashboardPage