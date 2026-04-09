"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

const DISCORD_URL = "https://discord.com/oauth2/authorize?client_id=1491444296623325194&permissions=51200&integration_type=0&scope=bot"

/* ── 카운터 ─────────────────────────────────────────────────── */
function Counter({ target, duration = 1800 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const t0 = Date.now()
        const tick = () => {
          const p = Math.min((Date.now() - t0) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setCount(Math.floor(eased * target))
          if (p < 1) requestAnimationFrame(tick)
          else setCount(target)
        }
        requestAnimationFrame(tick)
        obs.disconnect()
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])
  return <span ref={ref}>{count.toLocaleString()}</span>
}

/* ── 디스코드 목업 ─────────────────────────────────────────── */
const CMD_DATA: Record<string, { title: string; color: string; fields: { k: string; v: string }[] }> = {
  "/정보": {
    title: "메이플봇 (Lv.285)",
    color: "#5865f2",
    fields: [
      { k: "직업", v: "아크메이지(불,독)" },
      { k: "서버", v: "크로아" },
      { k: "전투력", v: "12억 4,320만" },
      { k: "유니온", v: "그마3 Lv.9,020" },
      { k: "인기도", v: "32,104" },
      { k: "길드", v: "Heroic" },
    ],
  },
  "/장비": {
    title: "장비 목록 (착용 중)",
    color: "#f59e0b",
    fields: [
      { k: "무기", v: "아케인셰이드 스태프 22성" },
      { k: "모자", v: "앱솔랩스 위자드햇 22성" },
      { k: "상의", v: "앱솔랩스 위자드로브 21성" },
      { k: "반지1", v: "데스티니 링 (레전드)" },
    ],
  },
  "/유니온": {
    title: "유니온 정보",
    color: "#a855f7",
    fields: [
      { k: "등급", v: "그랜드 마스터 3" },
      { k: "레벨", v: "9,020" },
      { k: "아티팩트", v: "Lv.41" },
      { k: "포인트", v: "4,250" },
    ],
  },
}

