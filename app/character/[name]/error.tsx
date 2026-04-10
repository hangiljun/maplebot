"use client"
import Link from "next/link"
import { Search } from "lucide-react"

export default function CharacterError() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ paddingTop: "56px" }}>
      <div className="glass rounded-3xl p-10 max-w-md w-full text-center"
        style={{ border: "1px solid rgba(239,68,68,0.15)" }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <Search size={26} style={{ color: "#f87171" }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
          조회 중 오류가 발생했어요
        </h2>
        <p className="text-sm mb-7 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Nexon API 호출 중 오류가 발생했습니다.<br />
          잠시 후 다시 시도해 주세요.
        </p>
        <div className="flex gap-2 justify-center">
          <Link href="/character" className="btn-primary px-5 py-2.5 text-sm">다시 검색</Link>
          <Link href="/" className="btn-outline px-5 py-2.5 text-sm">홈으로</Link>
        </div>
      </div>
    </div>
  )
}
