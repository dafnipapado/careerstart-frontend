import {z} from "zod";

export const jobListingFiltersSchema = z.object({
    uuid: z.string().optional(),
    title: z.string().optional(),
    professionalFieldId: z.number().optional(),
    regionId: z.number().optional(),
    createdAt: z.date().optional(),
    deleted: z.boolean().optional(),
    employerUuid: z.string().optional(),
    employerBrandName: z.string().optional(),
    jobSeekerUuid : z.string().optional(),
    page: z.number(),
    pageSize: z.number(),
    sortBy: z.string(),
    sortDirection: z.enum(["ASC" , "DESC"]),
})

export type JobListingFilters = z.infer<typeof jobListingFiltersSchema>

export const defaultJobListingFilters: JobListingFilters = {
    page: 0,
    pageSize: 10,
    sortBy: "createdAt",
    sortDirection: "DESC"
}

export const JobListingFiltersFormSchema =  jobListingFiltersSchema.omit({
    page: true,
    pageSize: true,
    sortBy: true,
    sortDirection: true
})

export type JobListingFiltersForm = z.infer<typeof JobListingFiltersFormSchema>