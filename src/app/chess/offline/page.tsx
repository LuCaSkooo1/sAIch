"use client"

import { PlayVsComputer } from "../components/game"
import { Switch } from "@/components/ui/switch"
import { Suspense, useState } from "react"
import { notFound, useSearchParams } from "next/navigation"

function ChessContent() {
  const params = useSearchParams()
  const level = (params.get("level") ?? "medium") as "easy" | "medium" | "hard"

  const levels = {
    easy: 1,
    medium: 10,
    hard: 20,
  }

  if (!Object.keys(levels).includes(level)) {
    notFound()
  }

  const [aiAssistantActive, setAiAssistantActive] = useState(false)

  return (
    <div className="flex justify-center items-center text-center flex-col w-full">
		<div className="mt-20"></div>
      <PlayVsComputer aiAssistantActive={aiAssistantActive} level={levels[level]} />
      <div className="flex gap-5 items-center mt-5">
        <Switch
          checked={aiAssistantActive}
          onCheckedChange={setAiAssistantActive}
          className="data-[state=checked]:bg-[#FF00F6] data-[state=unchecked]:bg-gray-500
                 relative h-7 w-[50px] rounded-full transition-colors
                 before:absolute before:left-1 before:top-1 before:h-4 before:w-4
                 before:rounded-full before:bg-white before:shadow-md
                 before:transition-transform before:duration-200
                 data-[state=checked]:before:translate-x-6 items-center"
        />
        <h1 className="text-2xl">
          <span className="color">AI</span> Asistent
        </h1>
      </div>
    </div>
  )
}

export default function Chess() {


  return (
      <div className="min-h-screen px-5 md:px-32">
        <Suspense fallback={<div className="flex justify-center items-center text-center flex-col w-full">
          <div className="w-[100vw] aspect-square bg-[#ECD0E9] md:w-[500px] mt-2" />
        </div>}>
          <ChessContent />
        </Suspense>
      </div>
    )

}