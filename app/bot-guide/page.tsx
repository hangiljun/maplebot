"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Copy, Check, ChevronDown, ExternalLink,
  Zap, Terminal, Layers, Lock, Shield,
  TrendingUp, Star, Sparkles, CheckCircle2,
  AlertTriangle, ArrowRight,
} from "lucide-react"

const DISCORD_URL = "https://discord.com/oauth2/authorize?client_id=1491444296623325194&permissions=51200&integration_type=0&scope=bot"
const M = { red: "#e84040", orange: "#f5832e", gold: "#fbbf24" }

// ─── 목차 ─────────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "start",       label: "시작하기",    Icon: Zap      },
  { id: "command",     label: "명령어",      Icon: Terminal },
  { id: "features",    label: "버튼 기능",   Icon: Layers   },
  { id: "permissions", label: "권한 / 보안", Icon: Lock     },
]

// ─── 버튼 기능 데이터 ─────────────────────────────────────────────────────────
const FEATURES = [
  {
    Icon: Shield,
    label: "장비 보기",
    color: "#60a5fa",
    colorBg: "rgba(59,130,246,0.1)",
    colorBorder: "rgba(59,130,246,0.22)",
    desc: "착용 중인 장비 전체와 잠재능력, 에디셔널 잠재, 스타포스 강화 수치를 조회합니다.",
    tags: ["장비 목록", "잠재능력", "에디셔널", "스타포스"],
    preview: [
      "투구  앱솔랩스 마기나 헬름 (17성)",
      "상의  앱솔랩스 마기나 아머 (17성)",
      "잠재  보스 데미지 +40% / STR +12%",
    ],
  },
  {
    Icon: TrendingUp,
    label: "레벨 변동",
    color: "#4ade80",
    colorBg: "rgba(34,197,94,0.1)",
    colorBorder: "rgba(34,197,94,0.22)",
    desc: "최근 7일간의 경험치 히스토리와 레벨 변동 내역을 날짜별로 확인합니다.",
    tags: ["경험치 히스토리 (7일)", "레벨 히스토리"],
    preview: [
      "12/20  Lv.260 → 261 달성",
      "12/19  경험치 +2.31%",
      "12/18  경험치 +1.87%",
    ],
  },
  {
    Icon: Star,
    label: "헥사",
    color: "#facc15",
    colorBg: "rgba(234,179,8,0.1)",
    colorBorder: "rgba(234,179,8,0.22)",
    desc: "헥사 코어 강화 현황과 헥사 스탯 수치를 한눈에 확인합니다.",
    tags: ["헥사 코어 레벨", "헥사 스탯"],
    preview: [
      "강화 코어  파이널 어택 Lv.5",
      "공격 코어  아케인 에임 Lv.3",
      "헥사 STR +240 / DEX +180",
    ],
  },
  {
    Icon: Sparkles,
    label: "코디",
    color: "#c084fc",
    colorBg: "rgba(168,85,247,0.1)",
    colorBorder: "rgba(168,85,247,0.22)",
    desc: "착용 중인 캐시 아이템과 헤어·성형·피부 등 외형 정보를 조회합니다.",
    tags: ["캐시 아이템", "헤어 / 성형 / 피부"],
    preview: [
      "머리 장식  루시드의 왕관",
      "눈 장식   환상의 별빛 안경",
      "헤어      오로라 컷",
    ],
  },
]

// ─── CopyButton ───────────────────────────────────────────────────────────────
function CopyButton({ text, light }: { text: string; light?: boolean }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy}
      className="flex items-center gap-1.5 font-medium transition-all shrink-0"
      style={{
        fontSize: "12px",
        padding: "5px 10px",
        borderRadius: "4px",
        background: copied ? "rgba(34,197,94,0.15)" : light ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
        color:      copied ? "#4ade80" : light ? "rgba(255,255,255,0.55)" : "var(--text-muted)",
        border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
      }}>
      {copied ? <><Check size={11} />복사됨</> : <><Copy size={11} />복사</>}
    </button>
  )
}

