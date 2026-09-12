import type {LoginCredentials, LoginResponse} from "../schemas/auth.ts";
import {getCookie} from "@/utils/cookies.ts";
import {toast} from "sonner";

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

export async function authFetch(url: string, options: RequestInit = {}) {
    const token = getCookie("token");
    const res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        }
    })

    if (res.status === 401) {
        window.location.href = "/login"
        toast.error("Your session has expired. Please log in again.")
    }

    return res;
}