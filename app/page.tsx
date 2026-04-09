"use client"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

const DISCORD_URL = "https://discord.com/oauth2/authorize?client_id=1491444296623325194&permissions=51200&integration_type=0&scope=bot"


/* ── 디스코드 목업 ─────────────────────────────────────────── */
const COMMAND_DATA: Record<string, { title: string; fields: { k: string; v: string }[]; color: string }> = {
  "/정보": {
    title: "메이플봇 (Lv.285)",
    fields: [
      { k: "직업", v: "아크메이지(불,독)" },
      { k: "서버", v: "크로아" },
      { k: "전투력", v: "12억 4,320만" },
      { k: "유니온", v: "그마3 Lv.9,020" },
      { k: "인기도", v: "32,104" },
      { k: "길드", v: "Heroic" },
    ],
    color: "#5865f2",
  },
  "/장비": {
    title: "장비 목록 (착용 중)",
    fields: [
      { k: "무기", v: "아케인셰이드 스태프 22성" },
      { k: "모자", v: "앱솔랩스 위자드햇 22성" },
      { k: "상의", v: "앱솔랩스 위자드로브 21성" },
      { k: "반지1", v: "데스티니 링 (레전드)" },
    ],
    color: "#f59e0b",
  },
  "/유니온": {
    title: "유니온 정보",
    fields: [
      { k: "등급", v: "그랜드 마스터 3" },
      { k: "레벨", v: "9,020" },
      { k: "아티팩트", v: "Lv.41" },
      { k: "포인트", v: "4,250" },
    ],
    color: "#a855f7",
  },
}

