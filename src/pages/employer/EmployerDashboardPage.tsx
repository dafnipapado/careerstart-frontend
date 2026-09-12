import {useEffect, useState} from "react";
import {
    getLoggedInEmployerDetails,
    getEmployerProfilePicture,
    uploadEmployerProfilePicture,
    getEmployerPage, getEmployerJobListingsCount, getLoggedInEmployerJobListingsCount
} from "@/api/employer.ts";
import type {EmployerReadDetails} from "@/schemas/employer.ts";
import {
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    Dot,
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
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import type {ErrorResponse} from "@/schemas/error.ts";
import {toast} from "sonner";
import type {Pagination} from "@/schemas/pagination.ts";
import {Button} from "@/components/ui/button.tsx";
import PictureHandler from "../../components/shared/PictureHandler.tsx";
import {hasJobSeekerApplied} from "@/api/jobSeeker.ts";
import {getErrorMessage} from "@/utils/errorMessages.ts";

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
                ...defaultJobListingFilters, employerUuid: employerData.uuid, page: currentPage
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
            <div className="relative bg-linear-to-bl from-primary-dark-purple from-50% to-secondary-light-purple w-full h-50 top-0">
                {role !== "JOB_SEEKER" && (
                    <Link to="/employer/settings" className="flex p-2 m-2">
                        <Settings strokeWidth={1.25} className="text-white border rounded-sm ml-auto w-9 h-9 p-1 cursor-pointer duration-300 ease-in-out opacity-90 hover:opacity-60  hover:scale-[0.98]"/>
                    </Link>
                )}
                {employerInfo && (<PictureHandler uuid={employerInfo.uuid} onUpload={uploadEmployerProfilePicture} onGetPicture={getEmployerProfilePicture} canUpload={role === "EMPLOYER"} />)}
                <div className="absolute w-fit left-60 -bottom-5 font-sans font-semibold text-3xl text-white">
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
                    <div className="text-2xl text-primary-dark-purple font-semibold p-3 mb-5">
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
                    <Card key={jobListing.uuid} className="flex flex-col mx-auto w-full h-50 p-5 mb-10">
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-2xl flex items-center gap-5">
                                <div key={jobListing.title}>
                                    {jobListing.title}
                                </div>
                                {role !== "JOB_SEEKER"
                                ?
                                <div className="flex items-center gap-x-0.5">
                                    <Link to={`/employer/job-listings/${jobListing.uuid}/edit`} className="text-primary-dark-purple duration-300 ease-in-out hover:scale-[0.95]">
                                        <SquarePen className="w-5 h-5"/>
                                    </Link>
                                    <Button onClick={() => handleDelete(jobListing.uuid)} className="text-red-800 duration-300 ease-in-out hover:scale-[0.95] cursor-pointer">
                                        <Trash2 className="w-5! h-5!"/>
                                    </Button>
                                </div>
                                :
                                <div>
                                    {appliedJobListings[jobListing.uuid] && (
                                        <div className="flex text-xs text-white figtree-custom-italics bg-green-600 rounded-sm p-1 h-5 items-center gap-1">
                                            <BadgeCheck size={16}/>
                                            <p>applied</p>
                                        </div>
                                    )}
                                </div>
                                }
                            </CardTitle>
                            <CardDescription className="text-gray-500">
                                <div key={jobListing.dateCreated.slice(0,10)}>
                                    {jobListing.dateCreated.slice(0,10)}
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <div className="flex flex-col text-base font-sans">
                            <div className="self-start ml-7 -mt-5 text-sm figtree-custom-italics text-red-800" key={jobListing.professionalFieldName}>
                                {jobListing.professionalFieldName}
                            </div>
                            <div className="flex items-baseline gap-1 ml-5 mt-3 text-sm font-medium">
                                <span className="flex gap-1">
                                    <MapPin strokeWidth={1.25} size={20}  />
                                    <div key={jobListing.regionName}>
                                        {jobListing.regionName}
                                    </div>
                                </span>
                                <Dot  />
                                <span className="flex gap-1">
                                    <Factory strokeWidth={1.25} size={20}  />
                                    <div key={jobListing.employerBrandName}>
                                        {jobListing.employerBrandName}
                                    </div>
                                </span>
                            </div>
                        </div>
                        <CardFooter className="w-full mt-auto text-primary-dark-purple">
                            <Link to={`/job-listings/${jobListing.uuid}`} className="w-full">
                                <Button className="w-full border border-primary-dark-purple hover:bg-gray-200 px-4 py-2 rounded-sm cursor-pointer">View Listing ⟶</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                    ))}
                </div>
                :
                <div className="container w-full h-50 border border-gray-400 rounded-md">
                    <div className="h-full content-center">
                        <p>You have no active job listings yet.</p>
                        <Link to="/employer/create-joblisting" className="text-font-link-blue hover:underline">Post your first job listing</Link>
                    </div>
                </div>}

                {/*pagination control*/}
                {(jobListingsPage?.totalPages ?? 0) > 0 &&
                    <div className="flex justify-center gap-5">
                        <button
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            disabled={jobListingsPage?.first}
                            className="rounded-4xl cursor-pointer ease-in-out duration-300 hover:bg-primary-dark-purple/20 disabled:text-gray-400"
                        >
                            <ChevronLeft />
                        </button>
                        <span className="font-semibold">
                            {currentPage + 1}/{jobListingsPage?.totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={jobListingsPage?.last}
                            className="rounded-4xl cursor-pointer ease-in-out duration-300 hover:bg-primary-dark-purple/20 disabled:text-gray-400"
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