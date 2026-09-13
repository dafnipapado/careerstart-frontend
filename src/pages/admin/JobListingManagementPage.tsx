import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {useEffect, useState} from "react";
import type {Pagination} from "@/schemas/pagination.ts";
import {CircleCheck, CircleX} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import type {ErrorResponse} from "@/schemas/error.ts";
import {toast} from "sonner";
import {deleteJobListing, getPaginatedFilteredJobListings, restoreJobListing} from "@/api/jobListing.ts";
import {defaultJobListingFilters} from "@/schemas/jobListingFilters.ts";
import type {JobListingReadSummary} from "@/schemas/jobListing.ts";
import {getErrorMessage} from "@/utils/errorMessages.ts";

const JobListingManagementPage = () => {

    const [jobListingInfo, setJobListingInfo] = useState<Pagination<JobListingReadSummary> | null>(null);
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const getJobListingData = async () => {
            const jobListingData = await getPaginatedFilteredJobListings({...defaultJobListingFilters})
            setJobListingInfo(jobListingData)
        }

        void getJobListingData()
    }, [refresh]);

    const handleDelete = async (uuid: string) => {
        if (!window.confirm("Are you sure you want to delete this job listing?")) return
        try {
            await deleteJobListing(uuid)
            setRefresh((prev) => !prev)
            toast.success("Job listing deleted successfully")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    const handleRestore = async (uuid: string) => {
        try {
            await restoreJobListing(uuid)
            setRefresh((prev) => !prev)
            toast.success("Job listing restored successfully")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    return (
        <>
            <Table className="w-full mt-10">
                <TableHeader>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Employer</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Deleted</TableHead>
                    <TableHead>Actions</TableHead>
                </TableHeader>
                <TableBody>
                    {jobListingInfo?.content.map(listing => (
                        <TableRow>
                            <TableCell>{listing.title}</TableCell>
                            <TableCell>{listing.employerBrandName}</TableCell>
                            <TableCell>{listing.professionalFieldName}</TableCell>
                            <TableCell>{listing.regionName}</TableCell>
                            <TableCell>{listing.dateCreated.slice(0, 10)}</TableCell>
                            <TableCell className="flex justify-center">{listing.deleted ? <CircleCheck/> : <CircleX/>}</TableCell>
                            <TableCell>
                                <Button onClick={() =>
                                    listing.deleted
                                        ? handleRestore(listing.uuid)
                                        : handleDelete(listing.uuid)}
                                        className={`${listing.deleted ? "border border-green-500 text-green-500" : "border border-red-500 text-red-500"}
                                            rounded-sm cursor-pointer`}
                                >
                                    {listing.deleted ? "Restore" : "Delete"}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

export default JobListingManagementPage