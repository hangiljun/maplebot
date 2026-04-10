"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Copy, Check, ChevronDown, ExternalLink } from "lucide-react"

const DISCORD_URL = "https://discord.com/oauth2/authorize?client_id=1491444296623325194&permissions=51200&integration_type=0&scope=bot"

// ─── Types ──────────────────────────────────────────────────────────────────
type Category = { id: string; label: string; icon: string }
type Command = {
  id: string
  category: string
  emoji: string
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

// ─── 데이터 (추후 명령어 추가 시 여기에만 추가하면 됩니다) ─────────────────
const CATEGORIES: Category[] = [
  { id: "getting-started", label: "시작하기",       icon: "🚀" },
  { id: "character",       label: "캐릭터 정보",    icon: "👤" },
  { id: "equipment",       label: "장비 / 능력치",  icon: "⚔️" },
  { id: "growth",          label: "성장 / 레벨",    icon: "📈" },
  { id: "union-hexa",      label: "유니온 / 헥사",  icon: "🏆" },
  { id: "codi",            label: "코디 / 외형",    icon: "👗" },
  { id: "bot-info",        label: "봇 정보",        icon: "ℹ️"  },
]

const COMMANDS: Command[] = [
  {
    id: "getting-started",
    category: "getting-started",
    emoji: "🚀",
    title: "봇 초대 및 시작",
    cmd: null,
    desc: "메이플봇을 디스코드 서버에 초대하고 바로 명령어를 사용할 수 있습니다.",
    steps: [
      "아래 '서버에 추가하기' 버튼으로 봇을 초대합니다",
      "채널에서 /정보 [닉네임] 을 입력합니다",
      "봇이 캐릭터 정보를 임베드 카드로 응답합니다",
    ],
  },
  {
    id: "character",
    category: "character",
    emoji: "🟢",
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
    emoji: "⚔️",
    title: "장비 보기",
    cmd: "장비 보기",
    isButton: true,
    badge: "버튼",
    desc: "/정보 실행 후 나타나는 버튼입니다. 본인에게만 보이는 임시 메시지로 착용 중인 장비 전체를 조회합니다.",
    returns: ["착용 장비 전체 목록", "잠재능력 및 에디셔널 잠재능력", "스타포스 강화 수치"],
  },
  {
    id: "growth",
    category: "growth",
    emoji: "📈",
    title: "레벨 변동",
    cmd: "레벨 변동",
    isButton: true,
    badge: "버튼",
    desc: "/정보 실행 후 나타나는 버튼입니다. 최근 7일간의 경험치 및 레벨 변동 히스토리를 표시합니다.",
    returns: ["경험치 히스토리 (7일)", "레벨 히스토리"],
  },
  {
    id: "union-hexa",
    category: "union-hexa",
    emoji: "🏆",
    title: "헥사",
    cmd: "헥사",
    isButton: true,
    badge: "버튼",
    desc: "/정보 실행 후 나타나는 버튼입니다. 헥사 코어 강화 현황과 헥사 스탯을 조회합니다.",
    returns: ["헥사 코어 레벨", "헥사 스탯 현황"],
  },
  {
    id: "codi",
    category: "codi",
    emoji: "👗",
    title: "코디",
    cmd: "코디",
    isButton: true,
    badge: "버튼",
    desc: "/정보 실행 후 나타나는 버튼입니다. 캐릭터의 코디 정보를 조회합니다.",
    returns: ["착용 중인 캐시 아이템", "헤어 / 성형 / 피부 정보"],
  },
  {
    id: "bot-info",
    category: "bot-info",
    emoji: "🔒",
    title: "봇 권한 및 개인정보",
    cmd: null,
    desc: "메이플봇은 서비스 운영에 필요한 최소한의 권한만 요청하며, 개인정보나 계정 정보를 요구하거나 저장하지 않습니다.",
    returns: [
      "메시지 보기 (View Channels)",
      "메시지 보내기 (Send Messages)",
      "메시지 기록 읽기 (Read Message History)",
    ],
    note: "봇은 이용자의 비밀번호·개인정보를 요구하거나 저장하지 않습니다.",
  },
]

// ─── CopyButton ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy}
      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-all font-medium shrink-0"
      style={{
        background: copied ? "rgba(34,197,94,0.1)" : "rgba(59,130,246,0.1)",
        color: copied ? "#4ade80" : "var(--blue-light)",
        border: `1px solid ${copied ? "rgba(34,197,94,0.2)" : "rgba(59,130,246,0.2)"}`,
      }}>
      {copied ? <><Check size={11} /> 복사됨</> : <><Copy size={11} /> 복사</>}
    </button>
  )
}

