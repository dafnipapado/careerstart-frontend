import {z} from "zod";

export const personalInfoSchema = z.object({
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
        .optional()
})

export type PersonalInfo = z.infer<typeof personalInfoSchema>;