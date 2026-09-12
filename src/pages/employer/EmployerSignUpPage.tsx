import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {type EmployerInsert, employerInsertSchema} from "@/schemas/employer.ts";
import type {ErrorResponse} from "@/schemas/error.ts";
import {toast} from "sonner";
import {Field, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router";
import {insertEmployer} from "@/api/employer.ts";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {getAllRegions} from "@/api/region.ts";
import {useEffect, useState} from "react";
import type {Region} from "@/schemas/region.ts";
import type {ProfessionalField} from "@/schemas/professionalField.ts";
import {getAllFields} from "@/api/professionalField.ts";
import CustomAsterisk from "@/components/shared/CustomAsterisk.tsx";
import Optional from "@/components/shared/Optional.tsx";
import {Asterisk} from "lucide-react";
import FieldErrorMessage from "@/components/shared/FieldErrorMessage.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {getErrorMessage} from "@/utils/errorMessages.ts";

const EmployerSignUpPage = () => {

    const navigate = useNavigate()

    const [professionalFields, setProfessionalFields] = useState<ProfessionalField[]>([])
    const [regions, setRegions] = useState<Region[]>([])

    const {
        register,
        handleSubmit,
        control,
        formState: {errors, isSubmitting}
    } = useForm<EmployerInsert>({
        resolver: zodResolver(employerInsertSchema)
    })

    const onSubmit = async (data: EmployerInsert): Promise<void | ErrorResponse> => {
        try {
            await insertEmployer(data);
            toast.success("Your account was created successfully!")
            navigate(`/login`)
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    useEffect(() => {
        const fetchProfessionalFields = async () => {
            setProfessionalFields(await getAllFields())
        }
        const fetchRegions = async () => {
            setRegions(await getAllRegions())
        }

        void fetchProfessionalFields();
        void fetchRegions();
    }, []);

    return (
        <>
            <div className="w-full mx-auto my-auto bg-white p-5 mt-12 border border-gray-200 rounded-sm shadow-xl shadow-gray-200">
                <h1 className="font-sans font-semibold text-3xl text-primary-dark-purple">Create your account</h1>
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
                                <FieldLabel htmlFor="brandName" className="font-sans text-lg">Brand Name<CustomAsterisk/></FieldLabel>
                                <div>
                                    <Input id="brandName" type="text" {...register("brandName")} className="rounded-md"></Input>
                                    <FieldErrorMessage error = {errors.brandName}/>
                                </div>
                            </Field>
                            <Field className="grid grid-cols-[1fr_2fr] h-40">
                                <FieldLabel htmlFor="profile" className="font-sans text-lg">Company profile<CustomAsterisk/></FieldLabel>
                                <div>
                                    <Textarea id="profile" {...register("profile")} className="rounded-md h-40"></Textarea>
                                    <FieldErrorMessage error = {errors.profile}/>
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
                            <Field className="grid grid-cols-[1fr_2fr]">
                                <FieldLabel htmlFor="password" className="font-sans text-lg">Password<CustomAsterisk/></FieldLabel>
                                <div>
                                    <Input id="password" type="password" {...register("password")} className="rounded-md"></Input>
                                    <FieldErrorMessage error = {errors.password}/>
                                </div>
                            </Field>
                            <Field className="grid grid-cols-[1fr_2fr]">
                                <FieldLabel htmlFor="confirmPassword" className="font-sans text-lg">Confirm Password<CustomAsterisk/></FieldLabel>
                                <div>
                                    <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="rounded-md"></Input>
                                    <FieldErrorMessage error = {errors.confirmPassword}/>
                                </div>
                            </Field>
                        </div>
                    <Button type="submit" className="w-1/2 mx-auto font-sans font-semibold text-lg text-white bg-primary-dark-purple hover:bg-hover-dark-purple rounded-md py-5 mt-10 cursor-pointer">
                        {isSubmitting ? <span className="cursor-progress">Signing you up...</span> : "Sign Up"}
                    </Button>
                </form>
            </div>
        </>
    )
}

export default EmployerSignUpPage