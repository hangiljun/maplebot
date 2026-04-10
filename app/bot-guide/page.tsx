"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Copy, Check, ChevronDown, ExternalLink,
  Zap, User, Shield, TrendingUp, Layers, Palette, Lock,
  CheckCircle2, Info,
} from "lucide-react"

const DISCORD_URL = "https://discord.com/oauth2/authorize?client_id=1491444296623325194&permissions=51200&integration_type=0&scope=bot"

// ─── Types ───────────────────────────────────────────────────────────────────
type CategoryId =
  | "getting-started" | "character" | "equipment"
  | "growth" | "union-hexa" | "codi" | "bot-info"

type Category = { id: CategoryId; label: string; Icon: React.ElementType }
type Command = {
  id: string
  category: CategoryId
  title: string
  cmd: string | null
  isButton?: boolean
  badge?: string
  desc: string
  steps?: string[]
  returns?: string[]
  buttons?: string[]
  note?: string
}

// ─── 카테고리 데이터 ──────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { id: "getting-started", label: "시작하기",       Icon: Zap        },
  { id: "character",       label: "캐릭터 정보",    Icon: User       },
  { id: "equipment",       label: "장비 / 능력치",  Icon: Shield     },
  { id: "growth",          label: "성장 / 레벨",    Icon: TrendingUp },
  { id: "union-hexa",      label: "유니온 / 헥사",  Icon: Layers     },
  { id: "codi",            label: "코디 / 외형",    Icon: Palette    },
  { id: "bot-info",        label: "봇 정보",        Icon: Lock       },
]

// ─── 명령어 데이터 (추가/수정 시 이 배열만 편집) ─────────────────────────────
const COMMANDS: Command[] = [
  {
    id: "getting-started",
    category: "getting-started",
    title: "봇 초대 및 시작",
    cmd: null,
    desc: "메이플봇을 디스코드 서버에 초대하고 바로 명령어를 사용할 수 있습니다. 별도의 설정 없이 초대 즉시 사용 가능합니다.",
    steps: [
      "'서버에 추가하기' 버튼으로 봇을 디스코드 서버에 초대합니다",
      "채널에서 /정보 [캐릭터 닉네임] 을 입력합니다",
      "봇이 Nexon OpenAPI로 캐릭터 정보를 조회해 임베드 카드로 응답합니다",
    ],
  },
  {
    id: "character",
    category: "character",
    title: "캐릭터 기본 정보",
    cmd: "/정보 [캐릭터명]",
    badge: "슬래시 명령어",
    desc: "Nexon OpenAPI를 통해 캐릭터의 기본 정보를 실시간으로 조회합니다. 슬래시(/)를 입력하면 자동완성 목록이 나타납니다.",
    returns: ["레벨 및 직업군", "전투력", "유니온 등급 / 레벨", "인기도", "서버 및 길드"],
    buttons: ["장비 보기", "레벨 변동", "헥사", "코디"],
    note: "조회 결과는 서버 부하 방지를 위해 최대 1시간 캐싱됩니다.",
  },
  {
    id: "equipment",
    category: "equipment",
    title: "장비 보기",
    cmd: "장비 보기",
    isButton: true,
    badge: "버튼",
    desc: "/정보 실행 후 나타나는 버튼으로, 본인에게만 표시되는 임시 메시지로 착용 중인 장비 전체를 조회합니다.",
    returns: ["착용 장비 전체 목록", "잠재능력 및 에디셔널 잠재능력", "스타포스 강화 수치"],
  },
  {
    id: "growth",
    category: "growth",
    title: "레벨 변동",
    cmd: "레벨 변동",
    isButton: true,
    badge: "버튼",
    desc: "/정보 실행 후 나타나는 버튼으로, 최근 7일간의 경험치 및 레벨 변동 히스토리를 확인할 수 있습니다.",
    returns: ["경험치 히스토리 (최근 7일)", "레벨 히스토리"],
  },
  {
    id: "union-hexa",
    category: "union-hexa",
    title: "헥사",
    cmd: "헥사",
    isButton: true,
    badge: "버튼",
    desc: "/정보 실행 후 나타나는 버튼으로, 헥사 코어 강화 현황과 헥사 스탯을 확인할 수 있습니다.",
    returns: ["헥사 코어 레벨", "헥사 스탯 현황"],
  },
  {
    id: "codi",
    category: "codi",
    title: "코디",
    cmd: "코디",
    isButton: true,
    badge: "버튼",
    desc: "/정보 실행 후 나타나는 버튼으로, 캐릭터가 착용 중인 코디 아이템 및 외형 정보를 조회합니다.",
    returns: ["착용 중인 캐시 아이템", "헤어 / 성형 / 피부 정보"],
  },
  {
    id: "bot-info",
    category: "bot-info",
    title: "봇 권한 및 보안 안내",
    cmd: null,
    desc: "메이플봇은 Nexon OpenAPI를 활용하여 공개된 캐릭터 정보만 조회합니다. 서비스 운영에 필요한 최소한의 권한만 요청하며, 계정 정보나 개인정보를 수집하지 않습니다.",
    returns: [
      "메시지 보기 (View Channels)",
      "메시지 보내기 (Send Messages)",
      "메시지 기록 읽기 (Read Message History)",
    ],
    note: "봇은 이용자의 비밀번호·계정 정보·개인정보를 요구하거나 저장하지 않습니다.",
  },
]

