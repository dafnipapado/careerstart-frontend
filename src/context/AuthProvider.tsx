import type {LoginCredentials} from "../schemas/auth.ts";
import {createContext, useContext, useState} from "react";
import * as React from "react";
import {login} from "../api/auth.ts";
import {jwtDecode} from "jwt-decode";
import {deleteCookie, getCookie, setCookie} from "../utils/cookies.ts";

type AuthContextType = {
    isAuthenticated: boolean;
    username: string | null;
    loading: boolean;
    loginUser: (fields: LoginCredentials) => Promise<void>;
    logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type JwtPayload = {
    sub: string;
}

function getUserFromToken(token: string | null) : string | null {
    if (!token) return null;
    try {
        console.log(jwtDecode<JwtPayload>(token).sub)
        return jwtDecode<JwtPayload>(token).sub ?? null;

    } catch {
        return null;
    }
}

export const AuthProvider = (
    {children}: {children: React.ReactNode}
) => {

    const [username, setUsername] = useState<string | null>(
        getUserFromToken(getCookie("token") ?? null)
    )
    const [token, setToken] = useState<string | null>(
        () => getCookie("token") ?? null
    );
    const [loading, setLoading] = useState<boolean>(false);

    const loginUser = async (fields: LoginCredentials) => {
        try {
            setLoading(true);
            const res = await login(fields)
            setUsername(getUserFromToken(res.token))
            setToken(res.token)
            setCookie("token", res.token, {
                expires: 1/24,
                path: "/",
                secure: false,
                sameSite: "Lax",
            })
        } finally {
            setLoading(false);
        }
    }

    const logoutUser = () => {
        setUsername(null);
        setToken(null);
        deleteCookie("token")
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!token,
                username,
                loading,
                loginUser,
                logoutUser
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used withing AuthProvider");
    return context;
}
