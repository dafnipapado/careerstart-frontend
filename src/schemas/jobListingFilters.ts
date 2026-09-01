export type JobListingFilters = {
    uuid?: string;
    title?: string;
    professionalField?: string;
    region?: string;
    createdAt?: Date;
    employerUuid?: string;
    employerBrandName?: string;
    page: number;
    pageSize: number;
    sortBy: string;
    sortDirection: "ASC" | "DESC";
}

export const defaultJobListingFilters: JobListingFilters = {
    page: 0,
    pageSize: 10,
    sortBy: "id",
    sortDirection: "ASC"
}