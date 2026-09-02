import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {type JobSeekerReadDetails, type JobSeekerUpdate, jobSeekerUpdateSchema} from "@/schemas/jobSeeker.ts";
import type {ErrorResponse} from "@/schemas/error.ts";
import {deleteEmployer} from "@/api/employer.ts";
import {toast} from "sonner";
import {useEffect, useState} from "react";
import type {Region} from "@/schemas/region.ts";
import {useNavigate} from "react-router";
import {useAuth} from "@/context/AuthProvider.tsx";
import {getAllRegions} from "@/api/region.ts";
import {getLoggedInJobSeekerDetails, updateJobSeeker} from "@/api/jobSeeker.ts";
import {Asterisk, SquarePen, Trash2} from "lucide-react";
import {Field, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import CustomAsterisk from "@/components/shared/CustomAsterisk.tsx";
import FieldErrorMessage from "@/components/shared/FieldErrorMessage.tsx";
import Optional from "@/components/shared/Optional.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import CustomButton from "@/components/shared/CustomButton.tsx";

const JobSeekerSettingsPage = () => {

    const navigate = useNavigate();
    const { logoutUser, username } = useAuth();
    const [jobSeekerInfo, setjobSeekerInfo] = useState<JobSeekerReadDetails | null>(null)
    const [regions, setRegions] = useState<Region[]>([])


    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting},
        reset
    } = useForm<JobSeekerUpdate>({
        resolver: zodResolver(jobSeekerUpdateSchema)
    })

    const onSubmit = async (data: JobSeekerUpdate): Promise<void | ErrorResponse> => {
        try {
            await updateJobSeeker(data);
            toast.success("Your info was updated successfully!")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(err.message)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account?")) return
        try {
            if (!jobSeekerInfo?.uuid) return;
            await deleteEmployer(jobSeekerInfo?.uuid);
            toast.success("Your account was deleted")
            logoutUser()
            navigate("/login")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(err.message)
        }
    }

    useEffect(() => {
        const fetchRegions = async () => {
            setRegions(await getAllRegions())
        }
        const fetchJobSeeker = async () => {
            const data = await getLoggedInJobSeekerDetails()
            setjobSeekerInfo(data)
            reset({
                uuid: data.uuid,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.personalInfoDetailsReadOnlyDTO.email,
                telephoneNumber: data.personalInfoDetailsReadOnlyDTO.telephoneNumber ?? "",
                address: data.personalInfoDetailsReadOnlyDTO.address ?? "",
                regionId: data.personalInfoDetailsReadOnlyDTO.regionId,
                username: username ?? ""
            })
        }

        void fetchJobSeeker();
        void fetchRegions();
    }, [reset, username]);

    return (
        <>
            <div className="w-full mx-auto my-auto bg-white p-5 mt-12 border border-gray-200 rounded-sm shadow-xl shadow-gray-200">
                <div className="flex flex-col w-2/3 mx-auto text-left pt-5">
                        <span className="flex items-center gap-2 text-font-dark-purple">
                            <SquarePen size={30}/><h1 className="font-sans font-semibold text-3xl">Update your info</h1>
                        </span>
                    <div className="text-sm">Required fields are marked with an asterisk (
                        <span><Asterisk size={12} color="#a02200" strokeWidth={2} className="inline -mt-2"/></span>
                        ).
                    </div>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-8 w-2/3 mx-auto pt-5"
                >
                    <div className="flex flex-col gap-12">
                        <Field>
                            <Input type="hidden" {...register("uuid")}></Input>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="firstname" className="font-sans text-lg">First Name<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="firstname" type="text" {...register("firstname")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {errors.firstname}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="lastname" className="font-sans text-lg">Last name<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="lastname" type="text" {...register("lastname")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {errors.lastname}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="email" className="font-sans text-lg">Email<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="email" type="email" {...register("email")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {errors.email}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="telephone" className="font-sans text-lg">Phone Number<Optional/></FieldLabel>
                            <div>
                                <Input id="telephone" type="text" {...register("telephoneNumber")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {errors.telephoneNumber}/>
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
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="address" className="font-sans text-lg">Address<Optional/></FieldLabel>
                            <div>
                                <Input id="address" type="text" {...register("address")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {errors.address}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="username" className="font-sans text-lg">Username<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="username" type="text" {...register("username")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {errors.username}/>
                            </div>
                        </Field>
                    </div>
                    <Button type="submit" className="w-1/3 mx-auto ml-0 font-sans font-semibold text-lg bg-font-dark-purple hover:bg-hover-dark-purple rounded-md py-6 mt-10 cursor-pointer">
                        {isSubmitting ? <span className="cursor-progress">Saving...</span> : "Save"}
                    </Button>
                </form>

                <Separator className="w-4/5! mx-auto mt-15 bg-gray-400 "/>

                <div className="flex flex-col w-2/3 mx-auto text-left pt-5">
                    <span className="flex items-center text-red-800 gap-2">
                        <Trash2 /><h1 className="font-sans font-semibold text-2xl ">Delete your Account</h1>
                    </span>
                    <span className="text-sm font-sans -mt-2 mb-8">This action will deactivate your account permanently.</span>
                    <CustomButton label="Delete Account" onClick={handleDelete} addClasses="w-1/3 mx-auto ml-0 font-sans font-semibold text-lg"></CustomButton>
                </div>
            </div>

        </>
    )
}

export default JobSeekerSettingsPage