// ─── 섹션 헤딩 ────────────────────────────────────────────────────────────────
function SectionHeading({ num, Icon, title, sub }: {
  num: string; Icon: React.ElementType; title: string; sub?: string
}) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="flex items-center justify-center shrink-0"
        style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(245,131,46,0.1)", border: "1px solid rgba(245,131,46,0.2)" }}>
        <Icon size={18} style={{ color: M.orange }} />
      </div>
      <div>
        <p className="font-bold uppercase"
          style={{ fontSize: "11px", color: M.orange, letterSpacing: "0.1em", marginBottom: "4px" }}>
          {num}
        </p>
        <h2 className="font-black" style={{ fontSize: "1.75rem", color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          {title}
        </h2>
        {sub && (
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.7, marginTop: "6px" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Discord 명령어 자동완성 데모 ─────────────────────────────────────────────
function DiscordCommandDemo() {
  return (
    <div style={{ background: "#313338", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
      {/* 채널 헤더 */}
      <div className="flex items-center gap-2 px-4 py-2.5"
        style={{ background: "#2f3136", borderBottom: "1px solid rgba(0,0,0,0.25)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" style={{ color: "rgba(255,255,255,0.3)" }}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", fontWeight: 600 }}>일반</span>
      </div>

      {/* 자동완성 팝업 */}
      <div className="px-4 pt-3.5">
        <div style={{ background: "#1e1f22", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", overflow: "hidden" }}>
          <div className="px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              명령어
            </span>
          </div>
          <div className="flex items-center gap-3 px-3 py-3"
            style={{ background: "rgba(88,101,242,0.18)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: `linear-gradient(135deg, ${M.red}, ${M.orange})` }}>
              <span className="text-white font-black" style={{ fontSize: "13px" }}>M</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <code style={{ fontSize: "15px", fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>/정보</code>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>캐릭터명</span>
              </div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)", lineHeight: 1.4, marginTop: "2px" }}>
                캐릭터 기본 정보를 조회합니다
              </p>
            </div>
            <span style={{ background: "#5865f2", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px" }}>
              메이플봇
            </span>
          </div>
        </div>
      </div>

      {/* 입력창 */}
      <div className="px-4 pb-4 pt-2">
        <div className="flex items-center gap-2 px-4 py-3"
          style={{ background: "#383a40", borderRadius: "6px" }}>
          <code style={{ fontSize: "15px", fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>/정보</code>
          <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)" }}>메이플유저</span>
          <span style={{ display: "inline-block", width: "2px", height: "16px", background: "rgba(255,255,255,0.75)", borderRadius: "1px" }} />
        </div>
      </div>
    </div>
  )
}

// ─── Discord 응답 임베드 ──────────────────────────────────────────────────────
function DiscordEmbed() {
  return (
    <div style={{ background: "#313338", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
      {/* 채널 헤더 */}
      <div className="flex items-center gap-2 px-4 py-2.5"
        style={{ background: "#2f3136", borderBottom: "1px solid rgba(0,0,0,0.25)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" style={{ color: "rgba(255,255,255,0.3)" }}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", fontWeight: 600 }}>일반</span>
      </div>

      {/* 메시지 */}
      <div className="flex gap-3 px-4 py-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: `linear-gradient(135deg, ${M.red}, ${M.orange})` }}>
          <span className="text-white font-black" style={{ fontSize: "14px" }}>M</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#fff" }}>메이플봇</span>
            <span style={{ background: "#5865f2", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 5px", borderRadius: "3px" }}>APP</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.28)" }}>오늘 오후 3:42</span>
          </div>

          {/* 임베드 카드 */}
          <div style={{ background: "#2b2d31", borderLeft: "4px solid #5865f2", borderRadius: "4px", overflow: "hidden", maxWidth: "420px" }}>
            <div className="px-4 py-3.5">
              <p style={{ fontWeight: 700, color: "#fff", fontSize: "15px", marginBottom: "12px" }}>메이플유저</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2.5" style={{ marginBottom: "12px" }}>
                {[
                  ["직업", "아크"], ["서버", "리부트"],
                  ["레벨", "261"], ["전투력", "1,234,567"],
                  ["유니온", "시즌3 · Lv.8,945"], ["인기도", "999"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "2px" }}>{k}</p>
                    <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "13px", fontWeight: 600 }}>{v}</p>
                  </div>
                ))}
              </div>
              <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "11px" }}>Nexon OpenAPI · 실시간 조회</p>
            </div>
            <div className="flex flex-wrap gap-2 px-4 py-3"
              style={{ background: "rgba(0,0,0,0.15)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              {["장비 보기", "레벨 변동", "헥사", "코디"].map(b => (
                <span key={b} style={{ background: "#4e5058", color: "rgba(255,255,255,0.88)", fontSize: "13px", fontWeight: 500, padding: "6px 14px", borderRadius: "3px", cursor: "default" }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 기능 카드 ────────────────────────────────────────────────────────────────
function FeatureCard({ f }: { f: typeof FEATURES[0] }) {
  const { Icon, label, color, colorBg, colorBorder, desc, tags, preview } = f
  return (
    <div className="flex flex-col overflow-hidden"
      style={{ border: "1px solid var(--border)", borderRadius: "8px", background: "rgba(255,255,255,0.015)" }}>

      {/* 헤더 */}
      <div className="flex items-center gap-3 px-5 py-4"
        style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-center shrink-0"
          style={{ width: "32px", height: "32px", borderRadius: "6px", background: colorBg, border: `1px solid ${colorBorder}` }}>
          <Icon size={15} style={{ color }} />
        </div>
        <span style={{ fontSize: "13px", fontWeight: 700, padding: "3px 10px", borderRadius: "4px", background: colorBg, color, border: `1px solid ${colorBorder}` }}>
          {label}
        </span>
      </div>

      {/* 설명 */}
      <div className="px-5 py-5 flex-1">
        <p style={{ fontSize: "1.05rem", color: "var(--text-sub)", lineHeight: 1.78, marginBottom: "16px" }}>{desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map(t => (
            <span key={t} style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "3px", background: "rgba(255,255,255,0.04)", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 결과 미리보기 */}
      <div className="mx-5 mb-5 overflow-hidden"
        style={{ background: "#1e1f22", borderLeft: `3px solid ${color}`, borderRadius: "4px" }}>
        <div className="flex items-center px-3 py-1.5"
          style={{ background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
            결과 예시
          </span>
        </div>
        <div className="px-3 py-3 space-y-1.5">
          {preview.map((line, i) => (
            <p key={i} style={{ fontFamily: "monospace", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BotGuidePage() {
  const [active, setActive]         = useState("start")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { for (const e of entries) if (e.isIntersecting) setActive(e.target.id) },
      { rootMargin: "-15% 0px -60% 0px" }
    )
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    setMobileOpen(false)
  }

  const activeSec = SECTIONS.find(s => s.id === active)

  return (
    <div style={{ paddingTop: "56px", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex">

          {/* ── 사이드바 ── */}
          <aside className="hidden md:flex flex-col shrink-0" style={{ width: "200px" }}>
            <div className="sticky py-10 pr-6" style={{ top: "56px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "10px", paddingLeft: "10px" }}>
                목차
              </p>
              <nav className="space-y-0.5">
                {SECTIONS.map(sec => {
                  const isActive = active === sec.id
                  return (
                    <button key={sec.id} onClick={() => scrollTo(sec.id)}
                      className="w-full text-left flex items-center gap-2.5 transition-all"
                      style={{
                        fontSize: "14px",
                        padding: "8px 12px 8px 10px",
                        borderRadius: "6px",
                        color:      isActive ? M.orange : "var(--text-sub)",
                        background: isActive ? "rgba(245,131,46,0.08)" : "transparent",
                        fontWeight: isActive ? 600 : 400,
                        borderLeft: isActive ? `2px solid ${M.orange}` : "2px solid transparent",
                      }}>
                      <sec.Icon size={14} style={{ opacity: isActive ? 1 : 0.5, flexShrink: 0 }} />
                      {sec.label}
                    </button>
                  )
                })}
              </nav>
              <div className="mt-8 px-2">
                <Link href={DISCORD_URL} target="_blank"
                  className="block w-full text-center font-bold text-white"
                  style={{ fontSize: "13px", padding: "10px 12px", borderRadius: "6px", background: `linear-gradient(135deg, ${M.red}, ${M.orange})`, boxShadow: "0 2px 14px rgba(232,64,64,0.25)" }}>
                  서버에 추가하기
                </Link>
              </div>
            </div>
          </aside>

          {/* 구분선 */}
          <div className="hidden md:block shrink-0 self-stretch"
            style={{ width: "1px", background: "var(--border)" }} />

          {/* ── 메인 ── */}
          <main className="flex-1 min-w-0 py-10 md:pl-10">

            {/* 모바일 드롭다운 */}
            <div className="md:hidden mb-7 relative">
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="w-full flex items-center justify-between px-4 py-3"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "14px", fontWeight: 500 }}>
                <span className="flex items-center gap-2">
                  {activeSec && <activeSec.Icon size={14} style={{ color: M.orange }} />}
                  <span>{activeSec?.label}</span>
                </span>
                <ChevronDown size={15} style={{ transform: mobileOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "var(--text-muted)" }} />
              </button>
              {mobileOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 overflow-hidden z-30"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                  {SECTIONS.map((sec, i) => (
                    <button key={sec.id} onClick={() => scrollTo(sec.id)}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-3 transition-all"
                      style={{
                        fontSize: "14px",
                        color:      active === sec.id ? M.orange : "var(--text-sub)",
                        background: active === sec.id ? "rgba(245,131,46,0.07)" : "transparent",
                        fontWeight: active === sec.id ? 600 : 400,
                        borderBottom: i < SECTIONS.length - 1 ? "1px solid var(--border)" : "none",
                      }}>
                      <sec.Icon size={14} style={{ opacity: active === sec.id ? 1 : 0.5 }} />
                      {sec.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Hero ── */}
            <div className="relative overflow-hidden mb-14 px-8 py-10"
              style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
              {/* 배경 글로우 */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: `
                  radial-gradient(ellipse 65% 55% at 95% -5%, rgba(232,64,64,0.09) 0%, transparent 65%),
                  radial-gradient(ellipse 45% 35% at 0% 110%, rgba(245,131,46,0.06) 0%, transparent 60%)
                `,
              }} />

              <div className="relative">
                {/* 배지 */}
                <div className="inline-flex items-center gap-1.5 mb-5"
                  style={{ fontSize: "12px", fontWeight: 600, padding: "5px 12px", borderRadius: "4px", background: "rgba(245,131,46,0.1)", color: M.orange, border: "1px solid rgba(245,131,46,0.22)" }}>
                  <Zap size={11} />
                  메이플스토리 디스코드 봇
                </div>

                {/* H1 */}
                <h1 className="font-black mb-4"
                  style={{ fontSize: "clamp(2.2rem, 5vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.12, color: "var(--text)" }}>
                  명령어 가이드
                </h1>
                <p className="mb-8"
                  style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.78, maxWidth: "460px" }}>
                  메이플봇의 모든 디스코드 명령어와 기능을 안내합니다.
                  데이터는&nbsp;<strong style={{ color: "var(--text-sub)", fontWeight: 600 }}>Nexon OpenAPI</strong>를 통해 실시간 제공됩니다.
                </p>

                {/* CTA 버튼 */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <Link href={DISCORD_URL} target="_blank"
                    className="inline-flex items-center gap-2 font-bold text-white"
                    style={{ fontSize: "15px", padding: "12px 24px", borderRadius: "8px", background: `linear-gradient(135deg, ${M.red}, ${M.orange})`, boxShadow: "0 4px 20px rgba(232,64,64,0.32)" }}>
                    서버에 추가하기 <ExternalLink size={14} />
                  </Link>
                  <Link href="/character"
                    className="inline-flex items-center gap-1.5 font-medium"
                    style={{ fontSize: "15px", color: "var(--text-sub)", padding: "12px 20px", borderRadius: "8px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)" }}>
                    캐릭터 조회 <ArrowRight size={14} />
                  </Link>
                </div>

                {/* 통계 */}
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {[
                    { v: "실시간",  l: "Nexon API 연동" },
                    { v: "무료",    l: "서버 추가 비용 없음" },
                    { v: "1시간",   l: "최대 캐싱 주기" },
                  ].map(s => (
                    <div key={s.v} className="flex items-center gap-1.5" style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      <CheckCircle2 size={13} style={{ color: M.orange, flexShrink: 0 }} />
                      <strong style={{ color: "var(--text-sub)", fontWeight: 600 }}>{s.v}</strong>
                      &nbsp;{s.l}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ─────────────── 01 시작하기 ─────────────── */}
            <section id="start" style={{ scrollMarginTop: "84px", marginBottom: "64px" }}>
              <SectionHeading num="01" Icon={Zap} title="시작하기"
                sub="별도의 설정 없이 봇을 초대하는 즉시 명령어를 사용할 수 있습니다." />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { n: "1", t: "봇 초대",    d: "'서버에 추가하기'를 눌러 원하는 서버를 선택하고 권한을 허용합니다." },
                  { n: "2", t: "명령어 입력", d: "채널에서 /정보 [닉네임] 을 입력합니다. 슬래시(/) 입력 시 자동완성이 나타납니다." },
                  { n: "3", t: "결과 확인",   d: "봇이 캐릭터 정보를 Nexon OpenAPI에서 조회해 임베드 카드로 응답합니다." },
                ].map((s, i) => (
                  <div key={s.n} className="relative p-5"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                    {i < 2 && (
                      <ArrowRight size={14}
                        className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10"
                        style={{ color: "rgba(245,131,46,0.35)" }} />
                    )}
                    <div className="font-black mb-4 leading-none select-none"
                      style={{ fontSize: "3rem", color: "rgba(245,131,46,0.12)" }}>{s.n}</div>
                    <p className="font-semibold mb-2" style={{ fontSize: "1.1rem", color: "var(--text)" }}>{s.t}</p>
                    <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.75 }}>{s.d}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ─────────────── 02 명령어 ─────────────── */}
            <section id="command" style={{ scrollMarginTop: "84px", marginBottom: "64px" }}>
              <SectionHeading num="02" Icon={Terminal} title="명령어"
                sub="현재 슬래시(/) 명령어 1개가 지원됩니다." />

              <div className="space-y-5">

                {/* 명령어 정보 카드 */}
                <div style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                  {/* 카드 헤더 */}
                  <div className="flex flex-wrap items-center gap-3 px-6 py-4"
                    style={{ background: "rgba(255,255,255,0.018)", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "4px", background: "rgba(59,130,246,0.12)", color: "var(--blue-light)", border: "1px solid rgba(59,130,246,0.22)" }}>
                      슬래시 명령어
                    </span>
                    <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>캐릭터 기본 정보 조회</span>
                  </div>

                  <div className="px-6 py-6 space-y-6">
                    {/* 설명 */}
                    <p style={{ fontSize: "1.05rem", color: "var(--text-sub)", lineHeight: 1.85 }}>
                      Nexon OpenAPI를 통해 캐릭터의 기본 정보를 실시간으로 조회합니다.
                      슬래시(/)를 입력하면 자동완성 목록이 나타납니다.
                    </p>

                    {/* 명령어 구문 */}
                    <div>
                      <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "10px" }}>
                        명령어 구문
                      </p>
                      <div className="flex items-center justify-between px-5 py-4"
                        style={{ background: "rgba(0,0,0,0.32)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid var(--blue-light)", borderRadius: "6px" }}>
                        <code style={{ fontSize: "1.2rem", color: "#e2e8f0", letterSpacing: "0.02em", fontFamily: "monospace" }}>
                          /정보 [캐릭터명]
                        </code>
                        <CopyButton text="/정보 " light />
                      </div>
                    </div>

                    {/* 조회 결과 */}
                    <div>
                      <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "12px" }}>
                        조회 결과
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {["레벨 및 직업군", "전투력", "유니온 등급 / 레벨", "인기도", "서버 및 길드"].map(r => (
                          <div key={r} className="flex items-center gap-3 px-4 py-3"
                            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                            <CheckCircle2 size={14} className="shrink-0" style={{ color: "var(--blue-light)" }} />
                            <span style={{ fontSize: "1rem", color: "var(--text-sub)" }}>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 캐싱 안내 */}
                    <div className="flex items-start gap-3 px-4 py-4"
                      style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.13)", borderRadius: "6px" }}>
                      <InfoIcon size={15} className="shrink-0 mt-0.5" style={{ color: "var(--blue-light)" }} />
                      <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
                        조회 결과는 서버 부하 방지를 위해 최대 1시간 캐싱됩니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Discord 명령어 입력 데모 */}
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "10px" }}>
                    명령어 입력 예시
                  </p>
                  <DiscordCommandDemo />
                </div>

                {/* Discord 응답 임베드 */}
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "10px" }}>
                    실제 응답 예시
                  </p>
                  <DiscordEmbed />
                </div>
              </div>
            </section>

            {/* ─────────────── 03 버튼 기능 ─────────────── */}
            <section id="features" style={{ scrollMarginTop: "84px", marginBottom: "64px" }}>
              <SectionHeading num="03" Icon={Layers} title="버튼 기능"
                sub="/정보 실행 후 본인에게만 표시되는 버튼입니다. 원하는 정보를 즉시 조회할 수 있습니다." />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FEATURES.map(f => <FeatureCard key={f.label} f={f} />)}
              </div>
            </section>

            {/* ─────────────── 04 권한 / 보안 ─────────────── */}
            <section id="permissions" style={{ scrollMarginTop: "84px", marginBottom: "40px" }}>
              <SectionHeading num="04" Icon={Lock} title="권한 및 보안 안내" />

              <div className="space-y-4">
                {/* 보안 강조 */}
                <div className="p-5"
                  style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.22)", borderRadius: "8px" }}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={17} className="shrink-0 mt-0.5" style={{ color: M.gold }} />
                    <div>
                      <p style={{ fontSize: "1rem", fontWeight: 600, color: M.gold, marginBottom: "6px" }}>개인정보 안전 안내</p>
                      <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.78 }}>
                        메이플봇은 <strong style={{ color: "var(--text-sub)" }}>Nexon OpenAPI</strong>를 통해 공개된 캐릭터 정보만 조회합니다.
                        이용자의 비밀번호·계정 정보·개인정보를 요구하거나 저장하지 않습니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 권한 목록 */}
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "12px" }}>
                    요청 권한 (최소한만 요청)
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { name: "메시지 보기 (View Channels)",            reason: "명령어가 입력된 채널을 봇이 인식하기 위해 필요합니다." },
                      { name: "메시지 보내기 (Send Messages)",           reason: "캐릭터 조회 결과를 채널에 전송하기 위해 필요합니다." },
                      { name: "메시지 기록 읽기 (Read Message History)", reason: "슬래시 명령어 처리 및 버튼 상호작용을 위해 필요합니다." },
                    ].map(p => (
                      <div key={p.name} className="flex items-start gap-3 px-5 py-4"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "6px" }}>
                        <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: "var(--blue-light)" }} />
                        <div>
                          <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: "3px" }}>{p.name}</p>
                          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.65 }}>{p.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

// ─── Info SVG 아이콘 ──────────────────────────────────────────────────────────
function InfoIcon(props: React.SVGProps<SVGSVGElement> & { size: number }) {
  const { size, ...rest } = props
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}
