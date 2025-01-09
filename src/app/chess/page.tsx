"use client"

import Image from "next/image";
import Link from 'next/link'
import ChessboardComponent from './components/Board';


export default function Chess() {

  return (
    <div className="min-h-screen">
        <Link href="/">
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
        </Link>
        <div className="flex items-center justify-center">
          <ChessboardComponent />
        </div>


      
      
    </div>
  );
}
