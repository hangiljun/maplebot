"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, ChevronRight, TrendingUp, Shield, Gem, Star } from "lucide-react"

const QUICK_SEARCHES = ["아크메이지", "팔라딘", "나이트로드", "바이퍼", "윈드브레이커", "메르세데스", "비숍", "듀얼블레이드"]

const WORLDS = ["전체", "스카니아", "베라", "리부트", "루나", "엘리시움", "크로아", "아케인"]

const SPOTLIGHT_CARDS = [
  { label: "이번 주 인기 1위", icon: <Star size={13} />, color: "#f59e0b", desc: "인기도 순위" },
  { label: "이번 주 전투력 1위", icon: <Shield size={13} />, color: "#3b82f6", desc: "전투력 순위" },
  { label: "이번 주 유니온 1위", icon: <TrendingUp size={13} />, color: "#8b5cf6", desc: "유니온 레벨" },
  { label: "이번 주 헥사 1위", icon: <Gem size={13} />, color: "#ec4899", desc: "헥사 코어" },
]

const NOTICES = [
  { type: "공지", text: "4월 정기점검 안내 (04/09 06:00~07:00)", date: "04/09" },
  { type: "업데이트", text: "메이플스토리 4월 업데이트 패치 노트", date: "04/08" },
  { type: "이벤트", text: "봄맞이 이벤트 기간 연장 안내", date: "04/07" },
  { type: "공지", text: "넥슨 OpenAPI 점검 안내", date: "04/06" },
  { type: "업데이트", text: "헥사 매트릭스 신규 코어 추가", date: "04/05" },
]

const NOTICE_COLORS: Record<string, string> = {
  "공지":    "#3b82f6",
  "업데이트": "#22c55e",
  "이벤트":  "#f59e0b",
}

