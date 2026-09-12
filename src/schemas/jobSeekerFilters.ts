export type JobSeekerFilters = {
    uuid?: string;
    firstname?: string;
    lastname?: string;
    region?: string;
    page: number;
    pageSize: number;
    sortBy: string;
    sortDirection: "ASC" | "DESC";
}

export const defaultJobSeekerFilters: JobSeekerFilters = {
    page: 0,
    pageSize: 10,
    sortBy: "id",
    sortDirection: "ASC"
}

