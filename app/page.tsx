"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

const DISCORD_URL = "https://discord.com/oauth2/authorize?client_id=1491444296623325194&permissions=51200&integration_type=0&scope=bot"

const FEATURES = [
  { label: "캐릭터 정보", desc: "레벨, 직업, 서버, 전투력, 인기도" },
  { label: "스탯 분석",   desc: "STR / DEX / INT / LUK 및 전투 능력치" },
  { label: "장비 조회",   desc: "잠재능력, 스타포스, 세트효과" },
  { label: "유니온",      desc: "등급, 레벨, 아티팩트 현황" },
  { label: "심볼",        desc: "아케인 / 사크레드 심볼 경험치" },
  { label: "헥사",        desc: "헥사 코어 레벨 및 스탯" },
]

export default function HomePage() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const go = (v?: string) => {
    const t = (v ?? query).trim()
    if (!t) return
    router.push(`/character/${encodeURIComponent(t)}`)
  }

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ── 히어로 ── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">

        {/* 배경 그라디언트 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px]"
            style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.1) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/4 w-96 h-96"
            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
        </div>

        <div className="relative max-w-6xl w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-16 pt-14">

          {/* 좌측: 텍스트 + 검색 */}
          <div className="flex-1 text-center lg:text-left">
            {/* 배지 */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", color: "var(--blue)" }}>
              Nexon OpenAPI 기반
            </div>

            {/* 타이틀 */}
            <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight tracking-tight"
              style={{ color: "var(--text)" }}>
              메이플봇
            </h1>
            <p className="text-lg mb-2" style={{ color: "var(--text-sub)" }}>
              메이플스토리 캐릭터 정보를 디스코드에서 바로 조회하세요
            </p>
            <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
              캐릭터 정보 · 스탯 · 장비 · 유니온 · 심볼 · 헥사
            </p>

            {/* 검색창 */}
            <div className="glass flex items-center rounded-2xl overflow-hidden mb-4 shadow-sm max-w-lg lg:mx-0 mx-auto">
              <Search size={17} className="ml-4 shrink-0" style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && go()}
                placeholder="캐릭터 닉네임 검색"
                autoFocus
                className="flex-1 px-3 py-4 bg-transparent focus:outline-none text-[15px] placeholder:text-[rgba(15,23,42,0.25)]"
                style={{ color: "var(--text)" }}
              />
              <button onClick={() => go()} className="btn-primary m-2 px-6 py-2.5 text-sm">
                조회하기
              </button>
            </div>

            {/* 버튼 2개 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href={DISCORD_URL} target="_blank"
                className="btn-primary px-8 py-3.5 text-sm text-center">
                메이플봇 서버에 추가하기
              </Link>
              <Link href="/character"
                className="btn-outline px-8 py-3.5 text-sm text-center">
                캐릭터 조회하기
              </Link>
            </div>
          </div>

          {/* 우측: 홍보 이미지 */}
          <div className="w-full lg:w-[380px] shrink-0 flex justify-center">
            <div className="relative w-72 lg:w-full">
              <Image
                src="/hero.png"
                alt="메이플 디스코드 봇과 함께하는 모험"
                width={420}
                height={420}
                className="w-full h-auto object-contain drop-shadow-xl"
                style={{ borderRadius: "24px" }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 기능 소개 ── */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-black mb-2" style={{ color: "var(--text)" }}>제공 기능</h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Nexon OpenAPI를 통해 다양한 캐릭터 정보를 제공합니다
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FEATURES.map((f) => (
            <div key={f.label} className="glass rounded-2xl p-5 transition-all hover:-translate-y-0.5"
              style={{ borderColor: "var(--border)" }}>
              <div className="w-2 h-2 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)" }} />
              <p className="font-bold text-sm mb-1" style={{ color: "var(--text)" }}>{f.label}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-4 pb-24">
        <div className="rounded-3xl p-10 text-center text-white"
          style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6)", boxShadow: "0 8px 40px rgba(37,99,235,0.3)" }}>
          <h2 className="text-2xl font-black mb-2">지금 바로 시작하세요</h2>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
            디스코드 서버에 메이플봇을 추가하고<br />
            /정보 명령어로 캐릭터를 조회하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={DISCORD_URL} target="_blank"
              className="px-8 py-3.5 text-sm text-center font-bold rounded-xl transition-all hover:opacity-90"
              style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff" }}>
              메이플봇 서버에 추가하기
            </Link>
            <Link href="/bot-guide"
              className="px-8 py-3.5 text-sm text-center font-bold rounded-xl transition-all hover:opacity-90"
              style={{ background: "#fff", color: "var(--blue)" }}>
              사용 방법 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="text-center py-8 text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>
        © 2025 메이플봇 · Powered by Nexon OpenAPI · 비공식 서비스
      </footer>
    </div>
  )
}
