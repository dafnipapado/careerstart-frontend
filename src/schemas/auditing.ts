import {z} from "zod";

export const auditingSchema = z.object({
    dateCreated: z
        .string(),
    updatedAt: z
        .string(),
    deleted: z
        .boolean(),
    deletedAt: z
        .string()
        .optional()
})