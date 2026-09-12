import {z} from "zod";
import {employerReadDetailsSchema, employerSchema} from "./employer.ts";
import {auditingSchema} from "./auditing.ts";

export const jobListingSchema = z
    .object({
        id: z
            .number()
            .min(1),
        uuid: z.uuid(),
        title: z
            .string()
            .min(3, {error: "Must have at least 3 characters"}),
        description: z
            .string()
            .min(20, {error: "Must have at least 20 characters"}),
        employerUuid: employerSchema.shape.uuid,
        employerBrandName: employerSchema.shape.brandName,
        employerSummaryReadOnlyDTO: employerReadDetailsSchema,
        professionalFieldId: z
            .number({error: "Please select an option"})
            .min(1, {error: "Please select an option"}),
        professionalFieldName: z
            .string()
            .optional(),
        regionId: z
            .number({error: "Please select an option"})
            .min(1, {error: "Please select an option"}),
        regionName: z
            .string()
            .optional(),
    })
    .extend(auditingSchema.shape)

export type JobListing = z.infer<typeof jobListingSchema>;

export const jobListingInsertSchema = jobListingSchema.pick({
    title: true,
    description: true,
    professionalFieldId: true,
    regionId: true
})

export type JobListingInsert = z.infer<typeof jobListingInsertSchema>;

export const jobListingUpdateSchema = jobListingSchema.pick({
    uuid: true,
    title: true,
    description: true,
    professionalFieldId: true,
    regionId: true
})

export type JobListingUpdate = z.infer<typeof jobListingUpdateSchema>;

export const jobListingReadSchema = jobListingSchema.pick({
    uuid: true,
    title: true,
    employerBrandName: true
})

export type JobListingRead = z.infer<typeof jobListingReadSchema>;

export const jobListingReadSummarySchema = jobListingSchema.pick({
    uuid: true,
    title: true,
    employerUuid: true,
    employerBrandName: true,
    professionalFieldName: true,
    regionName: true,
    dateCreated: true,
    deleted: true
})

export type JobListingReadSummary = z.infer<typeof jobListingReadSummarySchema>;

export const jobListingReadDetailsSchema = jobListingSchema.pick({
    uuid: true,
    title: true,
    description: true,
    employerSummaryReadOnlyDTO: true,
    professionalFieldId: true,
    professionalFieldName: true,
    regionId: true,
    regionName: true,
    dateCreated: true
})

export type JobListingReadDetails = z.infer<typeof jobListingReadDetailsSchema>;