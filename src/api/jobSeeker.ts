import type {
    JobSeekerInsert,
    JobSeekerRead,
    JobSeekerReadDetails,
    JobSeekerReadSummary,
    JobSeekerUpdate
} from "@/schemas/jobSeeker.ts";
import {authFetch} from "@/api/auth.ts";
import type {Pagination} from "@/schemas/pagination.ts";
import type {JobSeekerFilters} from "@/schemas/jobSeekerFilters.ts";

const API_URL = import.meta.env.VITE_API_URL
const JOBSEEKER_URL = `${API_URL}/jobseekers`

export async function insertJobSeeker(data: JobSeekerInsert) : Promise<JobSeekerRead> {
    const requestBody = {
        firstname: data.firstname,
        lastname: data.lastname,
        userInsertDTO: {
            username: data.username,
            password: data.password
        },
        personalInfoInsertDTO: {
            email: data.email,
            telephoneNumber: data.telephoneNumber || null,
            address: data.address || null,
            regionId: data.regionId
        }
    }
    const res = await fetch(`${JOBSEEKER_URL}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(requestBody)
    })
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function getLoggedInJobSeekerDetails() : Promise<JobSeekerReadDetails> {
    const res = await authFetch(`${JOBSEEKER_URL}/dashboard`)
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function getJobSeekerPage(uuid: string) : Promise<JobSeekerReadDetails> {
    const res = await authFetch(`${JOBSEEKER_URL}/${uuid}`)
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function updateJobSeeker(data: JobSeekerUpdate) : Promise<JobSeekerRead> {
    const requestBody = {
        uuid: data.uuid,
        firstname: data.firstname,
        lastname: data.lastname,
        userUpdateDTO: {
            username: data.username
        },
        personalInfoUpdateDTO: {
            email: data.email,
            telephoneNumber: data.telephoneNumber || null,
            address: data.address || null,
            regionId: data.regionId
        }
    }

    const res = await authFetch(`${JOBSEEKER_URL}/${data.uuid}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(requestBody)
    })
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function deleteJobSeeker(uuid: string) : Promise<JobSeekerRead> {
    const res = await authFetch(`${JOBSEEKER_URL}/${uuid}`, {
        method: "PATCH"
    })
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function activateJobSeeker(uuid: string) {
    const res = await authFetch(`${JOBSEEKER_URL}/${uuid}/activate`, {
        method: "PATCH"
    })
    if (!res.ok) throw await res.json()
}

export async function apply(jobListingUuid: string) {
    const res = await authFetch(`${JOBSEEKER_URL}/${jobListingUuid}/apply`, {
        method: "POST"
    })
    if (!res.ok) throw await res.json()
}

export async function withdraw(jobListingUuid: string) {
    const res = await authFetch(`${JOBSEEKER_URL}/${jobListingUuid}/withdraw`, {
        method: "DELETE"
    })
    if (!res.ok) throw await res.json()
}

export async function hasJobSeekerApplied(jobListingUuid: string) : Promise<boolean> {
    const res = await authFetch(`${JOBSEEKER_URL}/${jobListingUuid}/has-applied`)
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function uploadJobSeekerProfilePicture(uuid: string, file: File) : Promise<void> {
    const formData = new FormData()
    formData.append("picture", file)

    const res = await authFetch(`${JOBSEEKER_URL}/${uuid}/avatar-upload`, {
        method: "POST",
        body: formData
    })
    if (!res.ok) throw await res.json()
}

export async function getJobSeekerProfilePicture(uuid: string) {
    const res = await authFetch(`${JOBSEEKER_URL}/${uuid}/avatar`, {})
    if (!res.ok) throw await res.json()
    return await res.blob()
}

export async function uploadJobSeekerCv(uuid: string, file: File) : Promise<void> {
    const formData = new FormData()
    formData.append("cv", file)

    const res = await authFetch(`${JOBSEEKER_URL}/${uuid}/cv-upload`, {
        method: "POST",
        body: formData
    })
    if (!res.ok) throw await res.json()
}

export async function getJobSeekerCvFile(uuid: string) {
    const res = await authFetch(`${JOBSEEKER_URL}/${uuid}/cv`, {})
    if (!res.ok) throw await res.json()
    const filename = res.headers.get("Content-Disposition")?.slice(17) ?? null
    const blob = await res.blob()
    return {filename, blob}
}

export async function getJobSeekersByJobListing(jobListingUuid: string) : Promise<JobSeekerReadSummary[]> {
    const res = await authFetch(`${JOBSEEKER_URL}/${jobListingUuid}/job-seekers`)
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function getPaginatedFilteredJobSeekers(filters: JobSeekerFilters) : Promise<Pagination<JobSeekerReadDetails>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value!=="") {
            params.append(key, String(value))
        }
    })
    const res = await authFetch(`${JOBSEEKER_URL}?${params}`)
    if (!res.ok) throw await res.json()
    return await res.json()
}