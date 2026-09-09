import type {
    JobSeekerInsert,
    JobSeekerRead,
    JobSeekerReadDetails,
    JobSeekerReadSummary,
    JobSeekerUpdate
} from "@/schemas/jobSeeker.ts";
import {authFetch} from "@/api/auth.ts";

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
    if (!res.ok) throw new Error("Job Seeker creation failed")
    return await res.json()
}

export async function getLoggedInJobSeekerDetails() : Promise<JobSeekerReadDetails> {
    const res = await authFetch(`${JOBSEEKER_URL}/dashboard`)
    if (!res.ok) throw new Error("Job Seeker info not found")
    return await res.json()
}

export async function getJobSeekerPage(uuid: string) : Promise<JobSeekerReadDetails> {
    const res = await authFetch(`${JOBSEEKER_URL}/${uuid}`)
    if (!res.ok) throw new Error("Job Seeker info not found")
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
    if (!res.ok) throw new Error("Job seeker update failed")
    return await res.json()
}

export async function deleteJobSeeker(uuid: string) : Promise<JobSeekerRead> {
    const res = await authFetch(`${JOBSEEKER_URL}/${uuid}`, {
        method: "PATCH"
    })
    if (!res.ok) throw new Error("Job Seeker deletion failed")
    return await res.json()
}

export async function apply(jobListingUuid: string) {
    const res = await authFetch(`${JOBSEEKER_URL}/${jobListingUuid}/apply`, {
        method: "POST"
    })
    if  (!res.ok) throw new Error("Failed to apply to job listing")
}

export async function withdraw(jobListingUuid: string) {
    const res = await authFetch(`${JOBSEEKER_URL}/${jobListingUuid}/withdraw`, {
        method: "DELETE"
    })
    if  (!res.ok) throw new Error("Failed to withdraw from job listing")
}

export async function hasJobSeekerApplied(jobListingUuid: string) : Promise<boolean> {
    const res = await authFetch(`${JOBSEEKER_URL}/${jobListingUuid}/has-applied`)
    if  (!res.ok) throw new Error("Failed to verify application to job listing")
    return await res.json()
}

export async function uploadJobSeekerProfilePicture(uuid: string, file: File) : Promise<void> {
    const formData = new FormData()
    formData.append("picture", file)

    const res = await authFetch(`${JOBSEEKER_URL}/${uuid}/avatar-upload`, {
        method: "POST",
        body: formData
    })
    if (!res.ok) throw new Error("Jobseeker profile picture upload failed")
}

export async function getJobSeekerProfilePicture(uuid: string) {
    const res = await authFetch(`${JOBSEEKER_URL}/${uuid}/avatar`, {})
    if (!res.ok) throw new Error("Profile picture retrieval failed")
    return await res.blob()
}

export async function uploadJobSeekerCv(uuid: string, file: File) : Promise<void> {
    const formData = new FormData()
    formData.append("cv", file)

    const res = await authFetch(`${JOBSEEKER_URL}/${uuid}/cv-upload`, {
        method: "POST",
        body: formData
    })
    if (!res.ok) throw new Error("Jobseeker CV upload failed")
}

export async function getJobSeekerCvFile(uuid: string) {
    const res = await authFetch(`${JOBSEEKER_URL}/${uuid}/cv`, {})
    if (!res.ok) throw new Error("CV retrieval failed")
    const filename = res.headers.get("Content-Disposition")?.slice(17) ?? null
    const blob = await res.blob()
    return {filename, blob}
}

export async function getJobSeekersByJobListing(jobListingUuid: string) : Promise<JobSeekerReadSummary[]> {
    const res = await authFetch(`${JOBSEEKER_URL}/${jobListingUuid}/job-seekers`)
    if  (!res.ok) throw new Error("Failed to fetch job seekers for this listing")
    return await res.json()
}