export default function HomePage() {
  const [query, setQuery]   = useState("")
  const [world, setWorld]   = useState("전체")
  const router = useRouter()

  const handleSearch = (value?: string) => {
    const trimmed = (value ?? query).trim()
    if (!trimmed) return
    router.push(`/character/${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="min-h-screen" style={{ background: "#0d0f18" }}>

      {/* ── 히어로 ── */}
      <div className="relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1a0e2e 0%, #0f1424 40%, #0d0f18 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>

        {/* 배경 장식 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse, #7c3aed 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div className="absolute bottom-0 left-1/4 w-64 h-32 opacity-10"
            style={{ background: "radial-gradient(ellipse, #2563eb 0%, transparent 70%)", filter: "blur(30px)" }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-32 opacity-10"
            style={{ background: "radial-gradient(ellipse, #ec4899 0%, transparent 70%)", filter: "blur(30px)" }} />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 py-16 flex flex-col items-center text-center">
          <div className="text-5xl mb-3 drop-shadow-lg">🍁</div>
          <h1 className="text-3xl font-black text-white mb-1 tracking-tight">메이플봇</h1>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
            메이플스토리 캐릭터 정보를 빠르게 조회하세요
          </p>

          {/* 검색창 */}
          <div className="w-full max-w-xl">
            <div className="flex items-center rounded-xl overflow-hidden shadow-2xl"
              style={{ background: "#fff", border: "2px solid rgba(255,255,255,0.15)" }}>

              {/* 서버 선택 */}
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
                <Search size={15} />
                검색
              </button>
            </div>

            {/* 빠른 검색 */}
            <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
              {QUICK_SEARCHES.map((name) => (
                <button key={name} onClick={() => handleSearch(name)}
                  className="text-[12px] px-3 py-1 rounded-full transition-all hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 본문 ── */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* 스포트라이트 카드 4개 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white">주간 하이라이트</h2>
            <Link href="/ranking"
              className="flex items-center gap-0.5 text-[12px] transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              더 보기 <ChevronRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SPOTLIGHT_CARDS.map((card) => (
              <div key={card.label}
                className="rounded-xl p-4 flex flex-col items-center text-center cursor-pointer transition-all hover:brightness-110 hover:-translate-y-0.5"
                style={{ background: "#1e2028", border: "1px solid rgba(255,255,255,0.07)" }}>

                {/* 캐릭터 이미지 자리 */}
                <div className="w-16 h-16 rounded-xl mb-3 flex items-center justify-center text-3xl"
                  style={{ background: `${card.color}15` }}>
                  🧙
                </div>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2"
                  style={{ background: `${card.color}20`, color: card.color }}>
                  {card.desc}
                </span>
                <p className="text-[11px] font-bold text-white mb-0.5">조회중...</p>
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{card.label}</p>

                <button className="mt-3 w-full py-1.5 rounded-lg text-[12px] font-semibold transition-all hover:opacity-90"
                  style={{ background: card.color, color: "#fff" }}>
                  상세 보기
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 랭킹 + 공지 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 랭킹 테이블 */}
          <div className="lg:col-span-2 space-y-4">
            <RankingTable title="리부트 레벨 랭킹" world="리부트" />
            <RankingTable title="스카니아 레벨 랭킹" world="스카니아" />
          </div>

          {/* 공지 & 링크 */}
          <div className="space-y-4">
            {/* 업데이트 공지 */}
            <div className="rounded-xl overflow-hidden"
              style={{ background: "#1e2028", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 className="text-[13px] font-bold text-white">업데이트 정보</h3>
                <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                {NOTICES.map((n, i) => (
                  <div key={i} className="px-4 py-2.5 flex items-start gap-2 hover:bg-white/5 cursor-pointer transition-colors">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                      style={{ background: `${NOTICE_COLORS[n.type]}20`, color: NOTICE_COLORS[n.type] }}>
                      {n.type}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] text-white/80 truncate">{n.text}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{n.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 바로가기 */}
            <div className="rounded-xl p-4 space-y-2"
              style={{ background: "#1e2028", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-[13px] font-bold text-white mb-3">바로가기</h3>
              {[
                { label: "🛡️ 장비 조회", href: "/character" },
                { label: "🏆 레벨 랭킹", href: "/ranking" },
                { label: "🤖 디스코드 봇", href: "/bot" },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-all hover:bg-white/5"
                  style={{ color: "rgba(255,255,255,0.6)" }}>
                  <span>{link.label}</span>
                  <ChevronRight size={13} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

// ── 랭킹 테이블 컴포넌트 ──────────────────────────────────────
const MOCK_RANKS = [
  { rank: 1,  name: "조회 준비 중", class: "-",      level: "-",   world: "-" },
  { rank: 2,  name: "조회 준비 중", class: "-",      level: "-",   world: "-" },
  { rank: 3,  name: "조회 준비 중", class: "-",      level: "-",   world: "-" },
  { rank: 4,  name: "조회 준비 중", class: "-",      level: "-",   world: "-" },
  { rank: 5,  name: "조회 준비 중", class: "-",      level: "-",   world: "-" },
]

function RankingTable({ title, world }: { title: string; world: string }) {
  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: "#1e2028", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-bold text-white">{title}</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{ background: "rgba(92,184,92,0.15)", color: "#5cb85c" }}>
            {world}
          </span>
        </div>
        <Link href="/ranking" className="text-[11px] flex items-center gap-0.5 transition-colors hover:text-white"
          style={{ color: "rgba(255,255,255,0.3)" }}>
          전체보기 <ChevronRight size={12} />
        </Link>
      </div>

      {/* 헤더 */}
      <div className="grid px-4 py-2 text-[11px] font-semibold"
        style={{
          gridTemplateColumns: "32px 1fr 80px 60px 50px",
          color: "rgba(255,255,255,0.3)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
        <span>#</span><span>캐릭터</span><span>직업</span><span>레벨</span><span>서버</span>
      </div>

      {/* 행 */}
      {MOCK_RANKS.map((r) => (
        <div key={r.rank}
          className="grid px-4 py-2.5 items-center text-[12px] transition-colors hover:bg-white/5 cursor-pointer"
          style={{
            gridTemplateColumns: "32px 1fr 80px 60px 50px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>
          <span className="font-black"
            style={{ color: r.rank <= 3 ? "#f59e0b" : "rgba(255,255,255,0.3)" }}>
            {r.rank}
          </span>
          <span className="font-semibold text-white truncate">{r.name}</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{r.class}</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{r.level}</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{r.world}</span>
        </div>
      ))}
    </div>
  )
}
