import {z} from "zod";

export const loginSchema = z.object({
    username: z
        .string()
        .min(1, {error: "Username is required"}),
    password: z
        .string()
        .min(1, {error: "Password is required"})
})

export type LoginCredentials = z.infer<typeof loginSchema>;