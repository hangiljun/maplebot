"use client"
import Link from "next/link"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { DiscordMockup, CmdKey } from "./components/DiscordMockup"

const DISCORD_URL = "https://discord.com/oauth2/authorize?client_id=1491444296623325194&permissions=51200&integration_type=0&scope=bot"

const CMDS: { cmd: CmdKey; desc: string }[] = [
  { cmd: "/정보",    desc: "레벨, 직업, 전투력, 유니온 + 버튼" },
  { cmd: "/유니온",  desc: "등급, 레벨, 아티팩트 현황" },
  { cmd: "/부캐조회", desc: "부캐릭터 일괄 조회 (예정)" },
]

const FEATURES = [
  { label: "실시간 조회",   desc: "Nexon OpenAPI 직통 연결, 최신 스펙 반영" },
  { label: "7개 탭 지원",  desc: "스탯·장비·어빌리티·유니온·심볼·헥사·코디" },
  { label: "듀얼 API 키",  desc: "429 에러 자동 폴백으로 안정적 서비스 유지" },
  { label: "ocid 캐싱",    desc: "1시간 인메모리 캐싱으로 반복 요청 최적화" },
  { label: "디스코드 봇",  desc: "슬래시 명령어로 서버 내 즉시 캐릭터 조회" },
  { label: "웹 + 봇 연동", desc: "동일 API 기반, 일관된 데이터 품질 보장" },
]

const RECENT_UPDATES = [
  { date: "2026.04.09", text: "UI 전면 리뉴얼 — 사용자 경험 개선을 위한 인터페이스 최적화" },
  { date: "2026.04.09", text: "개인정보처리방침 신설, 봇 권한 안내 추가" },
  { date: "2026.04.01", text: "헥사·코디 버튼 추가, API 이중화 적용" },
  { date: "2026.03.25", text: "Nexon API 429 자동 폴백 및 ocid 캐싱" },
]

