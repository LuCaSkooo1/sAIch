"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleUserRound, LogOut, ChartColumn } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";

export default function OpponentSelect() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuth();
  },[]); // Runs only once when the component mounts

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://37.46.208.126:5001/api/opponentSelect", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      setAuthorized(true);
      fetchUserData(token); // Fetch user data after authorization
    } catch (err) {
      console.error("Error checking auth:", err);
      setError("Authentication error. Please try again.");
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch("http://37.46.208.126:5001/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data. Please try again.");
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    authorized && (
      <div className="min-h-screen px-5 md:px-32">
        <header className="py-10 items-center flex justify-center md:justify-between gap-0 md:gap-16">
          <div className="md:w-[128px] w-0" />
          <div className="w-0 md:w-32">
            <Image
              src="/šAIch..svg"
              alt="ŠAICH"
              width={150}
              height={66}
              className="size-full invisible md:visible"
            />
          </div>
          <Popover>
            <PopoverTrigger className="PopoverTrigger">
              <div className="flex items-center gap-2">
                <CircleUserRound />
                <p className="text-xl">{user ? user.username : "Loading..."}</p>
              </div>
            </PopoverTrigger>

            <PopoverContent className="w-80 PopoverContent">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Link href="/statistics">
                    <div className="flex items-center gap-3 text-black">
                      <ChartColumn />
                      <h4 className="font-medium leading-none">Štatistiky</h4>
                    </div>
                  </Link>
                  <div
                    className="flex items-center gap-3 text-red-500 cursor-pointer"
                    onClick={logOut}
                  >
                    <LogOut className="" />
                    <h4 className="font-medium leading-none">Odhlásiť sa</h4>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </header>
        <h1 className="text-3xl text-center lg:text-start">Vyber si protivníka</h1>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-5 mt-5">
          <Link href="/chess?level=easy">
            <div className="relative">
              <h2 className="absolute bottom-10 left-5 text-2xl font-bold">Zvedavé dieťa</h2>
              <h3 className="absolute bottom-5 left-5">Ľahký súper</h3>
              <Image
                src="/Easy.png"
                alt="easy"
                width={400}
                height={550}
                className="cursor-pointer hover:border-4 transition-all rounded-[49px]"
              />
            </div>
          </Link>
          <Link href="/chess?level=medium">
            <div className="relative">
              <h2 className="absolute bottom-10 left-5 text-2xl font-bold">Rastúci stratég</h2>
              <h3 className="absolute bottom-5 left-5">Stredný súper</h3>
              <Image
                src="/Medium.png"
                alt="medium"
                width={400}
                height={550}
                className="cursor-pointer hover:border-4 transition-all rounded-[49px]"
              />
            </div>
          </Link>
          <Link href="/chess?level=hard">
            <div className="relative mb-10 md:mb-32 lg:mb-0">
              <h2 className="absolute bottom-10 left-5 text-2xl font-bold">Grand Master</h2>
              <h3 className="absolute bottom-5 left-5">Ťažký súper</h3>
              <Image
                src="/GrandMaster.png"
                alt="grandmaster"
                width={400}
                height={550}
                className="cursor-pointer hover:border-4 transition-all rounded-[49px]"
              />
            </div>
          </Link>
        </div>
      </div>
    )
  );
}
