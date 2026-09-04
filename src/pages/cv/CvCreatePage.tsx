import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {type CvInsert, cvInsertSchema} from "@/schemas/cv.ts";
import type {ErrorResponse} from "@/schemas/error.ts";
import {toast} from "sonner";
import {useNavigate} from "react-router";
import {insertCv} from "@/api/cv.ts";
import {Field, FieldLabel} from "@/components/ui/field.tsx";
import CustomAsterisk from "@/components/shared/CustomAsterisk.tsx";
import {Input} from "@/components/ui/input.tsx";
import FieldErrorMessage from "@/components/shared/FieldErrorMessage.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";

const CvCreatePage = () => {

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<CvInsert>({
        resolver: zodResolver(cvInsertSchema)
    })

    const onSubmit = async (data: CvInsert): Promise<void | ErrorResponse> => {
        try {
            await insertCv(data);
            toast.success("Your CV was created successfully!")
            navigate(`/job_seeker/dashboard`)
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(err.message)
        }
    }

    return (
        <>
            <div className="w-full mx-auto my-auto bg-white p-5 mt-12 border border-gray-200 rounded-sm shadow-xl shadow-gray-200">
                <h1 className="font-sans font-semibold text-3xl text-font-dark-purple">Create your CV</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-8 w-2/3 mx-auto pt-15"
                >
                    <div className="flex flex-col gap-12">
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="profession" className="font-sans text-lg">Job Title<CustomAsterisk/></FieldLabel>
                            <div>
                                <Input id="profession" type="text" {...register("profession")} className="rounded-md"></Input>
                                <FieldErrorMessage error = {errors.profession}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="bio" className="font-sans text-lg">Bio</FieldLabel>
                            <div>
                                <Textarea id="bio"{...register("bio")} className="rounded-md h-40"></Textarea>
                                <FieldErrorMessage error = {errors.bio}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="education" className="font-sans text-lg">Education</FieldLabel>
                            <div>
                                <Textarea id="education"{...register("education")} className="rounded-md h-40"></Textarea>
                                <FieldErrorMessage error = {errors.education}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="experience" className="font-sans text-lg">Professional Experience</FieldLabel>
                            <div>
                                <Textarea id="experience"{...register("experience")} className="rounded-md h-40"></Textarea>
                                <FieldErrorMessage error = {errors.experience}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="certificates" className="font-sans text-lg">Certificates</FieldLabel>
                            <div>
                                <Textarea id="certificates"{...register("certificates")} className="rounded-md h-40"></Textarea>
                                <FieldErrorMessage error = {errors.certificates}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="languages" className="font-sans text-lg">Languages</FieldLabel>
                            <div>
                                <Textarea id="languages"{...register("languages")} className="rounded-md h-40"></Textarea>
                                <FieldErrorMessage error = {errors.languages}/>
                            </div>
                        </Field>
                        <Field className="grid grid-cols-[1fr_2fr]">
                            <FieldLabel htmlFor="skills" className="font-sans text-lg">Skills</FieldLabel>
                            <div>
                                <Textarea id="skills"{...register("skills")} className="rounded-md h-40"></Textarea>
                                <FieldErrorMessage error = {errors.skills}/>
                            </div>
                        </Field>
                    </div>
                    <Button type="submit" className="w-1/2 mx-auto font-sans font-semibold text-lg bg-font-dark-purple hover:bg-hover-dark-purple rounded-md py-5 mt-10 cursor-pointer">
                        {isSubmitting ? <span className="cursor-progress">Saving...</span> : "Save"}
                    </Button>
                </form>
            </div>

        </>
    )
}

export default CvCreatePage