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
import {toast} from "sonner";
import type {ErrorResponse} from "@/schemas/error.ts";
import {
    apply,
    getJobSeekerProfilePicture,
    getJobSeekersByJobListing,
    hasJobSeekerApplied,
    withdraw
} from "@/api/jobSeeker.ts";
import type {JobSeekerReadSummary} from "@/schemas/jobSeeker.ts";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@base-ui/react";
import defaultUserPicture from "@/assets/images/default-user-picture.png";
import {getErrorMessage} from "@/utils/errorMessages.ts";

const JobListingViewPage = () => {

    const {uuid} = useParams()
    const {isAuthenticated, role} = useAuth()
    const [jobListing, setJobListing] = useState<JobListingReadDetails | null>(null)
    const [hasApplied, setHasApplied] = useState<boolean>(false);
    const [isOwnEmployer, setIsOwnEmployer] = useState<boolean>(false)
    const [applicants, setApplicants] = useState<JobSeekerReadSummary[]>([])
    const [avatarUrls, setAvatarUrls] = useState<Record<string, string>>({})
    const navigate = useNavigate()

    useEffect(() => {
        const fetchJobListing = async () => {
            const data = await getSingleJobListing(uuid!)
            setJobListing(data)

            if (role === "EMPLOYER") {
                try {
                    const employer = await getLoggedInEmployerDetails()
                    setIsOwnEmployer(employer.uuid === data.employerSummaryReadOnlyDTO.uuid)
                } catch {
                    setIsOwnEmployer(false)
                }
            }

            const verifyHasApplied = async () => {
                if (role !== "JOB_SEEKER") return
                const result = await hasJobSeekerApplied(data.uuid)
                setHasApplied(result)
            }
            void verifyHasApplied()

            const getApplicants = async () => {
                const jobseekers = await getJobSeekersByJobListing(data.uuid)
                setApplicants(jobseekers)

                jobseekers.forEach(applicant => {
                    getJobSeekerProfilePicture(applicant.uuid)
                        .then(blob => {
                            setAvatarUrls(prev => ({
                                ...prev,
                                [applicant.uuid] : URL.createObjectURL(blob)
                            }))
                        })
                        .catch(() => {})
                })
            }
            void getApplicants()
        }

        void fetchJobListing()

    }, [uuid, isAuthenticated, role]);

    const handleDelete = async (uuid: string) => {
        if (!window.confirm("Are you sure you want to delete this job listing?")) return
        try {
            await deleteJobListing(uuid)
            toast.success("Job Listing deleted successfully")
            navigate("/employer/dashboard")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    const handleApply = async (uuid: string) => {
        try {
            await apply(uuid)
            setHasApplied(true)
            toast.success("Successfully applied to job listing!")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    const handleWithdraw = async (uuid: string) => {
        try {
            await withdraw(uuid)
            setHasApplied(false)
            toast.success("Successfully withdrew from job listing")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    return (
        <>
        <div className="container w-full bg-surface mt-10 border border-gray-200 rounded-sm shadow-xl shadow-surface-elevated">
            <div className="mx-auto w-full p-20">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-semibold">
                            {jobListing?.title}
                        </div>
                        <div className="text-gray-200">
                            {jobListing?.dateCreated.slice(0, 10)}
                        </div>
                    </div>
                    <div className="flex flex-col text-base font-sans">
                        <div className="self-start mt-3 text-sm figtree-custom-italics text-link-blue">
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
                                <Link to={`/job_seeker/employer/${jobListing?.employerSummaryReadOnlyDTO.uuid}`}>
                                    {jobListing?.employerSummaryReadOnlyDTO.brandName}
                                </Link>
                            </span>
                            {jobListing?.employerSummaryReadOnlyDTO.website && (
                                <div className="flex items-baseline gap-1">
                                    <Dot/>
                                    <span className="flex gap-1">
                                        <LinkIcon strokeWidth={1.25} size={20}/>
                                        <a href={`${jobListing?.employerSummaryReadOnlyDTO.website}`}
                                           target="_blank"
                                           rel="noopener noreferrer"
                                           className="text-font-link-blue hover:text-blue-950">
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

                {!isOwnEmployer
                    ?
                        role === "EMPLOYER"
                        ?
                        <div className="text-xl text-secondary-light-purple font-semibold">
                            Interested in this listing?
                            Sign in as a job seeker to apply!
                        </div>
                        :
                        <div className="w-full">
                            <CustomButton
                                onClick={() => hasApplied ? handleWithdraw(jobListing!.uuid) : handleApply(jobListing!.uuid)}
                                label={`${hasApplied ? "Withdraw" : "Apply"}`}
                                addClasses={`w-1/2 ${hasApplied ? "bg-red-900 hover:bg-red-800" : ""}`}>
                            </CustomButton>
                        </div>
                    :
                    <div className="w-full mx-auto flex justify-center gap-4">
                        <Link to={`/employer/job-listings/${jobListing?.uuid}/edit`}>
                            <CustomButton label="Edit" addClasses="w-40"></CustomButton>
                        </Link>
                        <CustomButton label="Delete" onClick={() => handleDelete(jobListing!.uuid)}
                                      addClasses="w-40">
                        </CustomButton>
                    </div>
                }


                    {isOwnEmployer && (
                        <div>
                            <Separator className="bg-gray-400 my-10"/>
                            <div className="text-2xl font-semibold">APPLICANTS</div>
                            {applicants.length > 0

                            ?
                            <div className="w-full grid grid-cols-4 gap-2 mt-10">
                                {applicants.map((applicant) => (
                                    <Card key={applicant.uuid} className="flex flex-col mb-10 bg-surface-elevated shadow-lg shadow-font">
                                        <CardHeader className="flex flex-col items-center">
                                            <CardTitle className="text-xl flex flex-col">
                                                <div>
                                                    <img src={avatarUrls[applicant.uuid] ?? defaultUserPicture} className="w-37.5 h-37.5 rounded-3xl" />
                                                </div>
                                                <div className="flex justify-center gap-1 mt-2 text-gray-200">
                                                    <div key={applicant.firstname}>
                                                        {applicant.firstname}
                                                    </div>
                                                    <div key={applicant.lastname}>
                                                        {applicant.lastname}
                                                    </div>
                                                </div>
                                            </CardTitle>
                                            <CardDescription className="text-gray-200">
                                                <div key={applicant.email}>
                                                    {applicant.email}
                                                </div>
                                            </CardDescription>
                                        </CardHeader>

                                        <CardFooter className="w-full mt-auto text-primary-dark-purple">
                                            <Link to={`/employer/jobseeker/${applicant.uuid}`} className="w-full">
                                                <Button
                                                    className="w-full border border-primary-dark-purple bg-secondary-light-purple
                                                    text-surface hover:bg-secondary-light-purple/80 hover:text-font  px-4 py-2 rounded-sm cursor-pointer">
                                                    View Profile
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                            :
                            <div>
                                This job listing has no applicants yet.
                            </div>
                            }
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}

export default JobListingViewPage