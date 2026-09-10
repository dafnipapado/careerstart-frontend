import {useEffect, useState} from "react";
import type {ProfessionalField} from "@/schemas/professionalField.ts";
import type {Region} from "@/schemas/region.ts";
import {Controller, useForm} from "react-hook-form";
import {
    type EmployerReadDetails,
    type EmployerUpdate,
    employerUpdateSchema
} from "@/schemas/employer.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {getAllFields} from "@/api/professionalField.ts";
import {getAllRegions} from "@/api/region.ts";
import {Asterisk, Lock, SquarePen, Trash2} from "lucide-react";
import {Field, FieldLabel} from "@/components/ui/field.tsx";
import CustomAsterisk from "@/components/shared/CustomAsterisk.tsx";
import {Input} from "@/components/ui/input.tsx";
import FieldErrorMessage from "@/components/shared/FieldErrorMessage.tsx";
import Optional from "@/components/shared/Optional.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import type {ErrorResponse} from "@/schemas/error.ts";
import {deleteEmployer, getLoggedInEmployerDetails, updateEmployer} from "@/api/employer.ts";
import {toast} from "sonner";
import {Separator} from "@/components/ui/separator.tsx";
import CustomButton from "@/components/shared/CustomButton.tsx";
import {useNavigate} from "react-router";
import {useAuth} from "@/context/AuthProvider.tsx";
import {type PasswordUpdate, passwordUpdateSchema} from "@/schemas/user.ts";
import {updateEmployerPassword} from "@/api/user.ts";
import {Textarea} from "@/components/ui/textarea.tsx";

const EmployerSettingsPage = () => {

    const navigate = useNavigate();
    const { logoutUser, username } = useAuth();
    const [employerInfo, setEmployerInfo] = useState<EmployerReadDetails | null>(null)
    const [professionalFields, setProfessionalFields] = useState<ProfessionalField[]>([])
    const [regions, setRegions] = useState<Region[]>([])

    const {
        register: registerEmployer,
        handleSubmit: handleEmployerUpdateSubmit,
        control,
        formState: {errors: employerErrors, isSubmitting: isEmployerSubmitting},
        reset
    } = useForm<EmployerUpdate>({
        resolver: zodResolver(employerUpdateSchema)
    })

    const {
        register: registerPassword,
        handleSubmit: handlePasswordUpdateSubmit,
        formState: {errors: passwordErrors, isSubmitting: isPasswordSubmitting}
    } = useForm<PasswordUpdate>({
        resolver: zodResolver(passwordUpdateSchema)
    })

    const onEmployerSubmit = async (data: EmployerUpdate): Promise<void | ErrorResponse> => {
        try {
            await updateEmployer(data);
            toast.success("Your info was updated successfully!")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(err.message)
        }
    }

    const onPasswordSubmit = async (data: PasswordUpdate): Promise<void | ErrorResponse> => {
        try {
            console.log(data.oldPassword);
            await updateEmployerPassword(data);
            toast.success("Password was updated successfully!")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(err.message)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account?")) return
        try {
            if (!employerInfo?.uuid) return;
            await deleteEmployer(employerInfo?.uuid);
            toast.success("Your account was deleted")
            logoutUser()
            navigate("/login")
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(err.message)
        }
    }

    useEffect(() => {
        const fetchProfessionalFields = async () => {
            setProfessionalFields(await getAllFields())
        }
        const fetchRegions = async () => {
            setRegions(await getAllRegions())
        }
        const fetchEmployer = async () => {
            const data = await getLoggedInEmployerDetails()
            setEmployerInfo(data)
            reset({
                uuid: data.uuid,
                brandName: data.brandName,
                vat: data.vat,
                website: data.website ?? "",
                professionalFieldId: data.professionalFieldId,
                email: data.personalInfoDetailsReadOnlyDTO.email,
                telephoneNumber: data.personalInfoDetailsReadOnlyDTO.telephoneNumber ?? "",
                address: data.personalInfoDetailsReadOnlyDTO.address ?? "",
                regionId: data.personalInfoDetailsReadOnlyDTO.regionId,
                username: username ?? ""
            })
        }

        void fetchEmployer()
        void fetchProfessionalFields();
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
                    onSubmit={handleEmployerUpdateSubmit(onEmployerSubmit)}
                    className="flex flex-col gap-8 w-2/3 mx-auto pt-5"
                >
                    <div className="flex flex-col gap-12">
                        <Field>
                            <Input type="hidden" {...registerEmployer("uuid")}></Input>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="brandName" className="font-sans text-lg">Brand Name<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="brandName" type="text" {...registerEmployer("brandName")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {employerErrors.brandName}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr] h-40">
                            <FieldLabel htmlFor="profile" className="font-sans text-lg">Company profile<CustomAsterisk/></FieldLabel>
                            <div>
                                <Textarea id="profile" {...registerEmployer("profile")} className="rounded-md h-40"></Textarea>
                                <FieldErrorMessage error = {employerErrors.profile}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="vat" className="font-sans text-lg">VAT<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="vat" type="text" {...registerEmployer("vat")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {employerErrors.vat}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="website" className="font-sans text-lg">Website<Optional/></FieldLabel>
                            <div>
                                <Input id="website" type="text" {...registerEmployer("website")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {employerErrors.website}/>
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
                                <FieldErrorMessage error = {employerErrors.professionalFieldId}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="email" className="font-sans text-lg">Email<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="email" type="email" {...registerEmployer("email")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {employerErrors.email}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="telephone" className="font-sans text-lg">Phone Number<Optional/></FieldLabel>
                            <div>
                                <Input id="telephone" type="text" {...registerEmployer("telephoneNumber")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {employerErrors.telephoneNumber}/>
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
                                <FieldErrorMessage error = {employerErrors.regionId}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="address" className="font-sans text-lg">Address<Optional/></FieldLabel>
                            <div>
                                <Input id="address" type="text" {...registerEmployer("address")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {employerErrors.address}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="username" className="font-sans text-lg">Username<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="username" type="text" {...registerEmployer("username")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {employerErrors.username}/>
                            </div>
                        </Field>
                    </div>
                    <CustomButton
                        type="submit"
                        label={isEmployerSubmitting ? "Saving..." : "Save"}
                        addClasses={`w-1/3 mx-auto ml-0 font-sans font-semibold text-lg mt-10 ${isEmployerSubmitting ? "cursor-progress" : "cursor-pointer"}`}>
                    </CustomButton>
                </form>

                <Separator className="w-4/5! mx-auto mt-15 bg-gray-400 "/>

                <div className="flex flex-col w-2/3 mx-auto text-left pt-5">
                    <span className="flex items-center gap-2 text-font-dark-purple">
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

                <div className="flex flex-col w-2/3 mx-auto text-left pt-5">
                    <span className="flex items-center text-red-800 gap-2">
                        <Trash2 /><h1 className="font-sans font-semibold text-2xl ">Delete your Account</h1>
                    </span>
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

export default EmployerSettingsPage