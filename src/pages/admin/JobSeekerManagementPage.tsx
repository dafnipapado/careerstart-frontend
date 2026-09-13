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
import type {JobSeekerReadDetails} from "@/schemas/jobSeeker.ts";
import {activateJobSeeker, deleteJobSeeker, getPaginatedFilteredJobSeekers} from "@/api/jobSeeker.ts";
import {defaultJobSeekerFilters} from "@/schemas/jobSeekerFilters.ts";
import {getErrorMessage} from "@/utils/errorMessages.ts";

const JobSeekerManagementPage = () => {

    const [jobSeekerInfo, setJobSeekerInfo] = useState<Pagination<JobSeekerReadDetails> | null>(null);
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const getJobSeekerData = async () => {
            const jobSeekerData = await getPaginatedFilteredJobSeekers({...defaultJobSeekerFilters})
            setJobSeekerInfo(jobSeekerData)
        }

        void getJobSeekerData()
    }, [refresh]);

    const handleDelete = async (uuid: string) => {
        if (!window.confirm("Are you sure you want to deactive this job seeker account?")) return
        try {
            await deleteJobSeeker(uuid)
            setRefresh((prev) => !prev)
            toast.success("Job seeker deactivated successfully")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    const handleActivate = async (uuid: string) => {
        try {
            await activateJobSeeker(uuid)
            setRefresh((prev) => !prev)
            toast.success("Job seeker activated successfully")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    return (
        <>
            <Table className="w-full mt-10">
                <TableHeader>
                    <TableHead>Firstname</TableHead>
                    <TableHead>Lastname</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Deleted</TableHead>
                    <TableHead>Actions</TableHead>
                </TableHeader>
                <TableBody>
                    {jobSeekerInfo?.content.map(jobSeeker => (
                        <TableRow>
                            <TableCell>{jobSeeker.firstname}</TableCell>
                            <TableCell>{jobSeeker.lastname}</TableCell>
                            <TableCell>{jobSeeker.personalInfoDetailsReadOnlyDTO.email}</TableCell>
                            <TableCell className="flex justify-center">{jobSeeker.deleted ? <CircleCheck/> : <CircleX/>}</TableCell>
                            <TableCell>
                                <Button onClick={() =>
                                    jobSeeker.deleted
                                        ? handleActivate(jobSeeker.uuid)
                                        : handleDelete(jobSeeker.uuid)}
                                        className={`${jobSeeker.deleted ? "border border-green-500 text-green-500" : "border border-red-500 text-red-500"}
                                            rounded-sm cursor-pointer`}
                                >
                                    {jobSeeker.deleted ? "Activate" : "Deactivate"}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

export default JobSeekerManagementPage