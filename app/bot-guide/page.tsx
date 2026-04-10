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

// ─── Maple 포인트 컬러 ─────────────────────────────────────────────────────────
const M = { red: "#e84040", orange: "#f5832e", gold: "#fbbf24" }

// ─── 사이드바 섹션 목록 ────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "start",       label: "시작하기",    Icon: Zap      },
  { id: "command",     label: "명령어",      Icon: Terminal },
  { id: "features",    label: "버튼 기능",   Icon: Layers   },
  { id: "permissions", label: "권한 / 보안", Icon: Lock     },
]

// ─── 버튼 기능 카드 데이터 ────────────────────────────────────────────────────
const FEATURES = [
  {
    Icon: Shield,
    label: "장비 보기",
    desc: "착용 중인 장비 전체 목록과 잠재능력, 스타포스 강화 수치를 조회합니다.",
    tags: ["장비 목록", "잠재능력", "에디셔널", "스타포스"],
  },
  {
    Icon: TrendingUp,
    label: "레벨 변동",
    desc: "최근 7일간의 경험치 히스토리와 레벨 변동 내역을 그래프로 표시합니다.",
    tags: ["경험치 히스토리", "레벨 히스토리", "7일"],
  },
  {
    Icon: Star,
    label: "헥사",
    desc: "헥사 코어 강화 현황과 헥사 스탯 정보를 한눈에 확인할 수 있습니다.",
    tags: ["헥사 코어 레벨", "헥사 스탯"],
  },
  {
    Icon: Sparkles,
    label: "코디",
    desc: "착용 중인 캐시 아이템과 헤어·성형·피부 등 외형 정보를 조회합니다.",
    tags: ["캐시 아이템", "헤어 / 성형 / 피부"],
  },
]

// ─── CopyButton ───────────────────────────────────────────────────────────────
function CopyButton({ text, light = false }: { text: string; light?: boolean }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy}
      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md font-medium transition-all shrink-0"
      style={{
        background: copied
          ? "rgba(34,197,94,0.15)"
          : light ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
        color: copied ? "#4ade80" : light ? "rgba(255,255,255,0.6)" : "var(--text-muted)",
        border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
      }}>
      {copied ? <><Check size={11} />복사됨</> : <><Copy size={11} />복사</>}
    </button>
  )
}

// ─── 섹션 제목 ────────────────────────────────────────────────────────────────
function SectionTitle({ num, icon: Icon, title, sub }: {
  num: string; icon: React.ElementType; title: string; sub?: string
}) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
        style={{ background: "rgba(245,131,46,0.1)", border: "1px solid rgba(245,131,46,0.2)" }}>
        <Icon size={16} style={{ color: M.orange }} />
      </div>
      <div>
        <div className="text-xs font-semibold mb-1" style={{ color: M.orange, letterSpacing: "0.08em" }}>
          {num}
        </div>
        <h2 className="text-xl font-black" style={{ color: "var(--text)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          {title}
        </h2>
        {sub && <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{sub}</p>}
      </div>
    </div>
  )
}

