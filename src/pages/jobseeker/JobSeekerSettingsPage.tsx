import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {type JobSeekerReadDetails, type JobSeekerUpdate, jobSeekerUpdateSchema} from "@/schemas/jobSeeker.ts";
import type {ErrorResponse} from "@/schemas/error.ts";
import {toast} from "sonner";
import {useEffect, useState} from "react";
import type {Region} from "@/schemas/region.ts";
import {useNavigate} from "react-router";
import {useAuth} from "@/context/AuthProvider.tsx";
import {getAllRegions} from "@/api/region.ts";
import {deleteJobSeeker, getLoggedInJobSeekerDetails, updateJobSeeker} from "@/api/jobSeeker.ts";
import {Asterisk, Lock, SquarePen, Trash2} from "lucide-react";
import {Field, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import CustomAsterisk from "@/components/shared/CustomAsterisk.tsx";
import FieldErrorMessage from "@/components/shared/FieldErrorMessage.tsx";
import Optional from "@/components/shared/Optional.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import CustomButton from "@/components/shared/CustomButton.tsx";
import {type PasswordUpdate, passwordUpdateSchema} from "@/schemas/user.ts";
import {updateEmployerPassword} from "@/api/user.ts";
import {getErrorMessage} from "@/utils/errorMessages.ts";

const JobSeekerSettingsPage = () => {

    const navigate = useNavigate();
    const { logoutUser, username } = useAuth();
    const [jobSeekerInfo, setJobSeekerInfo] = useState<JobSeekerReadDetails | null>(null)
    const [regions, setRegions] = useState<Region[]>([])


    const {
        register: registerJobSeeker,
        handleSubmit: handleJobSeekerUpdateSubmit,
        control,
        formState: {errors: jobSeekerErrors, isSubmitting: isJobSeekerSubmitting},
        reset
    } = useForm<JobSeekerUpdate>({
        resolver: zodResolver(jobSeekerUpdateSchema)
    })

    const {
        register: registerPassword,
        handleSubmit: handlePasswordUpdateSubmit,
        formState: {errors: passwordErrors, isSubmitting: isPasswordSubmitting}
    } = useForm<PasswordUpdate>({
        resolver: zodResolver(passwordUpdateSchema)
    })

    const onJobSeekerSubmit = async (data: JobSeekerUpdate): Promise<void | ErrorResponse> => {
        try {
            await updateJobSeeker(data);
            toast.success("Your info was updated successfully!")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    const onPasswordSubmit = async (data: PasswordUpdate): Promise<void | ErrorResponse> => {
        try {
            console.log(data.oldPassword);
            await updateEmployerPassword(data);
            toast.success("Password was updated successfully!")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account?")) return
        try {
            if (!jobSeekerInfo?.uuid) return;
            await deleteJobSeeker(jobSeekerInfo?.uuid);
            toast.success("Your account was deleted")
            logoutUser()
            navigate("/login")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    useEffect(() => {
        const fetchRegions = async () => {
            setRegions(await getAllRegions())
        }
        const fetchJobSeeker = async () => {
            const data = await getLoggedInJobSeekerDetails()
            setJobSeekerInfo(data)
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
            <div className="w-full mx-auto my-auto bg-surface p-5 mt-12 border border-gray-200 rounded-sm shadow-xl shadow-surface-elevated">
                <div className="flex flex-col w-2/3 mx-auto text-left pt-5">
                        <span className="flex items-center gap-2 ">
                            <SquarePen size={30}/><h1 className="font-semibold text-3xl">Update your info</h1>
                        </span>
                    <div className="text-sm">Required fields are marked with an asterisk (
                        <span><Asterisk size={12} color="#a02200" strokeWidth={2} className="inline -mt-2"/></span>
                        ).
                    </div>
                </div>
                <form
                    onSubmit={handleJobSeekerUpdateSubmit(onJobSeekerSubmit)}
                    className="flex flex-col gap-8 w-2/3 mx-auto pt-5"
                >
                    <div className="flex flex-col gap-12">
                        <Field>
                            <Input type="hidden" {...registerJobSeeker("uuid")}></Input>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="firstname" className="font-sans text-lg">First Name<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="firstname" type="text" {...registerJobSeeker("firstname")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {jobSeekerErrors.firstname}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="lastname" className="font-sans text-lg">Last name<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="lastname" type="text" {...registerJobSeeker("lastname")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {jobSeekerErrors.lastname}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="email" className="font-sans text-lg">Email<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="email" type="email" {...registerJobSeeker("email")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {jobSeekerErrors.email}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="telephone" className="font-sans text-lg">Phone Number<Optional/></FieldLabel>
                            <div>
                                <Input id="telephone" type="text" {...registerJobSeeker("telephoneNumber")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {jobSeekerErrors.telephoneNumber}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="region" className="font-sans text-lg">Region<CustomAsterisk/></FieldLabel>
                            <div>
                                <Controller name="regionId" control={control} render={({ field }) => (
                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value??null}>
                                        <SelectTrigger className="w-full rounded-md">
                                            <SelectValue placeholder="Select a region"  className="text-gray-200">
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
                                <FieldErrorMessage error = {jobSeekerErrors.regionId}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="address" className="font-sans text-lg">Address<Optional/></FieldLabel>
                            <div>
                                <Input id="address" type="text" {...registerJobSeeker("address")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {jobSeekerErrors.address}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="username" className="font-sans text-lg">Username<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="username" type="text" {...registerJobSeeker("username")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {jobSeekerErrors.username}/>
                            </div>
                        </Field>
                    </div>
                    <CustomButton
                        type="submit"
                        label={isJobSeekerSubmitting ? "Saving..." : "Save"}
                        addClasses={`w-1/3 mx-auto ml-0 font-sans font-semibold text-lg mt-10 ${isJobSeekerSubmitting ? "cursor-progress" : "cursor-pointer"}`}>
                    </CustomButton>
                </form>

                <Separator className="w-4/5! mx-auto mt-15 bg-gray-400 "/>

                <div className="flex flex-col w-2/3 mx-auto text-left pt-5">
                    <span className="flex items-center gap-2">
                        <Lock size={24}/><h1 className="font-sans font-semibold text-2xl">Change your password</h1>
                    </span>
                </div>
                <form
                    onSubmit={handlePasswordUpdateSubmit(onPasswordSubmit)}
                    className="flex flex-col gap-8 w-2/3 mx-auto pt-5"
                >
                    <div className="flex flex-col gap-12">
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="oldPassword" className="font-sans text-lg">Current Password<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="oldPassword" type="password" {...registerPassword("oldPassword")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {passwordErrors.oldPassword}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="newPassword" className="font-sans text-lg">New Password<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="newPassword" type="password" {...registerPassword("newPassword")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {passwordErrors.newPassword}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="confirmPassword" className="font-sans text-lg">Confirm New Password<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="confirmPassword" type="password" {...registerPassword("confirmPassword")} className="rounded-md"></Input>
                                <div className="h-1 text-sm mt-1 text-start text-error-dark-red">
                                    <span>{passwordErrors.confirmPassword?.message}</span>
                                </div>
                            </div>
                        </Field>
                    </div>
                    <CustomButton
                        type="submit"
                        label={isPasswordSubmitting ? "Saving..." : "Save"}
                        addClasses={`w-1/3 mx-auto ml-0 font-sans font-semibold text-lg mt-10 ${isPasswordSubmitting ? "cursor-progress" : "cursor-pointer"}`}>
                    </CustomButton>
                </form>

                <Separator className="w-4/5! mx-auto mt-15 bg-gray-400 "/>

                <div className="flex flex-col w-2/3 mx-auto text-left pt-5 pb-5">
                    <div className="flex items-center text-red-700/80 gap-2">
                        <Trash2 /><h1 className="font-sans font-semibold text-2xl">Delete your Account</h1>
                    </div>
                    <span className="text-sm font-sans -mt-2 mb-8">This action will deactivate your account permanently.</span>
                    <CustomButton
                        label="Delete Account"
                        onClick={handleDelete}
                        addClasses="w-1/3 mx-auto ml-0 font-sans font-semibold text-lg">
                    </CustomButton>
                </div>
            </div>

        </>
    )
}

export default JobSeekerSettingsPage