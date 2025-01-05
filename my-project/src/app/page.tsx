import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="p-10 items-center justify-items-center gap-16 ">
              <Image
                src="/šAIch..svg"
                alt="ŠAICH"
                width={150}
                height={66}
                sizes="(max-width: 768px) 100vw, 
                      (max-width: 1200px) 50vw, 
                      33vw"/>
      </div>
      <div className="flex flex-row justify-center gap-10 mt-10">
        <div className="bg-slate-600 w-[640px] h-[640px]"/>
        <div>
          <h1 className="mt-[-26px]">
            Maturitná práca<br/> <span className="color">Lucasa Ligasa</span><br/> <span className="underline ">2025</span>
          </h1>
          <div className="flex flex-col gap-10 mt-16">
            <button type="button"className="primary">Prihlásiť sa</button>
            <button type="button"className="secondary">Zaregistrovať sa</button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
