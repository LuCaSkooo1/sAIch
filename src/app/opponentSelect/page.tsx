"use client"

import Image from "next/image";
import Link from 'next/link'


export default function Chess() {

    return (
        <div className="min-h-screen px-5 md:px-32">
            <Link href="/">
                <div className="p-10 items-center justify-items-center gap-16 ">
                    <div className="w-28 md:w-32">
                        <Image
                            src="/šAIch..svg"
                            alt="ŠAICH"
                            width={150}
                            height={66}
                            className="size-full"
                        />
                    </div>
                </div>
            </Link>
            <h1 className="text-3xl text-center md:text-start   ">Vyber si protivníka</h1>
            <div className="flex flex-col md:flex-row justify-between items-center gap-5 mt-5">
                <Link href="/chess">
                    <div className="relative">
                        <h2 className="absolute bottom-10 left-5 text-2xl font-bold">Zvedavé dieťa</h2>
                        <h3 className="absolute bottom-5 left-5">Ľahký súper</h3>
                        <Image src="/Easy.png" alt="easy" width={400} height={550} className=" cursor-pointer hover:border-4 transition-all rounded-[49px]" />
                    </div>
                </Link>
                <Link href="/chess">
                    <div className="relative">
                        <h2 className="absolute bottom-10 left-5  text-2xl font-bold">Rastúci stratég</h2>
                        <h3 className="absolute bottom-5 left-5">Stredný súper</h3>
                        <Image src="/Medium.png" alt="medium" width={400} height={550} className=" cursor-pointer hover:border-4 transition-all rounded-[49px]" />
                    </div>
                </Link>
                <Link href="/chess">
                    <div className="relative">
                        <h2 className="absolute bottom-10 left-5 text-2xl font-bold">Grand Master</h2>
                        <h3 className="absolute bottom-5 left-5">Ťažký súper</h3>
                        <Image src="/GrandMaster.png" alt="	grandmaster" width={400} height={550} className=" cursor-pointer  hover:border-4 transition-all rounded-[49px]" />
                    </div>
                </Link>

            </div>



        </div>
    );
}
