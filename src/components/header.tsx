"use client"

import { ArrowLeft, ChartColumn, CircleUserRound, LogOut } from "lucide-react"
import Link from "next/link"
import Logo from "./logo"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/auth"

export default function Header({ user, handleClick, back, home }: { home?: boolean, user?: User | null, handleClick?: () => boolean, back?: string }) {
    const router = useRouter()

    const logOut = (e: React.MouseEvent) => {
        if (handleClick && !handleClick()) {
            e.preventDefault()
        } else {
            localStorage.removeItem("token")
            router.push("/login")
        }
    }

    const navigate = (e: React.MouseEvent) => {
        if (handleClick && !handleClick()) {
            e.preventDefault()
        }
    }

    return <header className="py-10 items-center flex justify-between gap-16 ">
        <div className="w-6 md:w-[128px]">
            {back && <div className="w-8">
                <Link
                    href={back}
                    className="max-w-fit"
                    onClick={navigate}
                >
                    <ArrowLeft className="hover:scale-125 transition-all hover:text-slate-300" />
                </Link>
            </div>}
        </div>
        <div className="w-28 md:w-32">
            {home &&
                <Link href="/" className="size-full">
                    <Logo className="size-full" />
                </Link>
            }
            {!home && <Logo className="size-full" />}
        </div>
        {user !== undefined ? <Popover>
            <PopoverTrigger className="PopoverTrigger">
                <div className="flex items-center gap-2 md:w-[128px]">
                    <CircleUserRound className="size-6" />
                    <p className="text-xl hidden md:block">{user?.username ?? "Loading..."}</p>
                </div>
            </PopoverTrigger>

            <PopoverContent className="w-80 PopoverContent z-50">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <div className="px-3 py-2 md:hidden flex items-center gap-3 text-black">
                            <CircleUserRound className="size-6" />
                            <p className="font-medium leading-none text-sm">{user?.username ?? "Loading..."}</p>
                        </div>
                        <Link href="/statistics" onClick={handleClick}>
                            <div className="flex items-center gap-3 popover-button text-black">
                                <ChartColumn className="size-6" />
                                <p className="font-medium leading-none text-sm">Štatistiky</p>
                            </div>
                        </Link>
                        <div
                            className="flex items-center gap-3 text-red-500 popover-button cursor-pointer"
                            onClick={logOut}
                        >
                            <LogOut className="size-6" />
                            <p className="font-medium leading-none text-sm">Odhlásiť sa</p>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover> : <div className="w-[128px]" />}
    </header>
}