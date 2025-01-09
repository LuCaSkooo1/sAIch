"use client"

import Image from "next/image";
import { useRouter } from 'next/navigation'

export default function Home() {

  const router = useRouter()

  return (
    <div className="min-h-screen">
      <div className="p-10 items-center justify-items-center gap-16 ">
              <div className="w-28 md:w-32">
              <Image
                src="/šAIch..svg"
                alt="ŠAICH"
                width={150}
                height={66}
                layout="responsive"
                />
                </div>
      </div>
      <div className="justify-center items-center flex flex-row w-full h-full">
        <div className="flex flex-col xl:flex-row justify-center items-center gap-10">
          <div className="w-[70%] sm:w-1/3 md:w-1/2 max-w-[450px] aspect-square rounded">
            <Image 
              width={5} 
              height={5} 
              layout="responsive" 
              src="/chessboard.png"
              alt="chessboard"
              />
          </div>
          <div>
            <h1 className="text-center md:text-5xl xl:text-start text-4xl xl:text-7xl">
              Maturitná práca<br/> <span className="color">Lucasa Ligasa</span><br/> <span className="underline ">2025</span>
            </h1>
            <div className="flex flex-col items-center xl:items-start gap-5 mt-10">
              <button type="button"className="w-[90%] primary h-20 text-2xl" onClick={() => router.push('/login')}>Prihlásiť sa</button>
              <button type="button"className="w-[90%] secondary w-96 h-20 text-2xl mb-5">Zaregistrovať sa</button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
