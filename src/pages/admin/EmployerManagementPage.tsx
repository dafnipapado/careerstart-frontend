import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {useEffect, useState} from "react";
import type {EmployerReadDetails} from "@/schemas/employer.ts";
import {
    activateEmployer,
    deleteEmployer,
    getEmployerJobListingsCount,
    getPaginatedFilteredEmployers
} from "@/api/employer.ts";
import {defaultEmployerFilters} from "@/schemas/employerFilters.ts";
import type {Pagination} from "@/schemas/pagination.ts";
import {CircleCheck, CircleX} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import type {ErrorResponse} from "@/schemas/error.ts";
import {toast} from "sonner";
import {getErrorMessage} from "@/utils/errorMessages.ts";

const EmployerManagementPage = () => {

    const [employerInfo, setEmployerInfo] = useState<Pagination<EmployerReadDetails> | null>(null);
    const [jobListingsNumber, setJobListingsNumber] = useState<Record<string, number>>({})
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const getEmployerData = async () => {
            const employerData = await getPaginatedFilteredEmployers({...defaultEmployerFilters})
            setEmployerInfo(employerData)

            for (const employer of employerData.content) {
                const listingsNumber = await getEmployerJobListingsCount(employer.uuid)
                setJobListingsNumber(prev => ({
                    ...prev,
                    [employer.uuid]: listingsNumber
                }))
            }
        }

        void getEmployerData()
    }, [refresh]);

    const handleDelete = async (uuid: string) => {
        if (!window.confirm("Are you sure you want to deactive this employer account?")) return
        try {
            await deleteEmployer(uuid)
            setRefresh((prev) => !prev)
            toast.success("Employer deactivated successfully")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    const handleActivate = async (uuid: string) => {
        try {
            await activateEmployer(uuid)
            setRefresh((prev) => !prev)
            toast.success("Employer activated successfully")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    return (
        <>
            <Table className="w-full mt-10 border border-font">
                <TableHeader className="text-font!">
                    <TableHead>Brand Name</TableHead>
                    <TableHead>VAT</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Job Listings</TableHead>
                    <TableHead>Deleted</TableHead>
                    <TableHead>Actions</TableHead>
                </TableHeader>
                <TableBody>
                    {employerInfo?.content.map(employer => (
                        <TableRow>
                            <TableCell>{employer.brandName}</TableCell>
                            <TableCell>{employer.vat}</TableCell>
                            <TableCell>{employer.personalInfoDetailsReadOnlyDTO.email}</TableCell>
                            <TableCell>{jobListingsNumber[employer.uuid]}</TableCell>
                            <TableCell className="flex justify-center">{employer.deleted ? <CircleCheck/> : <CircleX/>}</TableCell>
                            <TableCell>
                                <Button onClick={() =>
                                    employer.deleted
                                        ? handleActivate(employer.uuid)
                                        : handleDelete(employer.uuid)}
                                    className={`${employer.deleted ? "border border-green-500 text-green-500" : "border border-red-500 text-red-500"}
                                            rounded-sm cursor-pointer`}
                                >
                                    {employer.deleted ? "Activate" : "Deactivate"}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

export default EmployerManagementPage