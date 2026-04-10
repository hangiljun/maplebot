"use client"
import Link from "next/link"
import { useState } from "react"
import { Copy, Check } from "lucide-react"

const DISCORD_URL = "https://discord.com/oauth2/authorize?client_id=1491444296623325194&permissions=51200&integration_type=0&scope=bot"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all shrink-0 font-semibold"
      style={{ background: copied ? "rgba(34,197,94,0.12)" : "rgba(37,99,235,0.1)", color: copied ? "#4ade80" : "var(--blue-light)", border: `1px solid ${copied ? "rgba(34,197,94,0.25)" : "rgba(59,130,246,0.25)"}` }}>
      {copied ? <><Check size={12} /> 복사됨</> : <><Copy size={12} /> 복사</>}
    </button>
  )
}

const STEPS = [
  { step: "01", title: "봇 초대", desc: "아래 '서버에 추가하기' 버튼을 눌러 메이플봇을 디스코드 서버에 초대하세요." },
  { step: "02", title: "명령어 입력", desc: "채널에서 /정보 [캐릭터명] 을 입력합니다. 슬래시(/)를 입력하면 자동완성이 나타납니다." },
  { step: "03", title: "결과 확인", desc: "봇이 Nexon OpenAPI에서 캐릭터 정보를 실시간으로 조회하여 임베드 카드로 응답합니다." },
]

const BUTTONS = [
  { label: "장비 보기", desc: "캐릭터 장비 목록과 잠재능력, 스타포스 정보" },
  { label: "레벨 변동", desc: "경험치 히스토리(7일)와 레벨 히스토리 표시" },
  { label: "헥사",      desc: "헥사 코어 레벨 및 헥사 스탯 현황" },
  { label: "코디",      desc: "착용 중인 캐시 아이템 및 헤어/성형/피부 정보" },
]

const PERMISSIONS = [
  { name: "메시지 보기 (View Channels)",           reason: "봇이 명령어가 입력된 채널을 인식하기 위해 필요합니다." },
  { name: "메시지 보내기 (Send Messages)",          reason: "캐릭터 조회 결과를 채널에 전송하기 위해 필요합니다." },
  { name: "메시지 기록 읽기 (Read Message History)", reason: "슬래시 명령어 처리 및 버튼 상호작용을 위해 필요합니다." },
]

const FAQS = [
  { q: "봇이 응답하지 않아요.", a: "Nexon 서버 점검 중이거나 API 호출 한도를 초과한 경우 일시적으로 응답이 지연될 수 있습니다. 잠시 후 다시 시도해 주세요." },
  { q: "캐릭터를 찾을 수 없다고 나와요.", a: "닉네임 철자를 다시 확인해 주세요. 넥슨 공식 홈페이지에서 캐릭터 이름이 정확한지 확인 후 입력해 주세요." },
  { q: "정보가 실제와 다르게 나와요.", a: "본 서비스는 최대 1시간 캐싱을 사용합니다. 최신 정보 반영에 다소 시간이 걸릴 수 있습니다." },
  { q: "봇이 안전한가요?", a: "메이플봇은 공개된 캐릭터 정보만 조회합니다. 개인정보나 계정 정보를 요구하거나 저장하지 않습니다." },
]

function Section({ num, title, sub, children }: { num: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* 섹션 번호 라벨 */}
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black"
          style={{ background: "rgba(59,130,246,0.18)", color: "var(--blue-light)", border: "1px solid rgba(59,130,246,0.3)" }}>
          {num}
        </div>
        <div>
          <span className="text-base font-black" style={{ color: "var(--text)" }}>{title}</span>
          {sub && <span className="text-sm ml-2" style={{ color: "var(--text-muted)" }}>{sub}</span>}
        </div>
      </div>
      {/* 섹션 본문 카드 */}
      <div className="glass rounded-2xl p-7">
        {children}
      </div>
    </div>
  )
}

export default function BotGuidePage() {
  return (
    <div className="min-h-screen" style={{ paddingTop: "96px", paddingBottom: "120px" }}>
      <div className="mx-auto px-6" style={{ maxWidth: "680px" }}>

        {/* 페이지 헤더 */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-black mb-3" style={{ color: "var(--text)" }}>봇 기능 설명</h1>
          <p className="text-base" style={{ color: "var(--text-sub)" }}>
            메이플봇의 디스코드 명령어와 버튼 기능을 안내합니다
          </p>
        </div>

        {/* 섹션 목록 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

          {/* ① 시작하는 방법 */}
          <Section num="①" title="시작하는 방법">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {STEPS.map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="text-4xl font-black mb-3 leading-none"
                    style={{ color: "rgba(59,130,246,0.18)" }}>{step}</div>
                  <p className="text-sm font-bold mb-2" style={{ color: "var(--text)" }}>{title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Link href={DISCORD_URL} target="_blank"
                className="btn-primary font-bold"
                style={{ padding: "11px 28px", fontSize: "14px", borderRadius: "10px" }}>
                메이플봇 서버에 추가하기
              </Link>
            </div>
          </Section>

          {/* ② 명령어 */}
          <Section num="②" title="명령어" sub="슬래시(/) 명령어로 바로 사용 가능합니다">
            <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-3 mb-4">
                <code className="text-sm px-3 py-1.5 rounded-lg font-mono font-bold"
                  style={{ background: "rgba(37,99,235,0.1)", color: "var(--blue-light)", border: "1px solid rgba(59,130,246,0.2)" }}>
                  /정보 [캐릭터명]
                </code>
                <p className="text-sm flex-1" style={{ color: "var(--text-sub)" }}>캐릭터 기본 정보를 조회합니다</p>
                <CopyButton text="/정보 " />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {["레벨 및 직업", "전투력", "유니온 등급/레벨", "인기도"].map(d => (
                  <div key={d} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-sub)" }}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--blue-light)" }} />
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ③ 조회 후 버튼 */}
          <Section num="③" title="조회 후 버튼" sub="/정보 실행 후 본인에게만 표시되는 버튼들">
            <div className="space-y-2.5">
              {BUTTONS.map(b => (
                <div key={b.label} className="flex items-center gap-4 rounded-xl px-4 py-3.5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
                  <span className="text-xs font-bold shrink-0 px-3 py-1 rounded-md"
                    style={{ background: "rgba(59,130,246,0.1)", color: "var(--blue-light)", border: "1px solid rgba(59,130,246,0.2)", minWidth: "72px", textAlign: "center" }}>
                    {b.label}
                  </span>
                  <p className="text-sm" style={{ color: "var(--text-sub)" }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ④ 봇 권한 안내 */}
          <Section num="④" title="봇 권한 안내" sub="최소한의 권한만 요청합니다">
            <div className="space-y-2.5">
              {PERMISSIONS.map(p => (
                <div key={p.name} className="rounded-xl px-4 py-3.5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
                  <p className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>{p.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.reason}</p>
                </div>
              ))}
            </div>
            <p className="text-xs mt-4 text-center" style={{ color: "var(--text-muted)" }}>
              봇은 이용자의 비밀번호·개인정보를 요구하거나 저장하지 않습니다.
            </p>
          </Section>

          {/* ⑤ 자주 묻는 질문 */}
          <Section num="⑤" title="자주 묻는 질문">
            <div className="space-y-3">
              {FAQS.map(({ q, a }) => (
                <div key={q} className="rounded-xl px-4 py-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
                  <p className="text-sm font-bold mb-1.5" style={{ color: "var(--text)" }}>Q. {q}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-sub)" }}>A. {a}</p>
                </div>
              ))}
            </div>
          </Section>

        </div>
      </div>
    </div>
  )
}
