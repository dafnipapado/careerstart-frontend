import type {
    EmployerInsert,
    EmployerRead,
    EmployerReadDetails
} from "../schemas/employer.ts";
import {authFetch} from "@/api/auth.ts";

const API_URL = import.meta.env.VITE_API_URL
const EMPLOYER_URL = `${API_URL}/employers`

export async function insertEmployer(data: EmployerInsert) : Promise<EmployerRead> {
    const requestBody = {
        brandName: data.brandName,
        vat: data.vat,
        website: data.website || null,
        professionalFieldId: data.professionalFieldId,
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
    const res = await fetch(`${EMPLOYER_URL}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(requestBody)
    })
    if (!res.ok) throw new Error("Employer creation failed")
    return await res.json()
}

export async function getLoggedInEmployerDetails() : Promise<EmployerReadDetails> {
    const res = await authFetch(`${EMPLOYER_URL}/dashboard`)
    if (!res.ok) throw new Error("Employer info not found")
    return await res.json()
}
