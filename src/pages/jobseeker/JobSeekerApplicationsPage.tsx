import {Link} from "react-router";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useEffect, useState} from "react";
import {getPaginatedFilteredJobListings} from "@/api/jobListing.ts";
import {defaultJobListingFilters} from "@/schemas/jobListingFilters.ts";
import {getLoggedInJobSeekerDetails} from "@/api/jobSeeker.ts";
import type {Pagination} from "@/schemas/pagination.ts";
import type {JobListingReadSummary} from "@/schemas/jobListing.ts";
import {ChevronLeft, ChevronRight} from "lucide-react";
import JobListingCard from "@/components/shared/JobListingCard.tsx";

const JobSeekerApplicationsPage = () => {

    const { isAuthenticated } = useAuth()
    const [jobListingsPage, setJobListingsPage] = useState<Pagination<JobListingReadSummary> | null>(null)
    const [currentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        const fetchJobSeeker = async () => {
            const jobSeekerData = await getLoggedInJobSeekerDetails()

            const jobListings = await getPaginatedFilteredJobListings({
                ...defaultJobListingFilters, jobSeekerUuid: jobSeekerData.uuid, deleted: false, page: currentPage
            })
            setJobListingsPage(jobListings)
        }
        void fetchJobSeeker()
    }, [isAuthenticated, currentPage]);


    return (
        <>
            <div className="pt-10">
                <div className="text-left left-5 flex justify-between items-center">
                    <div className="text-2xl text-primary font-semibold p-3 mb-5">
                        <span>My Job Applications</span>
                    </div>
                </div>

                {(jobListingsPage?.content?.length ?? 0) > 0
                    ?
                    <div className="container w-full">
                        {jobListingsPage?.content.map((jobListing) => (
                            <JobListingCard role="JOB_SEEKER" jobListing={jobListing} hasApplied={true} />
                        ))}
                    </div>
                    :
                    <div className="container w-full h-50 border border-gray-400 rounded-md">
                        <div className="h-full content-center">
                            <p>You have not applied to any job listings yet.</p>
                            <Link to="/job-listings" className="text-link hover:text-link-hover hover:underline">Browse job listings</Link>
                        </div>
                    </div>}

                {/*pagination control*/}
                {(jobListingsPage?.totalPages ?? 0) > 0 &&
                    <div className="flex justify-center gap-5">
                        <button
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            disabled={jobListingsPage?.first}
                            className="rounded-4xl cursor-pointer ease-in-out duration-300 hover:bg-primary disabled:text-gray-400"
                        >
                            <ChevronLeft />
                        </button>
                        <span className="font-semibold text-primary">
                            {currentPage + 1}/{jobListingsPage?.totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={jobListingsPage?.last}
                            className="rounded-4xl cursor-pointer ease-in-out duration-300 hover:bg-primary disabled:text-gray-400"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                }
            </div>
        </>
    )
}

export default JobSeekerApplicationsPage