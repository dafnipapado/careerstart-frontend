import {Link} from "react-router";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {ChevronLeft, ChevronRight, Dot, Factory, MapPin} from "lucide-react";
import {Button} from "@base-ui/react";
import {useEffect, useState} from "react";
import type {Pagination} from "@/schemas/pagination.ts";
import type {JobListingReadSummary} from "@/schemas/jobListing.ts";
import {getPaginatedFilteredJobListings} from "@/api/jobListing.ts";
import {defaultJobListingFilters} from "@/schemas/jobListingFilters.ts";

const JobListingsPage = () => {

    const [jobListingsPage, setJobListingsPage] = useState<Pagination<JobListingReadSummary> | null>(null)
    const [currentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        const fetchJobListings = async () => {
            const data = await getPaginatedFilteredJobListings({
                ...defaultJobListingFilters, page: currentPage
            })
            setJobListingsPage(data)
        }

        void fetchJobListings()
    }, [currentPage]);

    return (
        <>
            <div>
                <div className="text-left left-5 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Job Listings</h1>
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
                            <p>There are currently no active job listings.</p>
                        </div>
                    </div>}
                
                {(jobListingsPage?.totalPages ?? 0) > 0 &&
                    <div className="flex justify-center gap-5">
                        <button
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            disabled={jobListingsPage?.first}
                            className="rounded-4xl cursor-pointer ease-in-out duration-300 hover:bg-font-dark-purple/20 disabled:text-gray-400"
                        >
                            <ChevronLeft />
                        </button>
                        <span className="font-semibold">
                            {currentPage + 1}/{jobListingsPage?.totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={jobListingsPage?.last}
                            className="rounded-4xl cursor-pointer ease-in-out duration-300 hover:bg-font-dark-purple/20 disabled:text-gray-400"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                }
            </div>
        </>
    )
}

export default JobListingsPage