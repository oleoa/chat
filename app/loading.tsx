'use client'

import { useEffect, useState } from "react"

export default function Loading() {

  const [stage, setStage] = useState(0)
  useEffect(() => {
    setInterval(() => {
      setStage((s) => s == 4 ? 0 : s+1)
    }, 100)
  }, [])

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="border-2 rounded-full h-40 w-40 flex items-center justify-center p-4 animate-spin">
        <h1 className="text-9xl font-extrabold">CHAT</h1>
      </div>
    </main>
  )
}