// ─── CommandCard ─────────────────────────────────────────────────────────────
function CommandCard({ cmd }: { cmd: Command }) {
  return (
    <section id={cmd.id} style={{ scrollMarginTop: "80px" }}>
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>

        {/* 헤더 */}
        <div className="px-6 py-4 flex flex-wrap items-center gap-3"
          style={{ background: "rgba(255,255,255,0.025)", borderBottom: "1px solid var(--border)" }}>
          <span className="text-lg leading-none">{cmd.emoji}</span>
          <h2 className="text-sm font-bold" style={{ color: "var(--text)" }}>{cmd.title}</h2>

          {/* 배지 */}
          {cmd.badge && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md"
              style={{
                background: cmd.isButton ? "rgba(168,85,247,0.12)" : "rgba(59,130,246,0.12)",
                color: cmd.isButton ? "#c084fc" : "var(--blue-light)",
                border: `1px solid ${cmd.isButton ? "rgba(168,85,247,0.25)" : "rgba(59,130,246,0.25)"}`,
              }}>
              {cmd.badge}
            </span>
          )}

          {/* 코드 블록 + 복사 */}
          {cmd.cmd && (
            <div className="ml-auto flex items-center gap-2">
              <code className="text-xs px-3 py-1.5 rounded-lg font-mono"
                style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-sub)", border: "1px solid var(--border)" }}>
                {cmd.cmd}
              </code>
              <CopyButton text={cmd.cmd} />
            </div>
          )}
        </div>

        {/* 본문 */}
        <div className="px-6 py-5 space-y-5" style={{ background: "rgba(13,17,23,0.5)" }}>

          {/* 설명 */}
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-sub)", lineHeight: 1.75 }}>
            {cmd.desc}
          </p>

          {/* 시작 단계 */}
          {cmd.steps && (
            <div className="space-y-2.5">
              {cmd.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: "rgba(59,130,246,0.15)", color: "var(--blue-light)", border: "1px solid rgba(59,130,246,0.3)" }}>
                    {i + 1}
                  </span>
                  <span style={{ color: "var(--text-sub)" }}>{step}</span>
                </div>
              ))}
              <div className="pt-1">
                <Link href={DISCORD_URL} target="_blank"
                  className="btn-primary inline-flex items-center gap-2 text-sm font-bold"
                  style={{ padding: "10px 20px", borderRadius: "10px" }}>
                  서버에 추가하기 <ExternalLink size={13} />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                {cmd.returns.map(r => (
                  <div key={r} className="flex items-start gap-2 text-sm">
                    <span className="mt-2 w-1 h-1 rounded-full shrink-0" style={{ background: "var(--blue-light)" }} />
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
                  <span key={b} className="text-xs font-semibold px-3 py-1 rounded-lg"
                    style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 노트 */}
          {cmd.note && (
            <div className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm"
              style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
              <span className="shrink-0 mt-0.5" style={{ color: "var(--blue-light)" }}>ℹ</span>
              <span style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>{cmd.note}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function BotGuidePage() {
  const [activeCategory, setActiveCategory] = useState("getting-started")
  const [mobileOpen, setMobileOpen] = useState(false)

  // 스크롤에 따라 활성 카테고리 업데이트
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
      { rootMargin: "-20% 0px -65% 0px" }
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6" style={{ minHeight: "calc(100vh - 56px)" }}>
        <div className="flex" style={{ minHeight: "inherit" }}>

          {/* ── 사이드바 (데스크탑) ── */}
          <aside className="hidden md:flex flex-col shrink-0" style={{ width: "200px" }}>
            <div className="sticky py-10 pr-6" style={{ top: "56px" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3 px-2"
                style={{ color: "var(--text-muted)" }}>
                명령어 목록
              </p>
              <nav className="space-y-0.5">
                {CATEGORIES.map(cat => {
                  const firstCmd = COMMANDS.find(c => c.category === cat.id)
                  const isActive = activeCategory === cat.id
                  return (
                    <button key={cat.id}
                      onClick={() => firstCmd && scrollTo(firstCmd.id)}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
                      style={{
                        color: isActive ? "var(--blue-light)" : "var(--text-sub)",
                        background: isActive ? "rgba(59,130,246,0.1)" : "transparent",
                        fontWeight: isActive ? 600 : 400,
                        borderLeft: isActive ? "2px solid var(--blue-light)" : "2px solid transparent",
                      }}>
                      <span className="text-base leading-none">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  )
                })}
              </nav>

              <div className="mt-8 px-2">
                <Link href={DISCORD_URL} target="_blank"
                  className="btn-primary text-xs font-bold w-full block text-center"
                  style={{ padding: "9px 10px", borderRadius: "8px" }}>
                  서버에 추가하기
                </Link>
              </div>
            </div>
          </aside>

          {/* ── 사이드바 구분선 ── */}
          <div className="hidden md:block shrink-0 self-stretch"
            style={{ width: "1px", background: "var(--border)", margin: "0" }} />

          {/* ── 메인 콘텐츠 ── */}
          <main className="flex-1 min-w-0 py-10 md:pl-10">

            {/* 모바일 드롭다운 */}
            <div className="md:hidden mb-6 relative">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
                <span className="flex items-center gap-2">
                  <span>{activeCat?.icon}</span>
                  <span>{activeCat?.label}</span>
                </span>
                <ChevronDown size={16}
                  style={{ transform: mobileOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "var(--text-muted)" }} />
              </button>
              {mobileOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-30"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                  {CATEGORIES.map((cat, i) => {
                    const firstCmd = COMMANDS.find(c => c.category === cat.id)
                    return (
                      <button key={cat.id}
                        onClick={() => firstCmd && scrollTo(firstCmd.id)}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-3 text-sm transition-all"
                        style={{
                          color: activeCategory === cat.id ? "var(--blue-light)" : "var(--text-sub)",
                          background: activeCategory === cat.id ? "rgba(59,130,246,0.08)" : "transparent",
                          borderBottom: i < CATEGORIES.length - 1 ? "1px solid var(--border)" : "none",
                          fontWeight: activeCategory === cat.id ? 600 : 400,
                        }}>
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 페이지 제목 */}
            <div className="mb-10">
              <h1 className="text-2xl font-black mb-1.5" style={{ color: "var(--text)" }}>명령어 가이드</h1>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                메이플봇의 모든 디스코드 명령어와 기능을 안내합니다
              </p>
            </div>

            {/* 명령어 카드 목록 */}
            <div className="space-y-6">
              {COMMANDS.map(cmd => <CommandCard key={cmd.id} cmd={cmd} />)}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
