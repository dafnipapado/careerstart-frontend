import type {CvInsert, CvRead, CvUpdate} from "@/schemas/cv.ts";
import {authFetch} from "@/api/auth.ts";

const API_URL = import.meta.env.VITE_API_URL
const CV_URL = `${API_URL}/cv`

export async function insertCv(data: CvInsert) : Promise<CvRead> {
    const res = await authFetch(`${CV_URL}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function updateCv(data: CvUpdate) : Promise<CvRead> {
    const res = await authFetch(`${CV_URL}/${data.uuid}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function getJobSeekerCv(jobSeekerUuid: string) : Promise<CvRead> {
    const res = await authFetch(`${CV_URL}/${jobSeekerUuid}/view`)
    if (!res.ok) throw await res.json()
    return await res.json()
}