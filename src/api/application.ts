import {authFetch} from "@/api/auth.ts";

const API_URL = import.meta.env.VITE_API_URL
const APPLICATION_URL = `${API_URL}/applications`

export async function accept(jobListingUuid: string, jobSeekerUuid: string) {
    const res = await authFetch(`${APPLICATION_URL}/${jobListingUuid}/accept/${jobSeekerUuid}`, {
        method: 'PUT',
    })
    if (!res.ok) throw await res.json()
}

export async function reject(jobListingUuid: string, jobSeekerUuid: string) {
    const res = await authFetch(`${APPLICATION_URL}/${jobListingUuid}/reject/${jobSeekerUuid}`, {
        method: 'PUT',
    })
    if (!res.ok) throw await res.json()
}