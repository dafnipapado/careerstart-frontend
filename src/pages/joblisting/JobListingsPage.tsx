import {ChevronLeft, ChevronRight, Funnel, X} from "lucide-react";
import {Button} from "@base-ui/react";
import {useEffect, useState} from "react";
import type {Pagination} from "@/schemas/pagination.ts";
import {type JobListingReadSummary} from "@/schemas/jobListing.ts";
import {getPaginatedFilteredJobListings} from "@/api/jobListing.ts";
import {
    defaultJobListingFilters,
    type JobListingFilters,
    type JobListingFiltersForm, JobListingFiltersFormSchema
} from "@/schemas/jobListingFilters.ts";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Field} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {getAllFields} from "@/api/professionalField.ts";
import {getAllRegions} from "@/api/region.ts";
import type {ProfessionalField} from "@/schemas/professionalField.ts";
import type {Region} from "@/schemas/region.ts";
import {Separator} from "@/components/ui/separator.tsx";
import {hasJobSeekerApplied} from "@/api/jobSeeker.ts";
import {useAuth} from "@/context/AuthProvider.tsx";
import JobListingCard from "@/components/shared/JobListingCard.tsx";

const JobListingsPage = () => {

    const {role} = useAuth()
    const [jobListingsPage, setJobListingsPage] = useState<Pagination<JobListingReadSummary> | null>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [filters, setFilters] = useState<JobListingFilters>(defaultJobListingFilters)
    const [professionalFields, setProfessionalFields] = useState<ProfessionalField[]>([])
    const [regions, setRegions] = useState<Region[]>([])
    const [appliedJobListings, setAppliedJobListings] = useState<Record<string, boolean>>({})

    const {
        register,
        handleSubmit,
        control,
        formState: {isSubmitting},
        reset
    } = useForm<JobListingFiltersForm>({
        resolver: zodResolver(JobListingFiltersFormSchema)
    })

    useEffect(() => {
        const fetchJobListings = async () => {
            const jobListings = await getPaginatedFilteredJobListings({
                ...filters, deleted:false, page: currentPage
            })
            setJobListingsPage(jobListings)

            for (const listing of jobListings.content) {
                const hasApplied = await hasJobSeekerApplied(listing.uuid)
                setAppliedJobListings(prev => ({
                    ...prev,
                    [listing.uuid]: hasApplied
                }))
            }
        }
        const fetchRegions = async () => {
            setRegions(await getAllRegions())
        }
        const fetchProfessionalFields = async () => {
            setProfessionalFields(await getAllFields())
        }

        void fetchJobListings()
        void fetchRegions()
        void fetchProfessionalFields()
    }, [filters, currentPage]);

    const onSubmit = (data: JobListingFiltersForm) => {
        setCurrentPage(0)
        setFilters({
            ...defaultJobListingFilters,
            ...data
        })
    }

    const onClear = () => {
        setFilters(defaultJobListingFilters)
        reset()
    }

    return (
        <>
            <div className="w-full">
                {/*filters*/}
                <h1 className="text-left text-3xl pl-7 font-semibold text-primary">Job Listings</h1>
                <div className="w-full h-20 flex items-center bg-surface shadow-xl container-shadow rounded-md my-10">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="grid grid-cols-[auto_1fr] items-center gap-30 px-2">
                            <div className="pl-10 text-lg font-semibold">Filter</div>
                            <div className="grid grid-cols-5 gap-3 px-2">
                                <Field>
                                    <div>
                                        <Input id="title" type="text" {...register("title")} placeholder="Job Title..."
                                               className="rounded-md placeholder:text-text-muted">
                                        </Input>
                                    </div>
                                </Field>
                                <Field>
                                    <div>
                                        <Input id="employerBrandName" type="text" {...register("employerBrandName")}
                                               placeholder="Company..."
                                               className="rounded-md placeholder:text-text-muted">
                                        </Input>
                                    </div>
                                </Field>
                                <Field>
                                    <div>
                                        <Controller name="professionalFieldId" control={control} render={({field}) => (
                                            <Select onValueChange={(val) => field.onChange(Number(val))}
                                                    value={field.value ?? null}>
                                                <SelectTrigger className="w-full rounded-md">
                                                    <SelectValue placeholder="Industry" className="text-text-muted">
                                                        {professionalFields.find(professionalField => professionalField.id === field.value)?.name ?? "Industry"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem disabled>Industry</SelectItem>
                                                        {professionalFields.map((professionalField) => (
                                                            <SelectItem key={professionalField.id}
                                                                        value={professionalField.id}>
                                                                {professionalField.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}>
                                        </Controller>
                                    </div>
                                </Field>
                                <Field>
                                    <div>
                                        <Controller name="regionId" control={control} render={({field}) => (
                                            <Select onValueChange={(val) => field.onChange(Number(val))}
                                                    value={field.value ?? null}>
                                                <SelectTrigger className="w-full rounded-md">
                                                    <SelectValue placeholder="Region" className="text-text-muted">
                                                        {regions.find(region => region.id === field.value)?.name ?? "Region"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem disabled>Region</SelectItem>
                                                        {regions.map((region) => (
                                                            <SelectItem key={region.id} value={region.id}>
                                                                {region.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}>
                                        </Controller>
                                    </div>
                                </Field>
                                <div className="flex gap-2 mx-auto">
                                    <Button type="submit"
                                            className=" bg-primary-light hover:bg-primary-light-hover border border-primary-light-border
                                             text-text-light rounded-md p-2 cursor-pointer">
                                        {isSubmitting
                                            ? <span className="cursor-progress"><Funnel/></span>
                                            : <Funnel/>}
                                    </Button>
                                    <Button onClick={onClear}
                                            className="bg-background hover:bg-gray-200 border border-gray-300 text-danger rounded-md p-2 cursor-pointer"><X/></Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <Separator className="w-4/5! mx-auto bg-gray-300 my-15"/>

                {/*job listings*/}
                {(jobListingsPage?.content?.length ?? 0) > 0
                    ?
                    <div className="container w-full">
                        {jobListingsPage?.content.map((jobListing) => (
                            <JobListingCard role={role} jobListing={jobListing} hasApplied={appliedJobListings[jobListing.uuid]} />
                        ))}
                    </div>
                    :
                    <div className="container w-full h-50">
                        <div className="h-full content-center">
                            <p>There are currently no active job listings.</p>
                        </div>
                    </div>}

                {(jobListingsPage?.totalPages ?? 0) > 0 &&
                    <div className="flex justify-center gap-5">
                        <button
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            disabled={jobListingsPage?.first}
                            className="rounded-4xl cursor-pointer ease-in-out duration-300 hover:bg-primary-hover disabled:text-gray-400"
                        >
                            <ChevronLeft/>
                        </button>
                        <span className="font-semibold text-primary">
                            {currentPage + 1}/{jobListingsPage?.totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={jobListingsPage?.last}
                            className="rounded-4xl cursor-pointer ease-in-out duration-300 hover:bg-primary-hover disabled:text-gray-400"
                        >
                            <ChevronRight/>
                        </button>
                    </div>
                }
            </div>
        </>
    )
}

export default JobListingsPage