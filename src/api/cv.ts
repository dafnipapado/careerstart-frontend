import type {cvInsert, cvRead} from "@/schemas/cv.ts";
import {authFetch} from "@/api/auth.ts";

const API_URL = import.meta.env.VITE_API_URL
const CV_URL = `${API_URL}/cv`

export async function insertCv(data: cvInsert) : Promise<cvRead> {
    const res = await authFetch(`${CV_URL}`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error("Cv creation failed")
    return await res.json()
}