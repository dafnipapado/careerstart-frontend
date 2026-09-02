import defaultUserPicture from "../../assets/images/default-user-picture.png";
import {useEffect, useState} from "react";
import {getLoggedInEmployerDetails} from "@/api/employer.ts";
import type {EmployerReadDetails} from "@/schemas/employer.ts";
import {
    Dot,
    Factory,
    MapPin,
    Settings,
    SquareArrowOutUpRight,
    SquarePen,
    Trash2
} from "lucide-react";
import {Link} from "react-router";
import {Separator} from "@/components/ui/separator.tsx";
import CustomButton from "@/components/shared/CustomButton.tsx";
import {deleteJobListing, getPaginatedFilteredJobListings} from "@/api/jobListing.ts";
import {defaultJobListingFilters} from "@/schemas/jobListingFilters.ts";
import type {JobListingReadSummary} from "@/schemas/jobListing.ts";
import {useAuth} from "@/context/AuthProvider.tsx";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@base-ui/react";
import type {ErrorResponse} from "@/schemas/error.ts";
import {toast} from "sonner";

const EmployerDashboardPage = () => {

    const { isAuthenticated } = useAuth()
    const [employerInfo, setEmployerInfo] = useState<EmployerReadDetails | null>(null)
    const [jobListings, setJobListings] = useState<JobListingReadSummary[]>([])
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const fetchEmployer = async () => {
            const employerData = await getLoggedInEmployerDetails()
            setEmployerInfo(employerData)
            const data = await getPaginatedFilteredJobListings({
                ...defaultJobListingFilters, employerUuid: employerData.uuid
            })
            setJobListings(data.content)
        }

        void fetchEmployer()
    }, [isAuthenticated, refresh]);

    const handleDelete = async (uuid: string) => {
        if (!window.confirm("Are you sure you want to delete this job listing?")) return
        try {
            await deleteJobListing(uuid)
            setRefresh((prev) => !prev)
            toast.success("Job Listing deleted successfully")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(err.message)
        }
    }

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

            {/*job listings*/}
            <div>
                <div className="text-left left-5 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">My Job Listings</h1>
                    <Link to="/employer/create-joblisting">
                        <CustomButton label="+ New job listing"></CustomButton>
                    </Link>
                </div>

                {jobListings.length > 0
                ?
                <div className="container w-full">
                    {jobListings.map((jobListing) => (
                    <Card key={jobListing.uuid} className="flex flex-col mx-auto w-full h-50 p-5 mb-10">
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle className="text-2xl flex items-center gap-5">
                                <div key={jobListing.title}>
                                    {jobListing.title}
                                </div>
                                <div className="flex gap-x-1.5">
                                    <Link to={`/employer/job-listings/${jobListing.uuid}/edit`} className="text-font-dark-purple duration-300 ease-in-out hover:scale-[0.95]">
                                        <SquarePen />
                                    </Link>
                                    <Button onClick={() => handleDelete(jobListing.uuid)} className="text-red-800 duration-300 ease-in-out hover:scale-[0.95] cursor-pointer">
                                        <Trash2 />
                                    </Button>
                                </div>
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
                        <CardFooter className="w-full mt-auto text-font-dark-purple">
                            <Link to={`/job-listings/${jobListing.uuid}`} className="w-full">
                                <Button className="w-full border border-font-dark-purple hover:bg-gray-200 px-4 py-2 rounded-sm cursor-pointer">View Listing ⟶</Button>
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
            </div>
        </>
    )
}

export default EmployerDashboardPage