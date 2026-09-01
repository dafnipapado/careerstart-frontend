import type {JobListingInsert, JobListingRead} from "@/schemas/jobListing.ts";
import {authFetch} from "@/api/auth.ts";

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