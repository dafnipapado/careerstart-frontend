import {z} from "zod";

export const auditingSchema = z.object({
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