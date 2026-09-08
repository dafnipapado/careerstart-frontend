import {Link} from "react-router";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {BadgeCheck, ChevronLeft, ChevronRight, Dot, Factory, Funnel, MapPin, X} from "lucide-react";
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

const JobListingsPage = () => {

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
                ...filters, page: currentPage
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
                <h1 className="text-left text-3xl pl-7 font-semibold">Job Listings</h1>
                <div className="w-full h-20 flex items-center bg-white border border-gray-200 rounded-md my-10">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="grid grid-cols-[auto_1fr] items-center gap-30 px-2">
                            <div className="pl-10 text-lg font-semibold">Filter</div>
                            <div className="grid grid-cols-5 gap-3 px-2">
                                <Field>
                                    <div>
                                        <Input id="title" type="text" {...register("title")} placeholder="Job Title..."
                                               className="rounded-md"></Input>
                                    </div>
                                </Field>
                                <Field>
                                    <div>
                                        <Input id="employerBrandName" type="text" {...register("employerBrandName")}
                                               placeholder="Company..."
                                               className="rounded-md"></Input>
                                    </div>
                                </Field>
                                <Field>
                                    <div>
                                        <Controller name="professionalFieldId" control={control} render={({field}) => (
                                            <Select onValueChange={(val) => field.onChange(Number(val))}
                                                    value={field.value ?? null}>
                                                <SelectTrigger className="w-full rounded-md">
                                                    <SelectValue placeholder="Industry">
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
                                                    <SelectValue placeholder="Region">
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
                                            className=" bg-font-dark-purple hover:bg-hover-dark-purple text-white rounded-md p-2 cursor-pointer">
                                        {isSubmitting
                                            ? <span className="cursor-progress"><Funnel/></span>
                                            : <Funnel/>}
                                    </Button>
                                    <Button onClick={onClear}
                                            className="bg-gray-200 border border-gray-300 text-red-800 rounded-md  p-2 cursor-pointer"><X/></Button>
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
                            <Card key={jobListing.uuid} className="flex flex-col mx-auto w-full h-50 p-5 mb-10">
                                <CardHeader className="flex items-center justify-between">
                                    <CardTitle className="text-2xl flex items-center gap-5">
                                        <div key={jobListing.title}>
                                            {jobListing.title}
                                        </div>
                                        {appliedJobListings[jobListing.uuid] && (
                                            <div className="flex text-xs text-white figtree-custom-italics bg-green-600 rounded-sm p-1 h-5 items-center gap-1">
                                                <BadgeCheck size={16}/>
                                                <p>applied</p>
                                            </div>
                                        )}
                                    </CardTitle>
                                    <CardDescription className="text-gray-500">
                                        <div key={jobListing.dateCreated.slice(0, 10)}>
                                            {jobListing.dateCreated.slice(0, 10)}
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                <div className="flex flex-col text-base font-sans">
                                    <div className="self-start ml-7 -mt-5 text-sm figtree-custom-italics text-red-800"
                                         key={jobListing.professionalFieldName}>
                                        {jobListing.professionalFieldName}
                                    </div>
                                    <div className="flex items-baseline gap-1 ml-5 mt-3 text-sm font-medium">
                                <span className="flex gap-1">
                                    <MapPin strokeWidth={1.25} size={20}/>
                                    <div key={jobListing.regionName}>
                                        {jobListing.regionName}
                                    </div>
                                </span>
                                <Dot/>
                                <span className="flex gap-1">
                                    <Factory strokeWidth={1.25} size={20}/>
                                    <Link to={`/job_seeker/employer/${jobListing.employerUuid}`}>
                                        <div key={jobListing.employerBrandName}>
                                            {jobListing.employerBrandName}
                                        </div>
                                    </Link>
                                </span>
                                    </div>
                                </div>
                                <CardFooter className="w-full mt-auto text-font-dark-purple">
                                    <Link to={`/job-listings/${jobListing.uuid}`} className="w-full">
                                        <Button
                                            className="w-full border border-font-dark-purple hover:bg-gray-200 px-4 py-2 rounded-sm cursor-pointer">View
                                            Listing ⟶</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
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
                            className="rounded-4xl cursor-pointer ease-in-out duration-300 hover:bg-font-dark-purple/20 disabled:text-gray-400"
                        >
                            <ChevronLeft/>
                        </button>
                        <span className="font-semibold">
                            {currentPage + 1}/{jobListingsPage?.totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={jobListingsPage?.last}
                            className="rounded-4xl cursor-pointer ease-in-out duration-300 hover:bg-font-dark-purple/20 disabled:text-gray-400"
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