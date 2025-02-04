"use client"

import Image from "next/image";
import Link from 'next/link'
import { PlayVsComputer } from "../components/Hard";


export default function Chess() {

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
        <div className="flex justify-center items-center text-center w-full">
          <PlayVsComputer />
        </div>
    </div>
  );
}
