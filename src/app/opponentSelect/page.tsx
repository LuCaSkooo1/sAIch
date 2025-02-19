"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import useAuth from "@/lib/auth";

export default function OpponentSelect() {
  const [user, authorized, error] = useAuth()

  if (error) {
    return <div>{error}</div>;
  }

  return (
    authorized && (
      <div className="min-h-screen px-5 md:px-32">
        <Header user={user} />
        <h1 className="text-3xl text-center lg:text-start">Vyber si protivníka</h1>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-5 mt-5">
          <Link href="/chess?level=easy">
            <div className="relative w-[400px] h-[430px]">
              <h2 className="absolute bottom-10 left-5 text-2xl font-bold">Zvedavé dieťa</h2>
              <h3 className="absolute bottom-5 left-5">Ľahký súper</h3>
              <Image
                src="/Easy.png"
                alt="easy"
                width={400}
                height={430}
                className="cursor-pointer hover:border-4 transition-all rounded-[49px]"
              />
            </div>
          </Link>
          <Link href="/chess?level=medium">
            <div className="relative w-[400px] h-[430px]">
              <h2 className="absolute bottom-10 left-5 text-2xl font-bold">Rastúci stratég</h2>
              <h3 className="absolute bottom-5 left-5">Stredný súper</h3>
              <Image
                src="/Medium.png"
                alt="medium"
                width={400}
                height={430}
                className="cursor-pointer hover:border-4 transition-all rounded-[49px]"
              />
            </div>
          </Link>
          <Link href="/chess?level=hard">
            <div className="relative mb-10 md:mb-32 lg:mb-0 w-[400px] h-[430px]">
              <h2 className="absolute bottom-10 left-5 text-2xl font-bold">Grand Master</h2>
              <h3 className="absolute bottom-5 left-5">Ťažký súper</h3>
              <Image
                src="/GrandMaster.png"
                alt="grandmaster"
                width={400}
                height={430}
                className="cursor-pointer hover:border-4 transition-all rounded-[49px]"
              />
            </div>
          </Link>
        </div>
      </div>
    )
  );
}
