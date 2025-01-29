import Image from "next/image";
import Link from 'next/link'


export default function Register() {
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
                    layout="responsive"
                    />
                    </div>
                    </Link>

      </div>
        <div className="flex flex-col items-center mt-10">
          <h1 className="text-3xl">
            Registrácia
          </h1>
          <form className="flex flex-col gap-2 text-black">
            <div className="flex flex-col w-[80vw] lg:w-[30vw]">
              <label htmlFor="email"><span className="color font-semibold">Email</span></label>
              <input id="email" type="email" className="h-10 rounded-xl px-3" placeholder="email@domain.com"></input>
            </div>
            <div className="flex flex-col">  
              <label htmlFor="password"><span className="color font-semibold">Heslo</span></label>
              <input id="password" type="password" className="h-10 rounded-xl px-3" placeholder="********"></input>
            </div>
            <div className="flex flex-col">  
              <label htmlFor="password"><span className="color font-semibold">Potvrdenie hesla</span></label>
              <input id="password" type="password" className="h-10 rounded-xl px-3" placeholder="********"></input>
            </div>
            <button className="primary h-16 mt-5 text-white" type="submit">Zaregistrovať sa</button>
          </form>
   
          <p className="mt-5 font-normal">Máte účet ? <Link href="/login"><span className="underline font-semibold text-[#FF5100]">Prihláste sa tu !</span></Link></p>
        </div>
      
      
    </div>
  );
}
