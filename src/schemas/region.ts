import {z} from "zod";

export const regionSchema = z.object({
    id: z
        .number()
        .min(1),
    name: z
        .string()
        .min(1)
})

export type Region = z.infer<typeof regionSchema>;