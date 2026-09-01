import {Field, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import FieldErrorMessage from "@/components/shared/FieldErrorMessage.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import type {ErrorResponse} from "@/schemas/error.ts";
import {toast} from "sonner";
import {type JobListingInsert, jobListingInsertSchema} from "@/schemas/jobListing.ts";
import {Asterisk} from "lucide-react";
import CustomAsterisk from "@/components/shared/CustomAsterisk.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {insertJobListing} from "@/api/jobListing.ts";
import {useEffect, useState} from "react";
import {getAllFields} from "@/api/professionalField.ts";
import type {ProfessionalField} from "@/schemas/professionalField.ts";
import type {Region} from "@/schemas/region.ts";
import {getAllRegions} from "@/api/region.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {useNavigate} from "react-router";

const JobListingCreatePage = () => {

    const navigate = useNavigate()
    const [professionalFields, setProfessionalFields] = useState<ProfessionalField[]>([])
    const [regions, setRegions] = useState<Region[]>([])

    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting}
    } = useForm<JobListingInsert>({
        resolver: zodResolver(jobListingInsertSchema)
    })

    useEffect(() => {
        const fetchProfessionalFields = async () => {
            setProfessionalFields(await getAllFields())
        }
        const fetchRegions = async () => {
            setRegions(await getAllRegions())
        }

        void fetchProfessionalFields()
        void fetchRegions()
    }, [])

    const onSubmit = async (data: JobListingInsert): Promise<void | ErrorResponse> => {
        try {
            await insertJobListing(data);
            toast.success("Job Listing posted successfully")
            navigate(`/employer/dashboard`)
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(err.message)
        }
    }

    return (
        <>
                <div className="w-full mx-auto my-auto bg-white p-5 mt-12 border border-gray-200 rounded-sm shadow-xl shadow-gray-200">
                    <h1 className="font-sans font-semibold text-3xl text-font-dark-purple">Post a job listing</h1>
                    <div className="text-sm">Required fields are marked with an asterisk (
                        <span><Asterisk size={12} color="#a02200" strokeWidth={2} className="inline -mt-2"/></span>
                        ).
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-8 w-2/3 mx-auto pt-15"
                    >
                        <div className="flex flex-col gap-12">
                            <Field className="grid grid-cols-[1fr_2fr]">
                                <FieldLabel htmlFor="title" className="font-sans text-lg">Job Title<CustomAsterisk/></FieldLabel>
                                <div>
                                    <Input id="title" type="text" {...register("title")} className="rounded-md"></Input>
                                    <FieldErrorMessage error = {errors.title}/>
                                </div>
                            </Field>
                            <Field className="grid grid-cols-[1fr_2fr] h-40">
                                <FieldLabel htmlFor="description" className="font-sans text-lg">Job Description<CustomAsterisk/></FieldLabel>
                                <div>
                                    <Textarea id="description"{...register("description")} className="rounded-md h-40"></Textarea>
                                    <FieldErrorMessage error = {errors.description}/>
                                </div>
                            </Field>
                            <Field className="grid grid-cols-[1fr_2fr]">
                                <FieldLabel htmlFor="professionalField" className="font-sans text-lg">Industry<CustomAsterisk/></FieldLabel>
                                <div>
                                    <Controller name="professionalFieldId" control={control} render={({ field }) => (
                                        <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value??null}>
                                            <SelectTrigger className="w-full rounded-md">
                                                <SelectValue placeholder="Select an industry">
                                                    {professionalFields.find(professionalField => professionalField.id === field.value)?.name ?? "Select an industry"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem disabled>Select an industry</SelectItem>
                                                    {professionalFields.map((professionalField) => (
                                                        <SelectItem key={professionalField.id} value={professionalField.id}>
                                                            {professionalField.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )} >
                                    </Controller>
                                    <FieldErrorMessage error = {errors.professionalFieldId}/>
                                </div>
                            </Field>
                            <Field className="grid grid-cols-[1fr_2fr]">
                                <FieldLabel htmlFor="region" className="font-sans text-lg">Region<CustomAsterisk/></FieldLabel>
                                <div>
                                    <Controller name="regionId" control={control} render={({ field }) => (
                                        <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value??null}>
                                            <SelectTrigger className="w-full rounded-md">
                                                <SelectValue placeholder="Select a region">
                                                    {regions.find(region => region.id === field.value)?.name ?? "Select a region"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem disabled>Select a region</SelectItem>
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
                                    <FieldErrorMessage error = {errors.regionId}/>
                                </div>
                            </Field>
                        </div>
                        <Button type="submit" className="w-1/2 mx-auto font-sans font-semibold text-lg bg-font-dark-purple hover:bg-hover-dark-purple rounded-md py-5 mt-10 cursor-pointer">
                            {isSubmitting ? <span className="cursor-progress">Posting...</span> : "Post"}
                        </Button>
                    </form>
            </div>
        </>
    )
}

export default JobListingCreatePage