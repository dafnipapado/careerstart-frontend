import type {JobListingInsert, JobListingRead, JobListingReadSummary} from "@/schemas/jobListing.ts";
import {authFetch} from "@/api/auth.ts";
import type {Page} from "@/schemas/page.ts";
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

export async function getPaginatedFilteredJobListings(filters: JobListingFilters) : Promise<Page<JobListingReadSummary>> {
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