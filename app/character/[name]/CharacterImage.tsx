"use client"
import { useState } from "react"

interface Props {
  src: string
  name: string
  size?: "sm" | "lg" | "xl"
}

export default function CharacterImage({ src, name, size = "sm" }: Props) {
  const [error, setError] = useState(false)

  const cls =
    size === "xl" ? "w-48 h-48 object-contain" :
    size === "lg" ? "w-32 h-32 object-contain" :
    "w-24 h-24 object-contain rounded-xl bg-gray-50"

  const fallbackCls =
    size === "xl" ? "w-48 h-48" :
    size === "lg" ? "w-32 h-32" : "w-24 h-24"

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center text-5xl ${fallbackCls}`}>
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