// ─── Discord 임베드 목업 ──────────────────────────────────────────────────────
function DiscordMockup() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#313338", fontFamily: "inherit" }}>
      {/* 채널 헤더 */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
        <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}># 일반</span>
      </div>

      {/* 봇 메시지 */}
      <div className="px-4 py-4 flex gap-3">
        {/* 봇 아바타 */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: `linear-gradient(135deg, ${M.red}, ${M.orange})` }}>
          <span className="text-white font-black text-xs">M</span>
        </div>
        <div className="flex-1 min-w-0">
          {/* 봇 이름 */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold" style={{ color: "#fff" }}>메이플봇</span>
            <span className="text-xs px-1.5 py-0.5 rounded font-bold"
              style={{ background: "#5865f2", color: "#fff", fontSize: "10px" }}>BOT</span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>오늘 오후 3:42</span>
          </div>

          {/* 임베드 카드 */}
          <div className="rounded-md overflow-hidden" style={{ background: "#2b2d31", borderLeft: "4px solid #5865f2", maxWidth: "420px" }}>
            <div className="px-4 py-3">
              {/* 캐릭터 이름 */}
              <p className="text-sm font-bold mb-2.5" style={{ color: "#fff" }}>메이플유저</p>

              {/* 정보 그리드 */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-6 mb-3">
                {[
                  ["직업", "아크"],
                  ["서버", "리부트"],
                  ["레벨", "261"],
                  ["전투력", "1,234,567"],
                  ["유니온", "시즌3 · Lv.8,945"],
                  ["인기도", "999"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{k}</p>
                    <p className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{v}</p>
                  </div>
                ))}
              </div>

              {/* 푸터 */}
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                Nexon OpenAPI · 실시간 조회
              </p>
            </div>

            {/* 버튼 행 */}
            <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-white/5">
              {["장비 보기", "레벨 변동", "헥사", "코디"].map(b => (
                <span key={b} className="text-xs font-medium px-3 py-1.5 rounded"
                  style={{ background: "#4e5058", color: "rgba(255,255,255,0.8)", cursor: "default" }}>
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BotGuidePage() {
  const [active, setActive] = useState("start")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
        }
      },
      { rootMargin: "-15% 0px -60% 0px" }
    )
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
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
              <p className="text-xs font-semibold uppercase tracking-widest mb-3 px-3"
                style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                목차
              </p>
              <nav className="space-y-0.5">
                {SECTIONS.map(sec => {
                  const isActive = active === sec.id
                  return (
                    <button key={sec.id} onClick={() => scrollTo(sec.id)}
                      className="w-full text-left flex items-center gap-2.5 py-2 rounded-lg text-sm transition-all"
                      style={{
                        paddingLeft: "10px", paddingRight: "12px",
                        color: isActive ? M.orange : "var(--text-sub)",
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
                  className="block w-full text-center text-xs font-bold py-2.5 rounded-lg text-white transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${M.red}, ${M.orange})`,
                    boxShadow: "0 2px 12px rgba(232,64,64,0.2)",
                  }}>
                  서버에 추가하기
                </Link>
              </div>
            </div>
          </aside>

          {/* 사이드바 구분선 */}
          <div className="hidden md:block shrink-0 self-stretch"
            style={{ width: "1px", background: "var(--border)" }} />

          {/* ── 메인 콘텐츠 ── */}
          <main className="flex-1 min-w-0 py-10 md:pl-10">

            {/* 모바일 드롭다운 */}
            <div className="md:hidden mb-7 relative">
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
                <span className="flex items-center gap-2">
                  {activeSec && <activeSec.Icon size={14} style={{ color: M.orange }} />}
                  <span>{activeSec?.label}</span>
                </span>
                <ChevronDown size={15} style={{
                  transform: mobileOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s", color: "var(--text-muted)",
                }} />
              </button>
              {mobileOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-30"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                  {SECTIONS.map((sec, i) => (
                    <button key={sec.id} onClick={() => scrollTo(sec.id)}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-3 text-sm transition-all"
                      style={{
                        color: active === sec.id ? M.orange : "var(--text-sub)",
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
            <div className="mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
                style={{ background: "rgba(245,131,46,0.1)", color: M.orange, border: "1px solid rgba(245,131,46,0.2)" }}>
                <Zap size={11} />
                메이플스토리 디스코드 봇
              </div>
              <h1 className="text-3xl font-black mb-3"
                style={{ color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
                명령어 가이드
              </h1>
              <p className="text-sm mb-8" style={{ color: "var(--text-muted)", lineHeight: 1.85, maxWidth: "460px" }}>
                메이플봇의 모든 디스코드 명령어와 기능을 안내합니다.
                데이터는 <strong style={{ color: "var(--text-sub)", fontWeight: 600 }}>Nexon OpenAPI</strong>를 통해 실시간으로 제공됩니다.
              </p>
              <Link href={DISCORD_URL} target="_blank"
                className="inline-flex items-center gap-2 text-sm font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${M.red}, ${M.orange})`,
                  padding: "12px 24px", borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(232,64,64,0.3)",
                }}>
                메이플봇 서버에 추가하기
                <ExternalLink size={14} />
              </Link>
            </div>

            {/* ───────────────── 01 시작하기 ───────────────── */}
            <section id="start" style={{ scrollMarginTop: "84px", marginBottom: "60px" }}>
              <SectionTitle num="01" icon={Zap} title="시작하기"
                sub="별도의 설정 없이 봇을 초대하는 즉시 사용할 수 있습니다." />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { n: "1", t: "봇 초대",    d: "'서버에 추가하기' 버튼을 눌러 원하는 서버를 선택하고 권한을 허용합니다." },
                  { n: "2", t: "명령어 입력", d: "채널에서 /정보 [닉네임] 을 입력합니다. 슬래시(/) 입력 시 자동완성이 나타납니다." },
                  { n: "3", t: "결과 확인",   d: "봇이 Nexon OpenAPI에서 캐릭터 정보를 조회해 임베드 카드로 즉시 응답합니다." },
                ].map((s, i) => (
                  <div key={s.n} className="relative rounded-2xl p-5"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}>
                    {i < 2 && (
                      <ArrowRight size={14}
                        className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10"
                        style={{ color: "var(--border)" }} />
                    )}
                    <div className="text-4xl font-black mb-4 leading-none"
                      style={{ color: "rgba(245,131,46,0.12)" }}>{s.n}</div>
                    <p className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>{s.t}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)", lineHeight: 1.75 }}>{s.d}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ───────────────── 02 명령어 ───────────────── */}
            <section id="command" style={{ scrollMarginTop: "84px", marginBottom: "60px" }}>
              <SectionTitle num="02" icon={Terminal} title="명령어"
                sub="현재 슬래시(/) 명령어 1개가 지원됩니다." />

              {/* 명령어 설명 카드 */}
              <div className="rounded-2xl overflow-hidden mb-6" style={{ border: "1px solid var(--border)" }}>

                {/* 카드 헤더 */}
                <div className="flex flex-wrap items-center gap-3 px-6 py-4"
                  style={{ background: "rgba(255,255,255,0.018)", borderBottom: "1px solid var(--border)" }}>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(59,130,246,0.12)", color: "var(--blue-light)", border: "1px solid rgba(59,130,246,0.2)" }}>
                    슬래시 명령어
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    캐릭터 기본 정보 조회
                  </span>
                </div>

                <div className="px-6 py-6 space-y-6">
                  <p className="text-sm" style={{ color: "var(--text-sub)", lineHeight: 1.85 }}>
                    Nexon OpenAPI를 통해 캐릭터의 기본 정보를 실시간으로 조회합니다.
                    슬래시(/)를 입력하면 자동완성 목록이 나타납니다.
                  </p>

                  {/* 명령어 입력 예시 */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2.5"
                      style={{ color: "var(--text-muted)" }}>
                      명령어 구문
                    </p>
                    <div className="flex items-center justify-between rounded-xl px-5 py-3.5"
                      style={{
                        background: "rgba(0,0,0,0.35)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderLeft: "3px solid var(--blue-light)",
                      }}>
                      <code className="text-sm font-mono" style={{ color: "#e2e8f0", letterSpacing: "0.02em" }}>
                        /정보 [캐릭터명]
                      </code>
                      <CopyButton text="/정보 " light />
                    </div>
                  </div>

                  {/* 조회 결과 항목 */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                      style={{ color: "var(--text-muted)" }}>
                      조회 결과
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {["레벨 및 직업군", "전투력", "유니온 등급 / 레벨", "인기도", "서버 및 길드"].map(r => (
                        <div key={r} className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm"
                          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <CheckCircle2 size={13} className="shrink-0" style={{ color: "var(--blue-light)" }} />
                          <span style={{ color: "var(--text-sub)" }}>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 노트 */}
                  <div className="flex items-start gap-3 rounded-xl px-4 py-3.5"
                    style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.12)" }}>
                    <Info size={14} className="shrink-0 mt-0.5" style={{ color: "var(--blue-light)" }} />
                    <p className="text-xs" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
                      조회 결과는 서버 부하 방지를 위해 최대 1시간 캐싱됩니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* Discord 임베드 미리보기 */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--text-muted)" }}>
                  실제 응답 예시
                </p>
                <DiscordMockup />
              </div>
            </section>

            {/* ───────────────── 03 버튼 기능 ───────────────── */}
            <section id="features" style={{ scrollMarginTop: "84px", marginBottom: "60px" }}>
              <SectionTitle num="03" icon={Layers} title="버튼 기능"
                sub="/정보 실행 후 본인에게만 표시되는 버튼입니다. 원하는 정보를 바로 조회할 수 있습니다." />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FEATURES.map(({ Icon, label, desc, tags }) => (
                  <div key={label} className="rounded-2xl p-5"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
                        <Icon size={15} style={{ color: "#c084fc" }} />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                        style={{ background: "rgba(168,85,247,0.08)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" }}>
                        {label}
                      </span>
                    </div>
                    <p className="text-sm mb-4" style={{ color: "var(--text-sub)", lineHeight: 1.75 }}>{desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-md"
                          style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ───────────────── 04 권한 / 보안 ───────────────── */}
            <section id="permissions" style={{ scrollMarginTop: "84px", marginBottom: "40px" }}>
              <SectionTitle num="04" icon={Lock} title="권한 및 보안 안내" />

              {/* 보안 강조 박스 */}
              <div className="rounded-2xl p-6 mb-5"
                style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)" }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: M.gold }} />
                  <div>
                    <p className="text-sm font-semibold mb-1.5" style={{ color: M.gold }}>개인정보 안전 안내</p>
                    <p className="text-sm" style={{ color: "var(--text-muted)", lineHeight: 1.75 }}>
                      메이플봇은 <strong style={{ color: "var(--text-sub)" }}>Nexon OpenAPI</strong>를 통해 공개된 캐릭터 정보만 조회합니다.
                      이용자의 비밀번호·계정 정보·개인정보를 요구하거나 저장하지 않습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 권한 목록 */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--text-muted)" }}>
                  요청 권한 (최소 권한만 요청)
                </p>
                {[
                  { name: "메시지 보기 (View Channels)",            reason: "명령어가 입력된 채널을 봇이 인식하기 위해 필요합니다." },
                  { name: "메시지 보내기 (Send Messages)",           reason: "캐릭터 조회 결과를 채널에 전송하기 위해 필요합니다." },
                  { name: "메시지 기록 읽기 (Read Message History)", reason: "슬래시 명령어 처리 및 버튼 상호작용을 위해 필요합니다." },
                ].map(p => (
                  <div key={p.name} className="flex items-start gap-3 rounded-xl px-4 py-4"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}>
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: "var(--blue-light)" }} />
                    <div>
                      <p className="text-sm font-medium mb-0.5" style={{ color: "var(--text)" }}>{p.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)", lineHeight: 1.65 }}>{p.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

// ─── Info 아이콘 import ───────────────────────────────────────────────────────
function Info({ size, className, style }: { size: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}
