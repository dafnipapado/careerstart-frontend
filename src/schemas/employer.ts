import {z} from "zod";

export const employerSchema = z.object({
    id: z
        .bigint()
        .min(1n),
    uuid: z.uuid(),
    brandName: z
        .string()
        .min(2, {error: "Must have at least 2 characters"}),
    vat: z
        .string()
        .regex(/^\d{9}$/, {error: "Must be exactly 9 digits"}),
    website: z
        .string()
        .url()
        .max(255, {error: "No longer than 255 characters"})
        .optional(),
    professionalFieldId: z
        .bigint()
        .min(1n, {error: "Please select an option"}),
    professionalFieldName: z
        .string()
        .optional(),
    email: z
        .email()
        .min(1, {error: "Email is required"}),
    telephoneNumber: z
        .string()
        .regex(/^\d{10}$/, {error: "Must be exactly 10 digits"}),
    address: z
        .string()
        .optional(),
    regionId: z
        .bigint()
        .min(1n, {error: "Please select an option"}),
    regionName: z
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
    createdAt: z
        .string(),
    updatedAt: z
        .string(),
    deleted: z
        .boolean(),
    deletedAt: z
        .string()
        .optional()
})

export type Employer = z.infer<typeof employerSchema>;