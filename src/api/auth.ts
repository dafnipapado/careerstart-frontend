import type {LoginCredentials, LoginResponse} from "../schemas/auth.ts";

const API_URL = import.meta.env.VITE_API_URL

export async function login(data: LoginCredentials) : Promise<LoginResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if (!res.ok) throw await res.json();
    return await res.json()
}