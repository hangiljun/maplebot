"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronDown, ExternalLink, Zap, Terminal, Layers, Lock, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react"
import { DISCORD_URL, M, SECTIONS, FEATURES } from "./data"
import { CopyButton, SectionHeading, DiscordEmbed, FeatureCard, InfoIcon } from "./components"

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
      <div className="section-container">
        <div className="flex">

          {/* 사이드바 */}
          <aside className="hidden md:block shrink-0" style={{ width: "200px", position: "sticky", top: "56px", alignSelf: "flex-start", maxHeight: "calc(100vh - 56px)", overflowY: "auto" }}>
            <div className="py-10 pr-6">
              <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "10px", paddingLeft: "10px" }}>목차</p>
              <nav className="space-y-0.5">
                {SECTIONS.map(sec => {
                  const isActive = active === sec.id
                  return (
                    <button key={sec.id} onClick={() => scrollTo(sec.id)}
                      className="w-full text-left flex items-center gap-2.5 transition-all"
                      style={{ fontSize: "14px", padding: "8px 12px 8px 10px", borderRadius: "6px", color: isActive ? M.orange : "var(--text-sub)", background: isActive ? "rgba(245,131,46,0.08)" : "transparent", fontWeight: isActive ? 600 : 400, borderLeft: isActive ? `2px solid ${M.orange}` : "2px solid transparent" }}>
                      <sec.Icon size={14} style={{ opacity: isActive ? 1 : 0.5, flexShrink: 0 }} />
                      {sec.label}
                    </button>
                  )
                })}
              </nav>
              <div className="mt-8 px-2">
                <Link href={DISCORD_URL} target="_blank" className="block w-full text-center font-bold text-white"
                  style={{ fontSize: "13px", padding: "10px 12px", borderRadius: "6px", background: `linear-gradient(135deg, ${M.red}, ${M.orange})`, boxShadow: "0 2px 14px rgba(232,64,64,0.25)" }}>
                  서버에 추가하기
                </Link>
              </div>
            </div>
          </aside>

          <div className="hidden md:block shrink-0 self-stretch" style={{ width: "1px", background: "var(--border)" }} />

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
                      style={{ fontSize: "14px", color: active === sec.id ? M.orange : "var(--text-sub)", background: active === sec.id ? "rgba(245,131,46,0.07)" : "transparent", fontWeight: active === sec.id ? 600 : 400, borderBottom: i < SECTIONS.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <sec.Icon size={14} style={{ opacity: active === sec.id ? 1 : 0.5 }} />
                      {sec.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hero */}
            <div className="relative overflow-hidden mb-14 px-8 py-10"
              style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 65% 55% at 95% -5%, rgba(232,64,64,0.09) 0%, transparent 65%), radial-gradient(ellipse 45% 35% at 0% 110%, rgba(245,131,46,0.06) 0%, transparent 60%)` }} />
              <div className="relative">
                <div className="inline-flex items-center gap-1.5 mb-5"
                  style={{ fontSize: "12px", fontWeight: 600, padding: "5px 12px", borderRadius: "4px", background: "rgba(245,131,46,0.1)", color: M.orange, border: "1px solid rgba(245,131,46,0.22)" }}>
                  <Zap size={11} /> 메이플스토리 디스코드 봇
                </div>
                <h1 className="font-black mb-4" style={{ fontSize: "clamp(2.2rem, 5vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.12, color: "var(--text)" }}>명령어 가이드</h1>
                <p className="mb-8" style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.78, maxWidth: "460px" }}>
                  메이플봇의 모든 디스코드 명령어와 기능을 안내합니다.
                  데이터는&nbsp;<strong style={{ color: "var(--text-sub)", fontWeight: 600 }}>Nexon OpenAPI</strong>를 통해 실시간 제공됩니다.
                </p>
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <Link href={DISCORD_URL} target="_blank" className="inline-flex items-center gap-2 font-bold text-white"
                    style={{ fontSize: "15px", padding: "12px 24px", borderRadius: "8px", background: `linear-gradient(135deg, ${M.red}, ${M.orange})`, boxShadow: "0 4px 20px rgba(232,64,64,0.32)" }}>
                    서버에 추가하기 <ExternalLink size={14} />
                  </Link>
                  <Link href="/character" className="inline-flex items-center gap-1.5 font-medium"
                    style={{ fontSize: "15px", color: "var(--text-sub)", padding: "12px 20px", borderRadius: "8px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)" }}>
                    캐릭터 조회 <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {[{ v: "실시간", l: "데이터 조회" }, { v: "무료", l: "서버 추가 비용 없음" }, { v: "1시간", l: "최대 캐싱 주기" }].map(s => (
                    <div key={s.v} className="flex items-center gap-1.5" style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      <CheckCircle2 size={13} style={{ color: M.orange, flexShrink: 0 }} />
                      <strong style={{ color: "var(--text-sub)", fontWeight: 600 }}>{s.v}</strong>&nbsp;{s.l}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 01 시작하기 */}
            <section id="start" style={{ scrollMarginTop: "84px", marginBottom: "64px" }}>
              <SectionHeading num="01" Icon={Zap} title="봇 서버 추가 방법" sub="별도의 설정 없이 봇을 초대하는 즉시 명령어를 사용할 수 있습니다." />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { n: "1", t: "봇 초대 링크 클릭",  d: "이 페이지 상단 또는 사이드바의 '서버에 추가하기' 버튼을 클릭합니다." },
                  { n: "2", t: "서버 선택 및 권한 허용", d: "Discord 팝업에서 봇을 추가할 서버를 선택하고 요청 권한을 확인 후 승인합니다." },
                  { n: "3", t: "명령어 즉시 사용",   d: "추가 설정 없이 채널에 /정보 [닉네임] 을 입력하면 바로 사용 가능합니다." },
                ].map((s, i) => (
                  <div key={s.n} className="relative p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                    {i < 2 && <ArrowRight size={14} className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10" style={{ color: "rgba(245,131,46,0.35)" }} />}
                    <div className="font-black mb-4 leading-none select-none" style={{ fontSize: "3rem", color: "rgba(245,131,46,0.12)" }}>{s.n}</div>
                    <p className="font-semibold mb-2" style={{ fontSize: "1.1rem", color: "var(--text)" }}>{s.t}</p>
                    <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.75 }}>{s.d}</p>
                  </div>
                ))}
              </div>
              {/* 추가 안내 */}
              <div className="flex items-start gap-3 px-5 py-4"
                style={{ background: "rgba(245,131,46,0.05)", border: "1px solid rgba(245,131,46,0.18)", borderRadius: "8px" }}>
                <InfoIcon size={15} className="shrink-0 mt-0.5" style={{ color: M.orange }} />
                <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.75 }}>
                  <strong style={{ color: "var(--text-sub)" }}>관리자 권한이 있는 서버</strong>에만 봇을 추가할 수 있습니다.
                  추가 후 봇에게 채널 읽기·쓰기 권한이 있는지 확인해주세요.
                  봇이 응답하지 않으면 해당 채널의 권한 설정을 확인해보세요.
                </div>
              </div>
            </section>

            {/* 02 명령어 */}
            <section id="command" style={{ scrollMarginTop: "84px", marginBottom: "64px" }}>
              <SectionHeading num="02" Icon={Terminal} title="명령어" sub="현재 슬래시(/) 명령어 1개가 지원됩니다." />
              <div className="space-y-5">
                <div style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                  <div className="flex flex-wrap items-center gap-3 px-6 py-4" style={{ background: "rgba(255,255,255,0.018)", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "4px", background: "rgba(59,130,246,0.12)", color: "var(--blue-light)", border: "1px solid rgba(59,130,246,0.22)" }}>슬래시 명령어</span>
                    <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>캐릭터 기본 정보 조회</span>
                  </div>
                  <div className="px-6 py-6 space-y-6">
                    <p style={{ fontSize: "1.05rem", color: "var(--text-sub)", lineHeight: 1.85 }}>
                      캐릭터 이름을 입력하면 기본 정보를 실시간으로 조회합니다. 슬래시(/)를 입력하면 자동완성 목록이 나타납니다.
                    </p>
                    <div>
                      <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "10px" }}>명령어 구문</p>
                      <div className="flex items-center justify-between px-5 py-4"
                        style={{ background: "rgba(0,0,0,0.32)", border: "1px solid rgba(255,255,255,0.07)", borderLeft: "3px solid var(--blue-light)", borderRadius: "6px" }}>
                        <code style={{ fontSize: "1.2rem", color: "#e2e8f0", letterSpacing: "0.02em", fontFamily: "monospace" }}>/정보 [캐릭터명]</code>
                        <CopyButton text="/정보 " light />
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "12px" }}>조회 결과</p>
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
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "10px" }}>실제 응답 예시</p>
                  <DiscordEmbed />
                </div>
                {/* 응답 임베드 항목 설명 */}
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "12px" }}>응답 카드 항목 설명</p>
                  <div className="space-y-2">
                    {[
                      { field: "캐릭터명",  desc: "조회한 메이플스토리 캐릭터의 닉네임입니다." },
                      { field: "직업",      desc: "캐릭터의 직업명입니다. (예: 패스파인더, 아크, 일리움)" },
                      { field: "서버",      desc: "캐릭터가 속한 메이플스토리 월드입니다. (예: 리부트, 스카니아, 베라)" },
                      { field: "레벨",      desc: "캐릭터의 현재 레벨입니다." },
                      { field: "전투력",    desc: "캐릭터의 총 전투력 수치입니다. 장비·스탯·링크·유니온이 모두 반영됩니다." },
                      { field: "유니온",    desc: "유니온 등급과 총 유니온 레벨입니다. (예: 레전드 · Lv.9,000)" },
                      { field: "인기도",    desc: "다른 유저에게 받은 인기도 수치입니다." },
                    ].map(({ field, desc }) => (
                      <div key={field} className="flex items-start gap-4 px-4 py-3"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                        <span className="shrink-0 font-bold" style={{ fontSize: "13px", color: "var(--blue-light)", minWidth: "56px" }}>{field}</span>
                        <span style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 03 버튼 기능 */}
            <section id="features" style={{ scrollMarginTop: "84px", marginBottom: "64px" }}>
              <SectionHeading num="03" Icon={Layers} title="버튼 기능"
                sub="/정보 응답 카드 하단에 버튼이 표시됩니다. 버튼을 누르면 해당 정보가 본인에게만 보이는 비공개 메시지로 전송됩니다." />
              {/* 버튼 동작 안내 */}
              <div className="flex items-start gap-3 px-5 py-4 mb-6"
                style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: "8px" }}>
                <InfoIcon size={15} className="shrink-0 mt-0.5" style={{ color: "var(--blue-light)" }} />
                <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.75 }}>
                  버튼을 클릭하면 해당 정보가 <strong style={{ color: "var(--text-sub)" }}>나에게만 보이는 임시 메시지</strong>로 전송됩니다.
                  채널에는 공개되지 않으므로 다른 유저에게 노출되지 않습니다.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FEATURES.map(f => <FeatureCard key={f.label} f={f} />)}
              </div>
            </section>

            {/* 04 권한 / 보안 */}
            <section id="permissions" style={{ scrollMarginTop: "84px", marginBottom: "40px" }}>
              <SectionHeading num="04" Icon={Lock} title="권한 및 보안 안내" />
              <div className="space-y-4">
                <div className="p-5" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.22)", borderRadius: "8px" }}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={17} className="shrink-0 mt-0.5" style={{ color: M.gold }} />
                    <div>
                      <p style={{ fontSize: "1rem", fontWeight: 600, color: M.gold, marginBottom: "6px" }}>개인정보 안전 안내</p>
                      <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.78 }}>
                        메이플봇은 공개된 캐릭터 정보만 조회합니다. 이용자의 비밀번호·계정 정보·개인정보를 요구하거나 저장하지 않습니다.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "12px" }}>요청 권한 (최소한만 요청)</p>
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
