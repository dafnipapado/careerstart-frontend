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
import {Asterisk, SquarePen, Trash2} from "lucide-react";
import {Field, FieldLabel} from "@/components/ui/field.tsx";
import CustomAsterisk from "@/components/shared/CustomAsterisk.tsx";
import {Input} from "@/components/ui/input.tsx";
import FieldErrorMessage from "@/components/shared/FieldErrorMessage.tsx";
import Optional from "@/components/shared/Optional.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import type {ErrorResponse} from "@/schemas/error.ts";
import {deleteEmployer, getLoggedInEmployerDetails, updateEmployer} from "@/api/employer.ts";
import {toast} from "sonner";
import {Separator} from "@/components/ui/separator.tsx";
import CustomButton from "@/components/shared/CustomButton.tsx";
import {useNavigate} from "react-router";
import {useAuth} from "@/context/AuthProvider.tsx";

const EmployerSettingsPage = () => {

    const navigate = useNavigate();
    const { logoutUser, username } = useAuth();
    const [employerInfo, setEmployerInfo] = useState<EmployerReadDetails | null>(null)
    const [professionalFields, setProfessionalFields] = useState<ProfessionalField[]>([])
    const [regions, setRegions] = useState<Region[]>([])

    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting},
        reset
    } = useForm<EmployerUpdate>({
        resolver: zodResolver(employerUpdateSchema)
    })

    const onSubmit = async (data: EmployerUpdate): Promise<void | ErrorResponse> => {
        try {
            await updateEmployer(data);
            toast.success("Your info was updated successfully!")
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
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-8 w-2/3 mx-auto pt-5"
                >
                    <div className="flex flex-col gap-12">
                        <Field>
                            <Input type="hidden" {...register("uuid")}></Input>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="brandName" className="font-sans text-lg">Brand Name<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="brandName" type="text" {...register("brandName")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {errors.brandName}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="vat" className="font-sans text-lg">VAT<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="vat" type="text" {...register("vat")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {errors.vat}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="website" className="font-sans text-lg">Website<Optional/></FieldLabel>
                            <div>
                                <Input id="website" type="text" {...register("website")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {errors.website}/>
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

export default EmployerSettingsPage