import type {ProfessionalField} from "@/schemas/professionalField.ts";

const API_URL = import.meta.env.VITE_API_URL

export async function getAllFields() : Promise<ProfessionalField[]> {
    const res = await fetch(`${API_URL}/fields`);
    if (!res.ok) throw await res.json()
    return await res.json()
}