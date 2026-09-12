import {authFetch} from "@/api/auth.ts";
import type {PasswordUpdate} from "@/schemas/user.ts";

const API_URL = import.meta.env.VITE_API_URL
const USER_URL = `${API_URL}/users`

export async function updateEmployerPassword(data: PasswordUpdate) {
    const requestBody = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
    }
    const res = await authFetch(`${USER_URL}/update-password`, {
        method: "PATCH",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(requestBody)
    })
    if (!res.ok) throw await res.json()
}