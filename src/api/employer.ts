import type {
    EmployerInsert,
    EmployerRead,
    EmployerReadDetails,
    EmployerUpdate
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

export async function updateEmployer(data: EmployerUpdate) : Promise<EmployerRead> {
    const requestBody = {
        uuid: data.uuid,
        brandName: data.brandName,
        vat: data.vat,
        website: data.website || null,
        professionalFieldId: data.professionalFieldId,
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

    const res = await authFetch(`${EMPLOYER_URL}/${data.uuid}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(requestBody)
    })
    if (!res.ok) throw new Error("Employer update failed")
    return await res.json()
}

export async function uploadEmployerProfilePicture(uuid: string, file: File) : Promise<void> {
    const formData = new FormData()
    formData.append("picture", file)

    const res = await authFetch(`${EMPLOYER_URL}/${uuid}/avatar-upload`, {
        method: "POST",
        body: formData
    })
    if (!res.ok) throw new Error("Employer profile picture upload failed")
}

export async function getEmployerProfilePicture(uuid: string) {
    const res = await authFetch(`${EMPLOYER_URL}/${uuid}/avatar`, {})
    if (!res.ok) throw new Error("Profile picture retrieval failed")
    return await res.blob()
}