function DiscordMockup({ cmd }: { cmd: string }) {
  const c = CMD_DATA[cmd] ?? CMD_DATA["/정보"]
  return (
    <div style={{ background: "#1e2124", borderRadius: "14px", padding: "16px", width: "300px", border: "1px solid rgba(255,255,255,0.06)" }}>
      {/* 채널 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingBottom: "10px", marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ color: "#80848e", fontSize: "18px" }}>#</span>
        <span style={{ color: "#f2f3f5", fontWeight: 700, fontSize: "13px" }}>메이플-조회</span>
      </div>
      {/* 사용자 입력 */}
      <p style={{ color: "#00aff4", fontSize: "13px", marginBottom: "10px" }}>{cmd} 메이플봇</p>
      {/* 봇 응답 */}
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg, #5865f2, #7289da)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "12px" }}>M</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
            <span style={{ color: "#5865f2", fontWeight: 700, fontSize: "13px" }}>메이플봇</span>
            <span style={{ background: "#5865f2", color: "#fff", fontSize: "8px", padding: "1px 4px", borderRadius: "3px", fontWeight: 700 }}>BOT</span>
          </div>
          <div style={{ borderLeft: `4px solid ${c.color}`, background: "#2b2d31", borderRadius: "4px", padding: "10px 12px" }}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: "12px", marginBottom: "8px" }}>{c.title}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {c.fields.map(({ k, v }) => (
                <div key={k}>
                  <p style={{ color: "#949ba4", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", margin: "0 0 1px 0" }}>{k}</p>
                  <p style={{ color: "#dbdee1", fontSize: "11px", fontWeight: 600, margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── 데이터 ─────────────────────────────────────────────────── */
const CMDS = [
  { cmd: "/정보",  desc: "레벨, 직업, 전투력, 유니온" },
  { cmd: "/장비",  desc: "착용 장비, 잠재능력, 스타포스" },
  { cmd: "/유니온", desc: "등급, 레벨, 아티팩트 현황" },
]

const FEATURES = [
  { label: "실시간 조회",   desc: "Nexon OpenAPI 직통 연결, 최신 스펙 반영" },
  { label: "7개 탭 지원",  desc: "스탯·장비·어빌리티·유니온·심볼·헥사·코디" },
  { label: "듀얼 API 키",  desc: "429 에러 자동 폴백으로 안정적 서비스 유지" },
  { label: "ocid 캐싱",    desc: "1시간 인메모리 캐싱으로 반복 요청 최적화" },
  { label: "디스코드 봇",  desc: "슬래시 명령어로 서버 내 즉시 캐릭터 조회" },
  { label: "웹 + 봇 연동", desc: "동일 API 기반, 일관된 데이터 품질 보장" },
]

const UPDATES = [
  { date: "2026.04.09", text: "UI 전면 리뉴얼 — 넥슨 서비스 심사 대응" },
  { date: "2026.04.09", text: "개인정보처리방침 신설, 봇 권한 안내 추가" },
  { date: "2026.04.08", text: "헥사·코디 버튼 추가, API 이중화 적용" },
  { date: "2026.04.07", text: "Nexon API 429 자동 폴백 및 ocid 캐싱" },
]

/* ── 메인 ─────────────────────────────────────────────────── */
export default function HomePage() {
  const [query, setQuery] = useState("")
  const [activeCmd, setActiveCmd] = useState("/정보")
  const [composing, setComposing] = useState(false)
  const router = useRouter()

  const go = (v?: string) => {
    const t = (v ?? query).trim()
    if (!t) return
    router.push(`/character/${encodeURIComponent(t)}`)
  }

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ── 히어로 ──────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* 배경 글로우 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px]"
            style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 65%)", transform: "translateX(-30%)" }} />
          <div className="absolute bottom-0 right-0 w-96 h-96"
            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
        </div>

        <div className="section-container w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-20 pb-16">

          {/* 좌측 텍스트 */}
          <div className="flex-1 text-center lg:text-left">
            {/* 상태 배지 */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"
                style={{ boxShadow: "0 0 6px #4ade80", animation: "pulse 2s infinite" }} />
              Nexon API 최신 버전 연동 완료 · 2026-04-09
            </div>

            <h1 className="font-black leading-tight tracking-tight mb-4"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "var(--text)" }}>
              정확한 데이터,<br />
              <span style={{ color: "var(--blue-light)" }}>압도적인 속도.</span>
            </h1>
            <p className="text-base font-medium mb-2" style={{ color: "var(--text-sub)" }}>
              메이플봇이 당신의 스펙을 증명합니다.
            </p>
            <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
              Nexon OpenAPI 기반 · 실시간 캐릭터 정보 · 디스코드 봇 연동
            </p>

            {/* 검색 */}
            <form onSubmit={(e) => { e.preventDefault(); if (!composing) go() }}
              className="flex items-center rounded-2xl overflow-hidden mb-4 max-w-lg lg:mx-0 mx-auto"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
              <Search size={16} className="ml-4 shrink-0" style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onCompositionStart={() => setComposing(true)}
                onCompositionEnd={(e) => { setComposing(false); setQuery(e.currentTarget.value) }}
                placeholder="캐릭터 닉네임 검색"
                autoFocus
                className="flex-1 px-3 py-4 bg-transparent focus:outline-none text-[15px] placeholder:text-white/20"
                style={{ color: "var(--text)" }}
              />
              <button type="submit" className="btn-primary m-2 px-5 py-2.5 text-sm">
                조회하기
              </button>
            </form>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href={DISCORD_URL} target="_blank" className="btn-primary px-7 py-3 text-sm">
                메이플봇 서버에 추가하기
              </Link>
              <Link href="/character" className="btn-outline px-7 py-3 text-sm">
                캐릭터 조회하기
              </Link>
            </div>
          </div>

          {/* 우측 디스코드 목업 */}
          <div className="shrink-0 flex justify-center">
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute", inset: "-30px", borderRadius: "32px",
                background: "radial-gradient(ellipse, rgba(88,101,242,0.3) 0%, transparent 70%)",
                filter: "blur(30px)",
              }} />
              <div style={{
                position: "relative",
                transform: "perspective(1200px) rotateY(-10deg) rotateX(4deg)",
                filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))",
              }}>
                <DiscordMockup cmd="/정보" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 통계 위젯 ──────────────────────────────────── */}
      <section className="py-12">
        <div className="section-container">
          <div className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden"
            style={{ background: "var(--border)" }}>
            {[
              { label: "운영 서버 수",    value: 4281,   suffix: "+" },
              { label: "오늘 조회 건수",  value: 12502,  suffix: "" },
              { label: "누적 캐릭터 조회", value: 893421, suffix: "" },
            ].map(({ label, value, suffix }) => (
              <div key={label} className="py-8 text-center"
                style={{ background: "var(--bg)" }}>
                <p className="text-3xl font-black mb-1" style={{ color: "var(--blue-light)" }}>
                  <Counter target={value} />{suffix}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 명령어 인터랙티브 프리뷰 ────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: "var(--text)" }}>
              봇을 미리 체험하세요
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              명령어를 클릭하면 실제 출력 결과를 확인할 수 있어요
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
            {/* 명령어 목록 */}
            <div className="w-full md:w-52 space-y-2 shrink-0">
              {CMDS.map(({ cmd, desc }) => (
                <button key={cmd} onClick={() => setActiveCmd(cmd)}
                  className="w-full text-left px-4 py-3 rounded-xl transition-all card-hover"
                  style={{
                    background: activeCmd === cmd ? "rgba(59,130,246,0.1)" : "var(--bg-card)",
                    border: `1px solid ${activeCmd === cmd ? "rgba(59,130,246,0.4)" : "var(--border)"}`,
                  }}>
                  <p className="text-sm font-bold font-mono mb-0.5"
                    style={{ color: activeCmd === cmd ? "var(--blue-light)" : "var(--text)" }}>
                    {cmd}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
                </button>
              ))}
            </div>

            {/* 목업 프리뷰 */}
            <div style={{
              transform: "perspective(1000px) rotateY(-5deg)",
              transition: "all 0.3s ease",
              filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.4))",
            }}>
              <DiscordMockup cmd={activeCmd} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 기능 소개 ──────────────────────────────────── */}
      <section className="py-20" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: "var(--text)" }}>제공 기능</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Nexon OpenAPI를 기반으로 다양한 캐릭터 정보를 제공합니다
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.label}
                className="glass rounded-2xl p-6 card-hover cursor-default"
                style={{ border: "1px solid var(--border)" }}>
                <div className="w-2 h-2 rounded-full mb-4"
                  style={{ background: "linear-gradient(135deg, #1d4ed8, #60a5fa)" }} />
                <p className="font-bold text-sm mb-1.5" style={{ color: "var(--text)" }}>{f.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 최근 업데이트 ──────────────────────────────── */}
      <section className="py-16" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="section-container">
          <div className="glass rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>최근 업데이트</h3>
              <Link href="/updates" className="text-xs font-semibold hover:underline"
                style={{ color: "var(--blue-light)" }}>
                전체 보기
              </Link>
            </div>
            <div className="space-y-3">
              {UPDATES.map((u, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-mono shrink-0 tabular-nums"
                    style={{ color: "var(--text-muted)" }}>{u.date}</span>
                  <div className="w-1 h-1 rounded-full shrink-0"
                    style={{ background: "var(--blue-light)" }} />
                  <span className="text-sm" style={{ color: "var(--text-sub)" }}>{u.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="py-20" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="section-container">
          <div className="rounded-3xl p-12 text-center max-w-3xl mx-auto"
            style={{
              background: "linear-gradient(135deg, rgba(29,78,216,0.5), rgba(59,130,246,0.3))",
              border: "1px solid rgba(96,165,250,0.25)",
              boxShadow: "0 0 60px rgba(59,130,246,0.12)",
            }}>
            <h2 className="text-3xl font-black mb-3 text-white">지금 바로 시작하세요</h2>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.65)" }}>
              디스코드 서버에 메이플봇을 추가하고<br />
              /정보 명령어로 캐릭터를 조회하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={DISCORD_URL} target="_blank"
                className="btn-primary px-8 py-3.5 text-sm">
                메이플봇 서버에 추가하기
              </Link>
              <Link href="/bot-guide"
                className="btn-outline px-8 py-3.5 text-sm">
                사용 방법 보기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