export default function HomePage() {
  const [activeCmd, setActiveCmd] = useState<CmdKey>("/정보")
  const inputRef = useRef<HTMLInputElement>(null)
  const router   = useRouter()

  const go = () => {
    const t = (inputRef.current?.value ?? "").trim()
    if (!t) return
    router.push(`/character/${encodeURIComponent(t)}`)
  }

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* 히어로 */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px]"
            style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 65%)", transform: "translateX(-30%)" }} />
          <div className="absolute bottom-0 right-0 w-96 h-96"
            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
        </div>

        <div className="section-container w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-20 pb-16">

          {/* 왼쪽: 텍스트 + 검색창 */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="font-black leading-tight tracking-tight mb-4"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "var(--text)" }}>
              정확한 데이터,<br />
              <span style={{ color: "var(--blue-light)" }}>압도적인 속도.</span>
            </h1>

            {/* 3번: 서브 텍스트 변경 */}
            <p className="text-base font-medium mb-8" style={{ color: "var(--text-sub)" }}>
              당신의 진짜 스펙을 빠르고 정확하게 보여드립니다.
            </p>

            {/* 6번: 검색창 개선 */}
            <form onSubmit={(e) => { e.preventDefault(); go() }}
              className="flex items-center rounded-2xl overflow-hidden mx-auto lg:mx-0"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                maxWidth: "560px",
                height: "64px",
              }}>
              <Search size={20} className="ml-5 shrink-0" style={{ color: "var(--text-muted)" }} />
              <input
                ref={inputRef}
                type="text"
                placeholder="캐릭터 닉네임을 입력하세요 (예: 메이플봇)"
                autoFocus
                className="flex-1 px-4 bg-transparent focus:outline-none placeholder:text-white/30 text-sm"
                style={{ color: "var(--text)", height: "100%" }}
              />
              <button type="submit" className="btn-primary shrink-0 font-bold rounded-xl"
                style={{ margin: "8px", padding: "0 24px", height: "48px", fontSize: "14px" }}>
                검색
              </button>
            </form>
          </div>

          {/* 오른쪽: 예시 카드 + 4번: 버튼을 카드 하단으로 이동 */}
          <div className="shrink-0 flex flex-col items-center gap-5">
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: "-30px", borderRadius: "32px", background: "radial-gradient(ellipse, rgba(88,101,242,0.3) 0%, transparent 70%)", filter: "blur(30px)" }} />
              <div style={{ position: "relative", transform: "perspective(1200px) rotateY(-10deg) rotateX(4deg)", filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))" }}>
                <DiscordMockup cmd="/정보" />
              </div>
            </div>

            {/* 4번: 버튼 위치 — 카드 하단 */}
            <Link href={DISCORD_URL} target="_blank" className="btn-primary font-bold"
              style={{ padding: "13px 28px", fontSize: "14px", borderRadius: "14px" }}>
              메이플봇 서버에 추가하기
            </Link>
          </div>
        </div>
      </section>

      {/* 명령어 인터랙티브 프리뷰 */}
      <section className="py-20">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: "var(--text)" }}>봇을 미리 체험하세요</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>명령어를 클릭하면 실제 출력 결과를 확인할 수 있어요</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
            <div className="w-full md:w-56 flex flex-col gap-3 shrink-0">
              {CMDS.map(({ cmd, desc }) => (
                <button key={cmd} onClick={() => setActiveCmd(cmd)}
                  className="w-full text-left px-4 py-4 rounded-xl transition-all card-hover"
                  style={{ background: activeCmd === cmd ? "rgba(59,130,246,0.1)" : "var(--bg-card)", border: `1px solid ${activeCmd === cmd ? "rgba(59,130,246,0.4)" : "var(--border)"}` }}>
                  <p className="text-sm font-bold font-mono mb-1" style={{ color: activeCmd === cmd ? "var(--blue-light)" : "var(--text)" }}>{cmd}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
                </button>
              ))}
            </div>
            <div style={{ transform: "perspective(1000px) rotateY(-5deg)", transition: "all 0.3s ease", filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.4))" }}>
              <DiscordMockup cmd={activeCmd} />
            </div>
          </div>
        </div>
      </section>

      {/* 기능 소개 */}
      <section style={{ paddingTop: "160px", paddingBottom: "80px" }}>
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: "var(--text)" }}>제공 기능</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Nexon OpenAPI를 기반으로 다양한 캐릭터 정보를 제공합니다</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.label} className="glass rounded-2xl p-6 card-hover cursor-default" style={{ border: "1px solid var(--border)" }}>
                <div className="w-2 h-2 rounded-full mb-4" style={{ background: "linear-gradient(135deg, #1d4ed8, #60a5fa)" }} />
                <p className="font-bold text-sm mb-1.5" style={{ color: "var(--text)" }}>{f.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 최근 업데이트 */}
      <section style={{ paddingTop: "80px", paddingBottom: "160px" }}>
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: "var(--text)" }}>최근 업데이트</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>메이플봇의 최신 기능 추가 및 개선 내역을 확인하세요</p>
          </div>
          <div className="glass rounded-2xl" style={{ border: "1px solid var(--border)" }}>
            {RECENT_UPDATES.map((u, i) => (
              <div key={i} className="flex items-start gap-5 px-8 py-5"
                style={{ borderBottom: i < RECENT_UPDATES.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span className="text-xs font-mono tabular-nums shrink-0 mt-0.5 w-24" style={{ color: "var(--blue-light)" }}>{u.date}</span>
                <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: "var(--blue-light)" }} />
                <span className="text-sm leading-relaxed" style={{ color: "var(--text-sub)" }}>{u.text}</span>
              </div>
            ))}
            <div className="flex justify-end px-8 py-4" style={{ borderTop: "1px solid var(--border)" }}>
              <Link href="/updates" className="text-xs font-semibold hover:underline" style={{ color: "var(--blue-light)" }}>
                전체 업데이트 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingTop: "80px", paddingBottom: "80px" }}>
        <div className="section-container flex justify-center">
          <div className="p-12 text-center w-full max-w-3xl">
            <h2 className="text-3xl font-black mb-3 text-white">지금 바로 시작하세요</h2>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.65)" }}>
              디스코드 서버에 메이플봇을 추가하고<br />
              /정보 명령어로 캐릭터를 조회하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={DISCORD_URL} target="_blank" className="btn-primary px-8 py-3.5 text-sm">메이플봇 서버에 추가하기</Link>
              <Link href="/bot-guide" className="btn-outline px-8 py-3.5 text-sm">사용 방법 보기</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
