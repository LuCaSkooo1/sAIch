"use client"

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createLink } from "./utils";

export interface User {
    id: number
    username: string
}

export default function useAuth() {
    const router = useRouter()
    const [user, setUser] = useState<{ id: number; username: string } | null>(null)
    const [authorized, setAuthorized] = useState(false)
    const [error, setError] = useState("")

    const fetchUserData = useCallback(async () => {
        const token = localStorage.getItem("token")

        if (!token) {
            router.push("/login")
            return
        }

        try {
            const response = await fetch(createLink("api/user"), {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            if (!response.ok) {
                router.push("/login")
                return
            }

            const data = await response.json();
            if (data.user) {
                setUser(data.user)
                setAuthorized(true)
            }
        } catch (err) {
            console.error("Error fetching user data:", err)
            setError("Failed to load user data. Please try again.")
        }
    }, [router])

    useEffect(() => {
        fetchUserData()
    }, [fetchUserData])

    return [user, authorized, error] as [typeof user, typeof authorized, typeof error]
}