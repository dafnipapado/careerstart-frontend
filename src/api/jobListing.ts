import type {
    JobListingInsert,
    JobListingRead,
    JobListingReadDetails,
    JobListingReadSummary,
    JobListingUpdate
} from "@/schemas/jobListing.ts";
import {authFetch} from "@/api/auth.ts";
import type {Pagination} from "../schemas/pagination.ts";
import type {JobListingFilters} from "@/schemas/jobListingFilters.ts";

const API_URL = import.meta.env.VITE_API_URL
const JOB_LISTING_URL = `${API_URL}/job-listings`

export async function insertJobListing(data: JobListingInsert) : Promise<JobListingRead> {
    const requestBody = {
        title: data.title,
        description: data.description,
        professionalFieldId: data.professionalFieldId,
        regionId: data.regionId
    }
    const res = await authFetch(`${JOB_LISTING_URL}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(requestBody)
    })
    if (!res.ok) throw new Error("Job Listing creation failed")
    return await res.json()
}

export async function updateJobListing(uuid: string, data: JobListingUpdate) : Promise<JobListingRead> {
    const requestBody = {
        uuid: uuid,
        title: data.title,
        description: data.description,
        professionalFieldId: data.professionalFieldId,
        regionId: data.regionId
    }
    const res = await authFetch(`${JOB_LISTING_URL}/${uuid}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(requestBody)
    })
    if (!res.ok) throw new Error("Job Listing update failed")
    return await res.json()
}

export async function deleteJobListing(uuid: string) : Promise<JobListingRead> {
    const res = await authFetch(`${JOB_LISTING_URL}/${uuid}`, {
        method: "PATCH"
    })
    if (!res.ok) throw new Error("Job Listing deletion failed")
    return await res.json()
}

export async function restoreJobListing(uuid: string) {
    const res = await authFetch(`${JOB_LISTING_URL}/${uuid}/restore`, {
        method: "PATCH"
    })
    if (!res.ok) throw new Error("Job listing restoration failed")
}

export async function getSingleJobListing(uuid: string) : Promise<JobListingReadDetails> {
    const res = await authFetch(`${JOB_LISTING_URL}/${uuid}`)
    if  (!res.ok) throw new Error("Job listing retrieval failed")
    return await res.json()
}

export async function getPaginatedFilteredJobListings(filters: JobListingFilters) : Promise<Pagination<JobListingReadSummary>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value!=="") {
            params.append(key, String(value))
        }
    })
    const res = await authFetch(`${JOB_LISTING_URL}?${params}`)
    if (!res.ok) throw new Error("Failed to apply filters")
    return await res.json()
}