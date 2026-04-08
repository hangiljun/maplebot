"use client"
import { useState } from "react"

export default function CharacterImage({ src, name }: { src: string; name: string }) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div className="w-24 h-24 flex items-center justify-center text-4xl bg-gray-50 rounded-xl">
        🍁
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={`${name} 캐릭터`}
      className="w-24 h-24 object-contain rounded-xl bg-gray-50"
      onError={() => setError(true)}
    />
  )
}
