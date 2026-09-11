export type EmployerFilters = {
    uuid?: string;
    vat?: string;
    brandName?: string;
    professionalField?: string;
    region?: string;
    page: number;
    pageSize: number;
    sortBy: string;
    sortDirection: "ASC" | "DESC";
}

export const defaultEmployerFilters: EmployerFilters = {
    page: 0,
    pageSize: 10,
    sortBy: "id",
    sortDirection: "ASC"
}

