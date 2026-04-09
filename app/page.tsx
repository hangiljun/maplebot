"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, ChevronRight } from "lucide-react"

const QUICK = ["아크메이지", "팔라딘", "나이트로드", "바이퍼", "윈드브레이커", "비숍"]

const FEATURES = [
  { emoji: "🛡️", label: "장비 조회",   desc: "잠재능력·스타포스·세트효과",  href: "/character" },
  { emoji: "📊", label: "스탯 분석",   desc: "전투력·능력치·어빌리티",      href: "/character" },
  { emoji: "🏰", label: "유니온",      desc: "유니온 등급·아티팩트 현황",   href: "/character" },
  { emoji: "💎", label: "헥사 매트릭스", desc: "헥사 코어·스탯 현황",       href: "/character" },
  { emoji: "🔮", label: "심볼",        desc: "아케인·사크레드 심볼",        href: "/character" },
  { emoji: "🤖", label: "디스코드 봇", desc: "/정보 명령어로 바로 조회",    href: "/bot"       },
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
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── 히어로 ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-36 pb-24 overflow-hidden">

        {/* 배경 글로우 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-25"
            style={{ background: "radial-gradient(ellipse, #6d1b3a 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full opacity-15"
            style={{ background: "radial-gradient(ellipse, #f58da3 0%, transparent 70%)", filter: "blur(50px)" }} />
          <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse, #9b59b6 0%, transparent 70%)", filter: "blur(50px)" }} />
        </div>

        {/* 타이틀 */}
        <div className="relative mb-10">
          <p className="text-sm font-medium mb-3 tracking-widest uppercase" style={{ color: "var(--pink)" }}>
            MapleStory Character Lookup
          </p>
          <h1 className="gradient-text text-5xl md:text-6xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "GmarketSans, sans-serif" }}>
            메이플봇
          </h1>
          <p className="text-base" style={{ color: "var(--text-sub)" }}>
            메이플스토리 캐릭터 정보를 한눈에 확인하세요
          </p>
        </div>

        {/* 검색창 */}
        <div className="relative w-full max-w-lg">
          <div className="glass flex items-center rounded-2xl overflow-hidden shadow-2xl"
            style={{ borderRadius: "16px" }}>
            <Search size={17} className="ml-4 shrink-0" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
              placeholder="캐릭터 닉네임을 입력하세요"
              autoFocus
              className="flex-1 px-3 py-4 bg-transparent focus:outline-none text-[15px]"
              style={{ color: "#fff" }}
            />
            <button onClick={() => go()}
              className="m-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #d4607e, #f58da3)" }}>
              검색
            </button>
          </div>

          {/* 빠른 검색 */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {QUICK.map((name) => (
              <button key={name} onClick={() => go(name)}
                className="text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105"
                style={{ background: "rgba(245,141,163,0.1)", border: "1px solid rgba(245,141,163,0.2)", color: "var(--pink-soft)" }}>
                {name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 기능 카드 ── */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-center text-sm font-semibold tracking-widest uppercase mb-8"
          style={{ color: "var(--text-muted)" }}>
          Features
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FEATURES.map((f) => (
            <Link key={f.label} href={f.href}
              className="glass group rounded-2xl p-5 flex flex-col gap-3 transition-all hover:scale-[1.02] hover:border-pink-400/30"
              style={{ borderRadius: "24px" }}>
              <span className="text-2xl">{f.emoji}</span>
              <div>
                <p className="font-bold text-sm text-white mb-1">{f.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
              </div>
              <ChevronRight size={14} className="mt-auto self-end opacity-30 group-hover:opacity-70 transition-opacity"
                style={{ color: "var(--pink)" }} />
            </Link>
          ))}
        </div>
      </section>

      {/* ── 푸터 ── */}
      <footer className="text-center py-8" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
        <p className="text-xs">© 2025 메이플봇 · Powered by Nexon OpenAPI</p>
      </footer>

    </div>
  )
}
