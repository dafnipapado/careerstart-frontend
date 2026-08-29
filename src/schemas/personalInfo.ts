import {z} from "zod";

export const personalInfoSchema = z.object({
    telephoneNumber: z
        .string()
        .optional()
        .refine(val => !val || /^\d{10}$/.test(val),
            {error: "Must be exactly 10 digits"}),
    email: z
        .email()
        .min(1, {error: "Email is required"}),
    address: z
        .string()
        .optional(),
    regionId: z
        .bigint()
        .min(1n, {error: "Please select an option"}),
    regionName: z
        .string()
        .optional()
})

export type PersonalInfo = z.infer<typeof personalInfoSchema>;