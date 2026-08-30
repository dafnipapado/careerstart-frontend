import type {Region} from "@/schemas/region.ts";

const API_URL = import.meta.env.VITE_API_URL

export async function getAllRegions() : Promise<Region[]> {
    const res = await fetch(`${API_URL}/regions`);
    if (!res.ok) throw new Error("Failed to retrieve regions")
    return await res.json()
}