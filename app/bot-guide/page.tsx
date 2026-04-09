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
      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all shrink-0"
      style={{ background: copied ? "rgba(34,197,94,0.1)" : "rgba(37,99,235,0.08)", color: copied ? "#16a34a" : "var(--blue)", border: `1px solid ${copied ? "rgba(34,197,94,0.2)" : "rgba(37,99,235,0.2)"}` }}>
      {copied ? <><Check size={11} /> 복사됨</> : <><Copy size={11} /> 복사</>}
    </button>
  )
}

const COMMANDS = [
  {
    cmd: "/정보 [캐릭터명]",
    desc: "캐릭터 기본 정보를 조회합니다",
    details: ["레벨 및 직업", "전투력", "유니온 등급/레벨", "인기도"],
  },
]

const BUTTONS = [
  { label: "장비 보기",  desc: "캐릭터 장비 목록과 잠재능력, 스타포스 정보" },
  { label: "레벨 변동",  desc: "경험치 히스토리(7일)와 레벨 히스토리 표시" },
  { label: "헥사",       desc: "헥사 코어 레벨 및 헥사 스탯 현황" },
  { label: "코디",       desc: "착용 중인 캐시 아이템 및 헤어/성형/피부 정보" },
]

const PERMISSIONS = [
  { name: "메시지 보기 (View Channels)", reason: "봇이 명령어가 입력된 채널을 인식하기 위해 필요합니다." },
  { name: "메시지 보내기 (Send Messages)", reason: "캐릭터 조회 결과를 채널에 전송하기 위해 필요합니다." },
  { name: "메시지 기록 읽기 (Read Message History)", reason: "슬래시 명령어 처리 및 버튼 상호작용을 위해 필요합니다." },
]

const STEPS = [
  {
    step: "01",
    title: "봇 초대",
    desc: "아래 '서버에 추가하기' 버튼을 눌러 메이플봇을 디스코드 서버에 초대하세요.",
  },
  {
    step: "02",
    title: "명령어 입력",
    desc: "채널에서 /정보 [캐릭터명] 을 입력합니다. 슬래시(/)를 입력하면 자동완성이 나타납니다.",
  },
  {
    step: "03",
    title: "결과 확인",
    desc: "봇이 Nexon OpenAPI에서 캐릭터 정보를 실시간으로 조회하여 임베드 카드로 응답합니다.",
  },
]

export default function BotGuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pb-20" style={{ paddingTop: "80px" }}>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-3" style={{ color: "var(--text)" }}>봇 기능 설명</h1>
        <p className="text-sm" style={{ color: "var(--text-sub)" }}>
          메이플봇의 디스코드 명령어와 버튼 기능을 안내합니다
        </p>
      </div>

      <div className="space-y-5">

        {/* Step-by-step 가이드 */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-bold mb-5" style={{ color: "var(--text)" }}>시작하는 방법</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="text-3xl font-black mb-2 leading-none" style={{ color: "rgba(37,99,235,0.15)" }}>
                  {step}
                </div>
                <p className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
          <Link href={DISCORD_URL} target="_blank" className="btn-primary px-6 py-2.5 text-sm inline-block">
            메이플봇 서버에 추가하기
          </Link>
        </div>

        {/* 명령어 */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-bold mb-4" style={{ color: "var(--text)" }}>명령어</h2>
          {COMMANDS.map(c => (
            <div key={c.cmd}>
              <div className="flex items-start gap-3 mb-3">
                <code className="text-sm px-3 py-1.5 rounded-lg font-mono shrink-0"
                  style={{ background: "rgba(37,99,235,0.08)", color: "var(--blue)", border: "1px solid rgba(37,99,235,0.15)" }}>
                  {c.cmd}
                </code>
                <p className="text-sm pt-1 flex-1" style={{ color: "var(--text-sub)" }}>{c.desc}</p>
                <CopyButton text="/정보 " />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {c.details.map(d => (
                  <div key={d} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                    <div className="w-1 h-1 rounded-full shrink-0" style={{ background: "var(--blue)" }} />
                    {d}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 조회 후 버튼 */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-bold mb-1" style={{ color: "var(--text)" }}>조회 후 버튼</h2>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            /정보 명령어 실행 후 나타나는 버튼들입니다 (본인에게만 표시)
          </p>
          <div className="space-y-3">
            {BUTTONS.map(b => (
              <div key={b.label} className="flex items-start gap-3 py-2"
                style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="text-sm font-semibold shrink-0 pt-0.5" style={{ color: "var(--blue)", minWidth: "80px" }}>
                  {b.label}
                </span>
                <p className="text-sm" style={{ color: "var(--text-sub)" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 요구 권한 */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-bold mb-1" style={{ color: "var(--text)" }}>봇 권한 안내</h2>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            메이플봇은 서비스 운영에 필요한 최소한의 권한만 요청합니다.
          </p>
          <div className="space-y-3">
            {PERMISSIONS.map(p => (
              <div key={p.name} className="rounded-xl px-4 py-3"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <p className="text-xs font-bold mb-0.5" style={{ color: "var(--text)" }}>{p.name}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.reason}</p>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
            봇은 이용자의 비밀번호·개인정보를 요구하거나 저장하지 않습니다.
            공개된 캐릭터 정보만 Nexon OpenAPI를 통해 조회합니다.
          </p>
        </div>

        {/* FAQ */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-bold mb-4" style={{ color: "var(--text)" }}>자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              { q: "봇이 응답하지 않아요.", a: "Nexon 서버 점검 중이거나 API 호출 한도를 초과한 경우 일시적으로 응답이 지연될 수 있습니다. 잠시 후 다시 시도해 주세요." },
              { q: "캐릭터를 찾을 수 없다고 나와요.", a: "닉네임 철자를 다시 확인해 주세요. 넥슨 공식 홈페이지에서 캐릭터 이름이 정확한지 확인 후 입력해 주세요." },
              { q: "정보가 실제와 다르게 나와요.", a: "본 서비스는 최대 1시간 캐싱을 사용합니다. 최신 정보 반영에 다소 시간이 걸릴 수 있습니다." },
              { q: "봇이 안전한가요?", a: "메이플봇은 공개된 캐릭터 정보만 조회합니다. 개인정보나 계정 정보를 요구하거나 저장하지 않습니다." },
            ].map(({ q, a }) => (
              <div key={q}>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>Q. {q}</p>
                <p className="text-sm" style={{ color: "var(--text-sub)" }}>A. {a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
