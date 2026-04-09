"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, BarChart2, Trophy, Bot } from "lucide-react"

const QUICK_SEARCH = ["아크메이지", "팔라딘", "나이트로드", "바이퍼", "윈드브레이커", "메르세데스"]

const FEATURES = [
  {
    icon: <BarChart2 size={22} />,
    title: "캐릭터 조회",
    desc: "스탯, 장비, 유니온, 심볼, 헥사까지 한눈에",
    color: "#5cb85c",
  },
  {
    icon: <Trophy size={22} />,
    title: "랭킹",
    desc: "서버별 레벨 순위를 실시간으로 확인",
    color: "#ffd700",
  },
  {
    icon: <Bot size={22} />,
    title: "디스코드 봇",
    desc: "디스코드에서 /정보 명령어로 바로 조회",
    color: "#7289da",
  },
]

export default function HomePage() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (value?: string) => {
    const trimmed = (value ?? query).trim()
    if (!trimmed) return
    router.push(`/character/${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col">

      {/* 히어로 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden">
        {/* 배경 그라디언트 */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(92,184,92,0.07) 0%, transparent 70%)",
          }} />

        {/* 로고 */}
        <div className="flex flex-col items-center mb-10 relative">
          <div className="text-7xl mb-5 drop-shadow-lg select-none">🍁</div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">메이플봇</h1>
          <p className="text-sm font-medium" style={{ color: "var(--text-2)" }}>
            메이플스토리 캐릭터 정보를 빠르게 조회하세요
          </p>
        </div>

        {/* 검색창 */}
        <div className="w-full max-w-lg relative">
          <div className="flex items-center rounded-2xl overflow-hidden shadow-xl"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <Search size={18} className="ml-4 shrink-0" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="캐릭터 닉네임을 입력하세요"
              className="flex-1 px-3 py-4 text-[15px] bg-transparent focus:outline-none"
              style={{ color: "var(--text-1)" }}
              autoFocus
            />
            <button
              onClick={() => handleSearch()}
              className="m-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
              style={{ background: "var(--primary)" }}>
              검색
            </button>
          </div>

          {/* 빠른 검색 */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {QUICK_SEARCH.map((name) => (
              <button
                key={name}
                onClick={() => handleSearch(name)}
                className="text-xs px-3 py-1.5 rounded-full transition-all hover:brightness-110"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-2)",
                }}>
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 기능 카드 */}
      <div className="border-t" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
        <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title}
              className="rounded-2xl p-5 flex gap-4 items-start transition-all hover:brightness-110"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              <div className="rounded-xl p-2.5 shrink-0" style={{ background: `${f.color}18`, color: f.color }}>
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-1">{f.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
