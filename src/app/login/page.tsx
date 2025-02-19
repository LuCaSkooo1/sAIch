"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import { createLink } from "@/lib/utils";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("login try")
    // Reset error message
    setError("");

    // Send data to the backend
    try {
      const response = await fetch(createLink("api/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to a protected page or dashboard
        localStorage.setItem("token", data.token); // Store the token
        console.log("Logged in successfully!");
        router.push("/opponentSelect");
      } else {
        if (data.error == "Invalid credentials") {
          setError("Nesprávne meno alebo heslo");
        } else {
          setError(data.error || "Prihlásenie zlyhalo");
        }
      }
    } catch (err) {
      setError("Niečo sa pokazilo skúste to prosím neskôr");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen">
      <Header home />
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-3xl">Prihlásenie</h1>
        <form
          className="flex flex-col gap-2 text-black"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col w-[80vw] lg:w-[30vw]">
            <label htmlFor="input">
              <span className="color font-semibold">Prezývka</span>
            </label>
            <input
              id="nick"
              type="text"
              className="h-12 rounded-xl px-3"
              placeholder="Šachista"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">
              <span className="color font-semibold">Heslo</span>
            </label>
            <input
              id="password"
              type="password"
              className="h-12 rounded-xl px-3"
              placeholder="********"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="primary h-12 mt-3 text-white" type="submit">
            Prihlásiť sa
          </button>
        </form>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        <p className="mt-5 font-normal">
          Nemáte účet ?{" "}
          <Link href="/register">
            <span className="underline font-semibold text-[#FF5100]">
              Registrujte sa tu !
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
