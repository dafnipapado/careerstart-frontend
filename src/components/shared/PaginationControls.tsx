import type {Pagination} from "@/schemas/pagination.ts";
import type {JobListingReadSummary} from "@/schemas/jobListing.ts";
import {ChevronLeft, ChevronRight} from "lucide-react";
import * as React from "react";

const PaginationControls = ({
    jobListingsPage,
    currentPage,
    setCurrentPage
}: {
    jobListingsPage: Pagination<JobListingReadSummary> | null,
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}) => {

    return (
        <>
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
        </>
    )
}

export default PaginationControls