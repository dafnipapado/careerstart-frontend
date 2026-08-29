import {z} from "zod";
import {auditingSchema} from "./auditing.ts";
import {personalInfoSchema} from "./personalInfo.ts";

export const employerSchema = z
    .object({
        id: z
            .number()
            .min(1),
        uuid: z.uuid(),
        brandName: z
            .string()
            .min(2, {error: "Must have at least 2 characters"}),
        vat: z
            .string()
            .regex(/^\d{9}$/, {error: "Must be exactly 9 digits"}),
        website: z
            .string()
            .optional()
            .refine(val => !val || z.url().safeParse(val).success),
        professionalFieldId: z
            .number()
            .min(1, {error: "Please select an option"}),
        professionalFieldName: z
            .string()
            .optional(),
        username: z
            .string()
            .min(3, {error: "Must be at least 3 characters"})
            .max(30, {error: "Must be no longer than 30 characters"}),
        password: z
            .string()
            .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&+=]).{8,}$/,
                {error: "Must be at least 8 characters, consisting of one capital letter, " +
                        "one lowercase letter, one digit and one special character"}),
    })
    .extend(auditingSchema.shape)
    .extend(personalInfoSchema.shape)

export type Employer = z.infer<typeof employerSchema>;

export const employerInsertSchema = employerSchema.omit({
    id: true,
    uuid: true,
    createdAt: true,
    updatedAt: true,
    deleted: true,
    deletedAt: true,
    professionalFieldName: true,
    regionName: true
})

export type EmployerInsert = z.infer<typeof employerInsertSchema>;

export const employerUpdateSchema = employerSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deleted: true,
    deletedAt: true,
    password: true,
    professionalFieldName: true,
    regionName: true
})

export type EmployerUpdate = z.infer<typeof employerUpdateSchema>;

export const employerReadSchema = employerSchema.pick({
    uuid: true,
    brandName: true,
    username: true
})

export type EmployerRead = z.infer<typeof employerReadSchema>;

export const employerReadSummarySchema = employerSchema.pick({
    uuid: true,
    brandName: true,
    website: true,
    professionalFieldName: true,
    regionName: true
})

export type EmployerReadSummary = z.infer<typeof employerReadSummarySchema>;

export const employerReadDetailsSchema = employerSchema.pick({
    uuid: true,
    brandName: true,
    website: true,
    professionalFieldName: true,
    email: true,
    telephoneNumber: true,
    address: true,
    regionName: true
})

export type EmployerReadDetails = z.infer<typeof employerReadDetailsSchema>;