"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, ChevronRight, BarChart2, Trophy, Bot } from "lucide-react"

const QUICK_SEARCHES = ["아크메이지", "팔라딘", "나이트로드", "바이퍼", "윈드브레이커", "메르세데스", "비숍", "듀얼블레이드"]

const WORLDS = ["전체", "스카니아", "베라", "리부트", "루나", "엘리시움", "크로아", "아케인"]

const FEATURES = [
  { icon: <BarChart2 size={20} />, label: "캐릭터 조회", desc: "스탯·장비·유니온·심볼·헥사", href: "/character", color: "#5cb85c" },
  { icon: <Trophy size={20} />,    label: "랭킹",       desc: "서버별 레벨 순위 확인",      href: "/ranking",   color: "#f59e0b" },
  { icon: <Bot size={20} />,       label: "디스코드 봇", desc: "/정보 명령어로 바로 조회",  href: "/bot",       color: "#7289da" },
]

export default function HomePage() {
  const [query, setQuery] = useState("")
  const [world, setWorld] = useState("전체")
  const router = useRouter()

  const handleSearch = (value?: string) => {
    const trimmed = (value ?? query).trim()
    if (!trimmed) return
    router.push(`/character/${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="min-h-screen" style={{ background: "#0d0f18" }}>

      {/* 히어로 */}
      <div className="relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1a0e2e 0%, #0f1424 50%, #0d0f18 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse, #7c3aed 0%, transparent 70%)", filter: "blur(40px)" }} />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <div className="text-5xl mb-3 drop-shadow-lg">🍁</div>
          <h1 className="text-3xl font-black text-white mb-1 tracking-tight">메이플봇</h1>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
            메이플스토리 캐릭터 정보를 빠르게 조회하세요
          </p>

          {/* 검색창 */}
          <div className="w-full max-w-xl">
            <div className="flex items-center rounded-xl overflow-hidden shadow-2xl"
              style={{ background: "#fff", border: "2px solid rgba(255,255,255,0.1)" }}>
              <select value={world} onChange={(e) => setWorld(e.target.value)}
                className="shrink-0 h-12 pl-3 pr-2 text-[13px] font-medium focus:outline-none border-r"
                style={{ background: "#f3f4f6", color: "#374151", borderColor: "#e5e7eb", minWidth: "80px" }}>
                {WORLDS.map(w => <option key={w}>{w}</option>)}
              </select>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="캐릭터 닉네임을 입력하세요"
                className="flex-1 h-12 px-4 text-[14px] focus:outline-none"
                style={{ color: "#111", background: "#fff" }}
                autoFocus
              />
              <button onClick={() => handleSearch()}
                className="h-12 px-5 font-bold text-sm text-white shrink-0 flex items-center gap-1.5 transition-all hover:brightness-110"
                style={{ background: "#5cb85c" }}>
                <Search size={15} /> 검색
              </button>
            </div>

            {/* 빠른 검색 */}
            <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
              {QUICK_SEARCHES.map((name) => (
                <button key={name} onClick={() => handleSearch(name)}
                  className="text-[12px] px-3 py-1 rounded-full transition-all hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 기능 카드 */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href}
              className="rounded-xl p-5 flex items-start gap-4 transition-all hover:brightness-110 hover:-translate-y-0.5"
              style={{ background: "#1e2028", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="rounded-xl p-2.5 shrink-0" style={{ background: `${f.color}18`, color: f.color }}>
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-0.5">{f.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{f.desc}</p>
              </div>
              <ChevronRight size={14} className="ml-auto shrink-0 mt-1" style={{ color: "rgba(255,255,255,0.2)" }} />
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
