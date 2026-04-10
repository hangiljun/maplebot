"use client"
import { useState, useEffect } from "react"
import { Shield } from "lucide-react"

export function AdminLoginModal({ onClose, onLogin }: {
  onClose: () => void
  onLogin: (pw: string) => void
}) {
  const [pw, setPw] = useState("")

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="w-full max-w-sm p-6"
        style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} style={{ color: "var(--blue-light)" }} />
          <h2 className="font-bold" style={{ fontSize: "1rem", color: "var(--text)" }}>관리자 로그인</h2>
        </div>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") onLogin(pw) }}
          placeholder="비밀번호"
          autoFocus
          className="w-full bg-transparent mb-3"
          style={{ fontSize: "14px", color: "var(--text)", padding: "9px 12px", border: "1px solid var(--border)", borderRadius: "6px", outline: "none" }}
        />
        <button onClick={() => onLogin(pw)} className="w-full font-bold"
          style={{ fontSize: "14px", padding: "10px", borderRadius: "6px", background: "var(--blue-light)", color: "#fff" }}>
          확인
        </button>
      </div>
    </div>
  )
}
