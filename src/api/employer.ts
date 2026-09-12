import type {
    EmployerInsert,
    EmployerRead,
    EmployerReadDetails,
    EmployerUpdate
} from "../schemas/employer.ts";
import {authFetch} from "@/api/auth.ts";
import type {EmployerFilters} from "@/schemas/employerFilters.ts";
import type {Pagination} from "@/schemas/pagination.ts";

const API_URL = import.meta.env.VITE_API_URL
const EMPLOYER_URL = `${API_URL}/employers`

export async function insertEmployer(data: EmployerInsert) : Promise<EmployerRead> {
    const requestBody = {
        brandName: data.brandName,
        vat: data.vat,
        website: data.website || null,
        professionalFieldId: data.professionalFieldId,
        profile: data.profile,
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
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function getLoggedInEmployerDetails() : Promise<EmployerReadDetails> {
    const res = await authFetch(`${EMPLOYER_URL}/dashboard`)
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function updateEmployer(data: EmployerUpdate) : Promise<EmployerRead> {
    const requestBody = {
        uuid: data.uuid,
        brandName: data.brandName,
        vat: data.vat,
        website: data.website || null,
        professionalFieldId: data.professionalFieldId,
        profile: data.profile,
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
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function uploadEmployerProfilePicture(uuid: string, file: File) : Promise<void> {
    const formData = new FormData()
    formData.append("picture", file)

    const res = await authFetch(`${EMPLOYER_URL}/${uuid}/avatar-upload`, {
        method: "POST",
        body: formData
    })
    if (!res.ok) throw await res.json()
}

export async function getEmployerProfilePicture(uuid: string) {
    const res = await authFetch(`${EMPLOYER_URL}/${uuid}/avatar`, {})
    if (!res.ok) throw await res.json()
    return await res.blob()
}

export async function deleteEmployer(uuid: string) : Promise<EmployerRead> {
    const res = await authFetch(`${EMPLOYER_URL}/${uuid}`, {
        method: "PATCH"
    })
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function activateEmployer(uuid: string) {
    const res = await authFetch(`${EMPLOYER_URL}/${uuid}/activate`, {
        method: "PATCH"
    })
    if (!res.ok) throw await res.json()
}

export async function getEmployerPage(uuid: string) : Promise<EmployerReadDetails> {
    const res = await authFetch(`${EMPLOYER_URL}/${uuid}`)
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function getLoggedInEmployerJobListingsCount() : Promise<number> {
    const res = await authFetch(`${EMPLOYER_URL}/count-job-listings`)
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function getEmployerJobListingsCount(uuid: string) : Promise<number> {
    const res = await authFetch(`${EMPLOYER_URL}/${uuid}/count-job-listings`)
    if (!res.ok) throw await res.json()
    return await res.json()
}

export async function getPaginatedFilteredEmployers(filters: EmployerFilters) : Promise<Pagination<EmployerReadDetails>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value!=="") {
            params.append(key, String(value))
        }
    })
    const res = await authFetch(`${EMPLOYER_URL}?${params}`)
    if (!res.ok) throw await res.json()
    return await res.json()
}