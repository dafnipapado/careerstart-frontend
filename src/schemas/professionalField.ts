import {z} from "zod";

export const professionalFieldSchema = z.object({
    id: z
        .number()
        .min(1),
    name: z
        .string()
        .min(1)
})

export type ProfessionalField = z.infer<typeof professionalFieldSchema>;