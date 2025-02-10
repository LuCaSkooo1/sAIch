"use client"

import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from "react";


export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter()
  const usernameRegex = /^\S+$/;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset messages
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Heslá sa nezhodujú");
      return;
    }

    if (username.length > 10){
      setError("Prezívka musí byť kratšia ako 10 charakterov")
      return
    }

    if (!usernameRegex.test(username)) {
      setError("Prezívka nemôže obsahovať medzery")
      return
    } 

    // Send data to the backend
    try {
      const response = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        router.push("/login")
      } else {
        setError(data.error || "Registrácia zlyhala");
      }
    } catch (err) {
      setError("Niečo sa pokazilo :/ skúste to neskôr");
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
        <h1 className="text-3xl">Registrácia</h1>
        <form
          className="flex flex-col gap-2 text-black"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col w-[80vw] lg:w-[30vw]">
            <label htmlFor="nick">
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
          <div className="flex flex-col">
            <label htmlFor="password">
              <span className="color font-semibold">Potvrdenie hesla</span>
            </label>
            <input
              id="password"
              type="password"
              className="h-10 rounded-xl px-3"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            ></input>
          </div>
          <button className="primary h-16 mt-5 text-white" type="submit">
            Zaregistrovať sa
          </button>
        </form>
        {error && <p className="text-red-600 mt-5">{error}</p>}
        <p className="mt-5 font-normal">
          Máte účet ?{" "}
          <Link href="/login">
            <span className="underline font-semibold text-[#FF5100]">
              Prihláste sa tu !
            </span>
          </Link>
        </p>
        
      </div>
    </div>
  );
}
