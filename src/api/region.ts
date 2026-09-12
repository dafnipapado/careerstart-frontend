import type {Region} from "@/schemas/region.ts";

const API_URL = import.meta.env.VITE_API_URL

export async function getAllRegions() : Promise<Region[]> {
    const res = await fetch(`${API_URL}/regions`);
    if (!res.ok) throw await res.json()
    return await res.json()
}