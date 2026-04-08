"use client"
import { useState } from "react"

interface Props {
  src: string
  name: string
  size?: "sm" | "lg"
}

export default function CharacterImage({ src, name, size = "sm" }: Props) {
  const [error, setError] = useState(false)

  const cls = size === "lg"
    ? "w-32 h-32 object-contain"
    : "w-24 h-24 object-contain rounded-xl bg-gray-50"

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center text-5xl ${size === "lg" ? "w-32 h-32" : "w-24 h-24"}`}>
        🍁
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={`${name} 캐릭터`}
      className={cls}
      onError={() => setError(true)}
    />
  )
}
