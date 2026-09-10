import {z} from "zod";

export const passwordUpdateSchema = z.object({
    oldPassword: z
        .string(),
    newPassword: z
        .string()
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&+=]).{8,}$/,
            {error: "Must be at least 8 characters, consisting of one capital letter, " +
                    "one lowercase letter, one digit and one special character"}),
    confirmPassword: z.string(),
})
.refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

export type PasswordUpdate = z.infer<typeof passwordUpdateSchema>;