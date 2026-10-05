import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {type CvUpdate, cvUpdateSchema} from "@/schemas/cv.ts";
import type {ErrorResponse} from "@/schemas/error.ts";
import {toast} from "sonner";
import {useNavigate, useParams} from "react-router";
import {getJobSeekerCv, updateCv} from "@/api/cv.ts";
import {Field, FieldLabel} from "@/components/ui/field.tsx";
import CustomAsterisk from "@/components/shared/CustomAsterisk.tsx";
import {Input} from "@/components/ui/input.tsx";
import FieldErrorMessage from "@/components/shared/FieldErrorMessage.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {useEffect} from "react";
import {getErrorMessage} from "@/utils/errorMessages.ts";
import CustomButton from "@/components/shared/CustomButton.tsx";

const CvUpdatePage = () => {

    const navigate = useNavigate()
    const { jobSeekerUuid } = useParams()

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset
    } = useForm<CvUpdate>({
        resolver: zodResolver(cvUpdateSchema)
    })

    useEffect(() => {
        const fetchCv = async () => {
            const data = await getJobSeekerCv(jobSeekerUuid!)
            reset({
                uuid: data.uuid,
                profession: data.profession,
                bio: data.bio,
                education: data.education,
                experience: data.experience,
                certificates: data.certificates,
                languages: data.languages,
                skills: data.skills
            })
        }

        void fetchCv()
    }, [reset, jobSeekerUuid])

    const onSubmit = async (data: CvUpdate): Promise<void | ErrorResponse> => {
        try {
            await updateCv(data);
            toast.success("Your CV was updated successfully")
            navigate(`/job_seeker/dashboard`)
        } catch (error) {
            const err = error as ErrorResponse
            toast.error(getErrorMessage(err.code))
        }
    }

    return (
        <>
            <div className="w-full mx-auto my-auto p-5 mt-12 bg-surface rounded-sm shadow-xl container-shadow">
                <h1 className="font-semibold text-3xl text-primary">Edit your CV</h1>
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
                    <CustomButton
                        type="submit"
                        label={isSubmitting ? "Saving..." : "Save"}
                        addClasses={`w-1/2 font-sans font-semibold text-lg rounded-md mx-auto mt-10 ${isSubmitting ? "cursor-progress" : "cursor-pointer"}`}>
                    </CustomButton>
                </form>
            </div>

        </>
    )
}

export default CvUpdatePage