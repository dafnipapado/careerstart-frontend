import {z} from "zod";

export const cvSchema = z.object({
    id: z
        .number()
        .min(1),
    uuid: z
        .uuid(),
    profession: z
        .string()
        .min(3, {error: "Must have at least 3 characters"}),
    bio: z
        .string()
        .optional(),
    education: z
        .string()
        .optional(),
    experience: z
        .string()
        .optional(),
    certificates: z
        .string()
        .optional(),
    languages: z
        .string()
        .optional(),
    skills: z
        .string()
        .optional(),
    jobSeekerId: z
        .number()
        .min(1)
})

export type Cv = z.infer<typeof cvSchema>

export const cvInsertSchema = cvSchema.omit({
    id: true,
    uuid: true,
    jobSeekerId: true
})

export type CvInsert = z.infer<typeof cvInsertSchema>

export const cvUpdateSchema = cvSchema.omit({
    id: true,
    jobSeekerId: true
})

export type CvUpdate = z.infer<typeof cvUpdateSchema>

export const cvReadSchema = cvSchema.omit({
    id: true
})

export type CvRead = z.infer<typeof cvReadSchema>