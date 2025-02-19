"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import useAuth from "@/lib/auth";
import Header from "@/components/header";
import { createLink } from "@/lib/utils";

export default function Statistics() {
  const [stats, setStats] = useState<{ level: number; total_wins: number; total_losses: number }[]>([]);
  const [user, authorized, error] = useAuth();

  // Calculate total games, wins, and losses from fetched stats
  const totalGames = stats.reduce((sum, stat) => sum + stat.total_wins + stat.total_losses, 0);
  const totalWins = stats.reduce((sum, stat) => sum + stat.total_wins, 0);
  const totalLosses = stats.reduce((sum, stat) => sum + stat.total_losses, 0);

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    const token = localStorage.getItem("token");

    if (!token) return

    try {
      const response = await fetch(createLink("api/statistics"), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }
      const data = await response.json();
      console.log(data)
      setStats(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    authorized && (
      <div className="min-h-screen px-5 md:px-32">
        <Header back="/opponentSelect" user={user} />

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
                <div className="text-2xl font-bold text-green-600">{totalWins}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Celkové Prehry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{totalLosses}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0}%
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader>
                  {stat.level === 1 && <CardTitle>Zvedavé dieťa</CardTitle>}
                  {stat.level === 10 && <CardTitle>Rastúci stratég</CardTitle>}
                  {stat.level === 20 && <CardTitle>GrandMaster</CardTitle>}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Výhry</p>
                      <p className="text-2xl font-bold text-green-600">{stat.total_wins}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prehry</p>
                      <p className="text-2xl font-bold text-red-600">{stat.total_losses}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Win Rate</p>
                      <p className="text-2xl font-bold">
                        {stat.total_wins + stat.total_losses > 0
                          ? ((stat.total_wins / (stat.total_wins + stat.total_losses)) * 100).toFixed(1)
                          : 0}
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
    )
  );
}