function DiscordMockup({ command }: { command: string }) {
  const c = COMMAND_DATA[command] ?? COMMAND_DATA["/정보"]
  return (
    <div style={{ background: "#313338", borderRadius: "14px", padding: "16px", width: "300px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingBottom: "10px", marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ color: "#80848e", fontSize: "20px", lineHeight: 1 }}>#</span>
        <span style={{ color: "#F2F3F5", fontWeight: 700, fontSize: "14px" }}>메이플-조회</span>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <span style={{ color: "#949BA4", fontSize: "11px" }}>유저</span>
        <p style={{ color: "#00AFF4", fontSize: "13px", margin: 0 }}>{command} 메이플봇</p>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg, #5865f2, #7289da)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "11px" }}>M</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
            <span style={{ color: "#5865f2", fontWeight: 700, fontSize: "13px" }}>메이플봇</span>
            <span style={{ background: "#5865f2", color: "#fff", fontSize: "8px", padding: "1px 4px", borderRadius: "3px", fontWeight: 700 }}>BOT</span>
          </div>
          <div style={{ borderLeft: `4px solid ${c.color}`, background: "#2B2D31", borderRadius: "4px", padding: "10px 12px" }}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: "12px", margin: "0 0 8px 0" }}>{c.title}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {c.fields.map(({ k, v }) => (
                <div key={k}>
                  <p style={{ color: "#949BA4", fontSize: "8px", fontWeight: 700, textTransform: "uppercase", margin: "0 0 1px 0" }}>{k}</p>
                  <p style={{ color: "#DBDEE1", fontSize: "11px", fontWeight: 600, margin: 0 }}>{v}</p>
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
const COMMANDS_PREVIEW = [
  { cmd: "/정보", desc: "레벨, 직업, 전투력, 유니온" },
  { cmd: "/장비", desc: "착용 장비, 잠재능력, 스타포스" },
  { cmd: "/유니온", desc: "등급, 레벨, 아티팩트 현황" },
]

const FEATURES = [
  { label: "실시간 조회",    desc: "Nexon OpenAPI 직통 연결" },
  { label: "7개 탭 지원",   desc: "스탯·장비·심볼·헥사·코디" },
  { label: "듀얼 API 키",   desc: "429 에러 자동 폴백 처리" },
  { label: "ocid 캐싱",     desc: "반복 요청 속도 최적화" },
  { label: "디스코드 봇",   desc: "서버 내 즉시 조회 가능" },
  { label: "웹 + 봇 연동",  desc: "동일 API 기반 일관된 정보" },
]

const RECENT_UPDATES = [
  { date: "2026.04.09", text: "흰색/파란색 테마 전면 개편" },
  { date: "2026.04.09", text: "코디 버튼 추가 (헤어/성형/캐시 아이템)" },
  { date: "2026.04.08", text: "헥사 버튼 추가 (코어 레벨, 헥사 스탯)" },
  { date: "2026.04.07", text: "Nexon API 이중화 — 429 자동 폴백" },
]

/* ── 메인 ───────────────────────────────────────────────────── */
export default function HomePage() {
  const [query, setQuery] = useState("")
  const [activeCmd, setActiveCmd] = useState("/정보")
  const router = useRouter()

  const go = (v?: string) => {
    const t = (v ?? query).trim()
    if (!t) return
    router.push(`/character/${encodeURIComponent(t)}`)
  }

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ── 히어로 ── */}
      <section className="relative min-h-screen flex items-center px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{ background: "radial-gradient(ellipse 70% 60% at 15% 45%, rgba(37,99,235,0.07) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px]"
            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)" }} />
        </div>

        <div className="relative max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-16 pb-12">

          {/* 좌측 텍스트 */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#16a34a" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"
                style={{ animation: "pulse 2s infinite" }} />
              Nexon API 최신 버전 연동 완료 · 2026-04-09
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4" style={{ color: "var(--text)" }}>
              정확한 데이터,<br />
              <span style={{ color: "var(--blue)" }}>압도적인 속도.</span>
            </h1>
            <p className="text-base font-semibold mb-2" style={{ color: "var(--text-sub)" }}>
              메이플봇이 당신의 스펙을 증명합니다.
            </p>
            <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
              Nexon OpenAPI 기반 · 실시간 캐릭터 정보 · 디스코드 봇 연동
            </p>

            <div className="glass flex items-center rounded-2xl overflow-hidden mb-4 max-w-lg lg:mx-0 mx-auto"
              style={{ boxShadow: "0 4px 20px rgba(37,99,235,0.08)" }}>
              <Search size={16} className="ml-4 shrink-0" style={{ color: "var(--text-muted)" }} />
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
              <button onClick={() => go()} className="btn-primary m-2 px-5 py-2.5 text-sm">
                조회하기
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href={DISCORD_URL} target="_blank" className="btn-primary px-7 py-3 text-sm text-center">
                메이플봇 서버에 추가하기
              </Link>
              <Link href="/character" className="btn-outline px-7 py-3 text-sm text-center">
                캐릭터 조회하기
              </Link>
            </div>
          </div>

          {/* 우측 디스코드 목업 */}
          <div className="shrink-0 flex justify-center">
            <div style={{ position: "relative" }}>
              {/* Neon glow */}
              <div style={{
                position: "absolute", inset: "-24px", borderRadius: "32px",
                background: "radial-gradient(ellipse, rgba(88,101,242,0.2) 0%, transparent 70%)",
                filter: "blur(24px)",
              }} />
              <div style={{
                position: "relative",
                transform: "perspective(1200px) rotateY(-10deg) rotateX(4deg)",
                filter: "drop-shadow(0 24px 48px rgba(37,99,235,0.18))",
              }}>
                <DiscordMockup command="/정보" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 명령어 인터랙티브 프리뷰 ── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black mb-2" style={{ color: "var(--text)" }}>봇을 미리 체험해보세요</h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>명령어를 클릭하면 실제 출력 결과를 확인할 수 있어요</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* 명령어 목록 */}
          <div className="w-full md:w-48 shrink-0 space-y-2">
            {COMMANDS_PREVIEW.map(({ cmd, desc }) => (
              <button key={cmd} onClick={() => setActiveCmd(cmd)}
                className="w-full text-left px-4 py-3 rounded-xl transition-all"
                style={{
                  background: activeCmd === cmd ? "rgba(37,99,235,0.08)" : "var(--bg-card)",
                  border: `1px solid ${activeCmd === cmd ? "rgba(37,99,235,0.3)" : "var(--border)"}`,
                  boxShadow: activeCmd === cmd ? "0 2px 12px rgba(37,99,235,0.1)" : "none",
                }}>
                <p className="text-sm font-bold font-mono mb-0.5" style={{ color: activeCmd === cmd ? "var(--blue)" : "var(--text)" }}>
                  {cmd}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </button>
            ))}
          </div>

          {/* 프리뷰 */}
          <div className="flex-1 flex justify-center">
            <div style={{
              transform: "perspective(1000px) rotateY(-4deg)",
              transition: "all 0.25s ease",
              filter: "drop-shadow(0 12px 32px rgba(37,99,235,0.13))",
            }}>
              <DiscordMockup command={activeCmd} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 기능 소개 ── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black mb-2" style={{ color: "var(--text)" }}>제공 기능</h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Nexon OpenAPI를 통해 다양한 캐릭터 정보를 제공합니다
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FEATURES.map((f) => (
            <div key={f.label}
              className="glass rounded-2xl p-5 transition-all hover:-translate-y-1 cursor-default"
              style={{ boxShadow: "0 2px 12px rgba(37,99,235,0.05)" }}>
              <div className="w-2 h-2 rounded-full mb-4"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)" }} />
              <p className="font-bold text-sm mb-1" style={{ color: "var(--text)" }}>{f.label}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 최근 업데이트 ── */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>최근 업데이트</h3>
            <Link href="/updates" className="text-xs font-semibold hover:underline" style={{ color: "var(--blue)" }}>
              전체 보기
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT_UPDATES.map((u, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-mono shrink-0 tabular-nums" style={{ color: "var(--text-muted)" }}>{u.date}</span>
                <div className="w-1 h-1 rounded-full shrink-0" style={{ background: "var(--blue-light)" }} />
                <span className="text-sm" style={{ color: "var(--text-sub)" }}>{u.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="rounded-3xl p-10 text-center"
          style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6)", boxShadow: "0 8px 40px rgba(37,99,235,0.3)" }}>
          <h2 className="text-2xl font-black mb-2 text-white">지금 바로 시작하세요</h2>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
            디스코드 서버에 메이플봇을 추가하고<br />
            /정보 명령어로 캐릭터를 조회하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={DISCORD_URL} target="_blank"
              className="px-8 py-3.5 text-sm font-bold rounded-xl transition-all hover:opacity-90 text-center text-white"
              style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)" }}>
              메이플봇 서버에 추가하기
            </Link>
            <Link href="/bot-guide"
              className="px-8 py-3.5 text-sm font-bold rounded-xl transition-all hover:opacity-90 text-center"
              style={{ background: "#ffffff", color: "var(--blue)" }}>
              사용 방법 보기
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