// ─── CopyButton ───────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md font-medium transition-all shrink-0"
      style={{
        background: copied ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.07)",
        color: copied ? "#4ade80" : "rgba(255,255,255,0.45)",
        border: `1px solid ${copied ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.1)"}`,
      }}>
      {copied ? <><Check size={11} />복사됨</> : <><Copy size={11} />복사</>}
    </button>
  )
}

// ─── CommandCard ──────────────────────────────────────────────────────────────
function CommandCard({ cmd }: { cmd: Command }) {
  const cat = CATEGORIES.find(c => c.id === cmd.category)!
  const CatIcon = cat.Icon
  const isBtn = !!cmd.isButton
  const accent = isBtn ? "#a855f7" : "var(--blue-light)"
  const accentBg = isBtn ? "rgba(168,85,247,0.1)" : "rgba(59,130,246,0.1)"
  const accentBorder = isBtn ? "rgba(168,85,247,0.2)" : "rgba(59,130,246,0.18)"

  return (
    <section id={cmd.id} style={{ scrollMarginTop: "84px" }}>
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>

        {/* 카드 헤더 */}
        <div className="flex flex-wrap items-center gap-3 px-6 py-5"
          style={{ background: "rgba(255,255,255,0.018)", borderBottom: "1px solid var(--border)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: accentBg, border: `1px solid ${accentBorder}` }}>
            <CatIcon size={15} style={{ color: accent }} />
          </div>
          <h2 className="flex-1 text-sm font-semibold" style={{ color: "var(--text)" }}>
            {cmd.title}
          </h2>
          {cmd.badge && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: accentBg, color: accent, border: `1px solid ${accentBorder}` }}>
              {cmd.badge}
            </span>
          )}
        </div>

        {/* 카드 본문 */}
        <div className="px-6 py-6 space-y-6">

          {/* 설명 */}
          <p className="text-sm" style={{ color: "var(--text-sub)", lineHeight: 1.85 }}>
            {cmd.desc}
          </p>

          {/* 명령어 코드 블록 */}
          {cmd.cmd && (
            <div className="flex items-center justify-between gap-4 rounded-xl px-5 py-3.5"
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderLeft: `3px solid ${accent}`,
              }}>
              <code className="text-sm font-mono" style={{ color: "#e2e8f0", letterSpacing: "0.01em" }}>
                {cmd.cmd}
              </code>
              <CopyButton text={cmd.cmd} />
            </div>
          )}

          {/* 시작 단계 */}
          {cmd.steps && (
            <div className="space-y-3">
              {cmd.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{
                      background: "rgba(59,130,246,0.12)",
                      color: "var(--blue-light)",
                      border: "1px solid rgba(59,130,246,0.25)",
                    }}>
                    {i + 1}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-sub)", lineHeight: 1.75, paddingTop: "2px" }}>
                    {step}
                  </span>
                </div>
              ))}
              <div className="pt-2">
                <Link href={DISCORD_URL} target="_blank"
                  className="btn-primary inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ padding: "10px 22px", borderRadius: "10px" }}>
                  서버에 추가하기
                  <ExternalLink size={13} />
                </Link>
              </div>
            </div>
          )}

          {/* 조회 결과 / 권한 */}
          {cmd.returns && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--text-muted)" }}>
                {cmd.id === "bot-info" ? "요청 권한" : "조회 결과"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cmd.returns.map(r => (
                  <div key={r} className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <CheckCircle2 size={13} className="shrink-0" style={{ color: accent }} />
                    <span style={{ color: "var(--text-sub)" }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 실행 후 버튼 */}
          {cmd.buttons && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--text-muted)" }}>
                실행 후 버튼
              </p>
              <div className="flex flex-wrap gap-2">
                {cmd.buttons.map(b => (
                  <span key={b} className="text-xs font-medium px-3 py-1.5 rounded-lg"
                    style={{
                      background: "rgba(168,85,247,0.08)",
                      color: "#c084fc",
                      border: "1px solid rgba(168,85,247,0.2)",
                    }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 노트 */}
          {cmd.note && (
            <div className="flex items-start gap-3 rounded-xl px-4 py-3.5"
              style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.12)" }}>
              <Info size={14} className="shrink-0 mt-0.5" style={{ color: "var(--blue-light)" }} />
              <p className="text-xs" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
                {cmd.note}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BotGuidePage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("getting-started")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cmd = COMMANDS.find(c => c.id === entry.target.id)
            if (cmd) setActiveCategory(cmd.category)
          }
        }
      },
      { rootMargin: "-15% 0px -60% 0px" }
    )
    COMMANDS.forEach(cmd => {
      const el = document.getElementById(cmd.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    setMobileOpen(false)
  }

  const activeCat = CATEGORIES.find(c => c.id === activeCategory)

  return (
    <div className="min-h-screen" style={{ paddingTop: "56px" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex" style={{ minHeight: "calc(100vh - 56px)" }}>

          {/* ── 사이드바 (데스크탑) ── */}
          <aside className="hidden md:flex flex-col shrink-0" style={{ width: "196px" }}>
            <div className="sticky py-10 pr-6" style={{ top: "56px" }}>

              <p className="text-xs font-semibold uppercase tracking-widest mb-3 px-3"
                style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                명령어 목록
              </p>

              <nav className="space-y-0.5">
                {CATEGORIES.map(cat => {
                  const firstCmd = COMMANDS.find(c => c.category === cat.id)
                  const isActive = activeCategory === cat.id
                  return (
                    <button key={cat.id}
                      onClick={() => firstCmd && scrollTo(firstCmd.id)}
                      className="group w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
                      style={{
                        color: isActive ? "var(--blue-light)" : "var(--text-sub)",
                        background: isActive ? "rgba(59,130,246,0.08)" : "transparent",
                        fontWeight: isActive ? 600 : 400,
                        borderLeft: isActive ? "2px solid var(--blue-light)" : "2px solid transparent",
                        paddingLeft: "10px",
                      }}>
                      <cat.Icon size={14} style={{ opacity: isActive ? 1 : 0.5, flexShrink: 0 }} />
                      {cat.label}
                    </button>
                  )
                })}
              </nav>

              <div className="mt-8 px-2">
                <Link href={DISCORD_URL} target="_blank"
                  className="btn-primary text-xs font-semibold w-full block text-center"
                  style={{ padding: "9px 10px", borderRadius: "8px" }}>
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

            {/* 모바일 카테고리 드롭다운 */}
            <div className="md:hidden mb-6 relative">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
                <span className="flex items-center gap-2">
                  {activeCat && <activeCat.Icon size={14} style={{ color: "var(--blue-light)" }} />}
                  <span>{activeCat?.label}</span>
                </span>
                <ChevronDown size={15} style={{
                  transform: mobileOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                  color: "var(--text-muted)",
                }} />
              </button>
              {mobileOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-30"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                  {CATEGORIES.map((cat, i) => {
                    const firstCmd = COMMANDS.find(c => c.category === cat.id)
                    const isActive = activeCategory === cat.id
                    return (
                      <button key={cat.id}
                        onClick={() => firstCmd && scrollTo(firstCmd.id)}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-3 text-sm transition-all"
                        style={{
                          color: isActive ? "var(--blue-light)" : "var(--text-sub)",
                          background: isActive ? "rgba(59,130,246,0.07)" : "transparent",
                          fontWeight: isActive ? 600 : 400,
                          borderBottom: i < CATEGORIES.length - 1 ? "1px solid var(--border)" : "none",
                        }}>
                        <cat.Icon size={14} style={{ opacity: isActive ? 1 : 0.5 }} />
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 페이지 제목 */}
            <div className="mb-10">
              <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>
                명령어 가이드
              </h1>
              <p className="text-sm" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
                메이플봇의 모든 디스코드 명령어와 기능을 안내합니다.
                데이터는 <span style={{ color: "var(--text-sub)", fontWeight: 500 }}>Nexon OpenAPI</span>를 통해 실시간으로 제공됩니다.
              </p>
            </div>

            {/* 명령어 카드 */}
            <div className="space-y-5">
              {COMMANDS.map(cmd => <CommandCard key={cmd.id} cmd={cmd} />)}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
