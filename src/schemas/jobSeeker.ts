import {z} from "zod";
import {personalInfoSchema} from "./personalInfo.ts";
import {auditingSchema} from "@/schemas/auditing.ts";

export const jobSeekerSchema = z
    .object({
        id: z
            .number()
            .min(1),
        uuid: z.uuid(),
        firstname: z
            .string()
            .min(3, {error: "Must be at least 3 characters"}),
        lastname: z
            .string()
            .min(3, {error: "Must be at least 3 characters"}),
        username: z
            .string()
            .min(3, {error: "Must be at least 3 characters"})
            .max(30, {error: "Must be no longer than 30 characters"}),
        password: z
            .string()
            .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&+=]).{8,}$/,
                {error: "Must be at least 8 characters, consisting of one capital letter, " +
                        "one lowercase letter, one digit and one special character"})
    })
    .extend(auditingSchema.shape)
    .extend(personalInfoSchema.shape)

export type JobSeeker = z.infer<typeof jobSeekerSchema>;

export const jobSeekerInsertSchema = jobSeekerSchema.omit({
    id: true,
    uuid: true,
    dateCreated: true,
    updatedAt: true,
    deleted: true,
    deletedAt: true,
    regionName: true
})

export type JobSeekerInsert = z.infer<typeof jobSeekerInsertSchema>;

export const jobSeekerUpdateSchema = jobSeekerSchema.omit({
    id: true,
    dateCreated: true,
    updatedAt: true,
    deleted: true,
    deletedAt: true,
    password: true,
    regionName: true
})

export type JobSeekerUpdate = z.infer<typeof jobSeekerUpdateSchema>;

export const jobSeekerReadSchema = jobSeekerSchema.pick({
    uuid: true,
    firstname: true,
    lastname: true
})

export type JobSeekerRead = z.infer<typeof jobSeekerReadSchema>;

export const jobSeekerReadSummarySchema = jobSeekerSchema.pick({
    uuid: true,
    firstname: true,
    lastname: true,
    email: true
})

export type JobSeekerReadSummary = z.infer<typeof jobSeekerReadSummarySchema>;

export const jobSeekerReadDetailsSchema = jobSeekerSchema.pick({
    uuid: true,
    firstname: true,
    lastname: true,
    email: true,
    telephoneNumber: true,
    address: true,
    regionName: true
})

export type JobSeekerReadDetails = z.infer<typeof jobSeekerReadDetailsSchema>;