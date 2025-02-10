"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { ChartColumn, CircleUserRound, LogOut, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const playerStats = [
  { opponent: "Zvedavé dieťa", wins: 2, losses: 8 },
  { opponent: "Rastúci stratég", wins: 5, losses: 5 },
  { opponent: "GrandMaster", wins: 3, losses: 7 },
];

export default function Statistics() {
  const totalGames = playerStats.reduce(
    (sum, stat) => sum + stat.wins + stat.losses,
    0
  );
  const totalWins = playerStats.reduce((sum, stat) => sum + stat.wins, 0);
  const totalLosses = playerStats.reduce((sum, stat) => sum + stat.losses, 0);

const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
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
      const response = await fetch("http://localhost:5001/auth/opponentSelect", {
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

  const logOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    authorized && <div className="min-h-screen px-5 md:px-32">
      <header className="py-10 items-center flex justify-between gap-16 ">
        <div className="w-[128px]">
            <div className="w-8">
            <Link href="/opponentSelect" className="max-w-fit">
                <ArrowLeft  className="hover:scale-125 transition-all hover:text-slate-300"/>
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
        <Popover >
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
                <div className="flex items-center gap-3 text-red-500 cursor-pointer" onClick={logOut}>
                  <LogOut className="" />
                  <h4 className="font-medium leading-none">
                    Odhlásiť sa
                  </h4>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </header>

      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
        {user ? user.username : "Loading..."} Štatistiky
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Počet Hier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGames}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Celkové Výhry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {totalWins}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Celkové Prehry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {totalLosses}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((totalWins / totalGames) * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {playerStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{stat.opponent}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Výhry</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stat.wins}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prehry</p>
                    <p className="text-2xl font-bold text-red-600">
                      {stat.losses}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Win Rate</p>
                    <p className="text-2xl font-bold">
                      {((stat.wins / (stat.wins + stat.losses)) * 100).toFixed(
                        1
                      )}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
