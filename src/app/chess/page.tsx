"use client";

import Image from "next/image";
import Link from "next/link";
import { PlayVsComputer } from "./components/game";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, CircleUserRound, ChartColumn, LogOut } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";

// Separate component for handling search params
function ChessContent() {
  const params = useSearchParams();
  const level = (params.get("level") ?? "medium") as "easy" | "medium" | "hard";

  const levels = {
    easy: 1,
    medium: 10,
    hard: 20,
  };

  if (!Object.keys(levels).includes(level)) {
    notFound();
  }

  const [aiAssistantActive, setAiAssistantActive] = useState(false);

  return (
    <div className="flex justify-center items-center text-center flex-col w-full">
      <PlayVsComputer aiAssistantActive={aiAssistantActive} level={levels[level]} />
      <div className="flex gap-5 items-center mt-5">
        <Switch
          checked={aiAssistantActive}
          onCheckedChange={setAiAssistantActive}
          className="data-[state=checked]:bg-[#FF00F6] data-[state=unchecked]:bg-gray-500
                 relative h-7 w-[50px] rounded-full transition-colors 
                 before:absolute before:left-1 before:top-1 before:h-4 before:w-4 
                 before:rounded-full before:bg-white before:shadow-md 
                 before:transition-transform before:duration-200 
                 data-[state=checked]:before:translate-x-6 items-center"
        />
        <h1 className="text-2xl">
          <span className="color">AI</span> Asistent
        </h1>
      </div>
    </div>
  );
}

export default function Chess() {
  const router = useRouter();

  const handleClick = (e: { preventDefault: () => void }) => {
    const confirmLeave = window.confirm("Do you really want to resign?");
    if (!confirmLeave) {
      e.preventDefault(); // Prevent navigation if the user cancels
    }
  };

  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null
  );
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuth();
  },); // Runs only once when the component mounts

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5001/auth/opponentSelect",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
      const response = await fetch("http://localhost:5001/auth/user", {
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

  const logOut = (e: { preventDefault: () => void }) => {
    const confirmLeave = window.confirm("Do you really want to resign?");
    if (confirmLeave) {
      localStorage.removeItem("token");
      router.push("/login"); // Prevent navigation if the user cancels
    } else {
      e.preventDefault(); // Prevent navigation if the user cancels
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    authorized && (
      <div className="min-h-screen px-5 md:px-32">
        <header className="py-10 items-center flex justify-between gap-16 ">
          <div className="w-[128px]">
            <div className="w-8">
              <Link
                href="/opponentSelect"
                className="max-w-fit"
                onClick={handleClick}
              >
                <ArrowLeft className="hover:scale-125 transition-all hover:text-slate-300" />
              </Link>
            </div>
          </div>
          <div className="w-28 md:w-32">
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

            <PopoverContent className="w-80 PopoverContent z-50">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Link href="/statistics" onClick={handleClick}>
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
        <Suspense fallback={<div>Loading...</div>}>
          <ChessContent />
        </Suspense>
      </div>
    )
  );
}