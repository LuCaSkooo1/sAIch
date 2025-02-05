"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Reset error message
    setError("");

    // Send data to the backend
    try {
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to a protected page or dashboard
        router.push("/opponentSelect");
      } else {
        if (data.error == "Invalid credentials") {
          setError("Nesprávne meno alebo heslo");
        } else {
          setError(data.error || "Prihlásenie zlyhalo");
        }
      }
    } catch (err) {
      setError("Niečo sa pokazilo skúste to prosím neskô");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="p-10 items-center flex justify-center gap-16 ">
        <Link href="/">
          <div className="w-28 md:w-32">
            <Image
              src="/šAIch..svg"
              alt="ŠAICH"
              width={150}
              height={66}
              className="size-full"
            />
          </div>
        </Link>
      </div>
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-3xl">Prihlásenie</h1>
        <form
          className="flex flex-col gap-2 text-black"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col w-[80vw] lg:w-[30vw]">
            <label htmlFor="input">
              <span className="color font-semibold">Prezívka</span>
            </label>
            <input
              id="nick"
              type="input"
              className="h-10 rounded-xl px-3"
              placeholder="Šachista"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            ></input>
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">
              <span className="color font-semibold">Heslo</span>
            </label>
            <input
              id="password"
              type="password"
              className="h-10 rounded-xl px-3"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>
          </div>
          <button className="primary h-16 mt-5 text-white" type="submit">
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
