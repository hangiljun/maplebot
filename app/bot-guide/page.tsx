import Link from "next/link"

const DISCORD_URL = "https://discord.com/oauth2/authorize?client_id=1491444296623325194&permissions=51200&integration_type=0&scope=bot"

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

const FEATURES = [
  { label: "캐릭터 정보", desc: "레벨, 직업, 서버, 길드, 전투력, 인기도, 유니온 등급" },
  { label: "장비 조회",   desc: "잠재능력 등급별 색상 표시, 스타포스, 각 슬롯 아이템" },
  { label: "레벨 변동",   desc: "최근 7일 경험치 및 30일 레벨 변동 히스토리" },
  { label: "헥사 매트릭스", desc: "헥사 코어 종류/레벨, 헥사 스탯 슬롯별 현황" },
  { label: "코디 정보",   desc: "헤어, 성형, 피부, 현재 착용 중인 캐시 아이템" },
]

export default function BotGuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pb-20" style={{ paddingTop: "80px" }}>

      {/* 헤더 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black text-white mb-3">봇 기능 설명</h1>
        <p className="text-sm" style={{ color: "var(--text-sub)" }}>
          메이플봇의 디스코드 명령어와 버튼 기능을 안내합니다
        </p>
      </div>

      <div className="space-y-6">

        {/* 봇 추가 */}
        <div className="glass rounded-2xl p-6"
          style={{ border: "1px solid rgba(59,130,246,0.25)", background: "rgba(37,99,235,0.08)" }}>
          <h2 className="text-base font-bold text-white mb-3">봇 추가 방법</h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-sub)" }}>
            아래 버튼을 눌러 디스코드 서버에 메이플봇을 추가하세요.
            추가 후 /정보 명령어를 입력하면 바로 사용할 수 있습니다.
          </p>
          <Link href={DISCORD_URL} target="_blank" className="btn-primary px-6 py-2.5 text-sm inline-block">
            메이플봇 서버에 추가하기
          </Link>
        </div>

        {/* 명령어 */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">명령어</h2>
          {COMMANDS.map(c => (
            <div key={c.cmd}>
              <div className="flex items-start gap-3 mb-3">
                <code className="text-sm px-3 py-1.5 rounded-lg font-mono shrink-0"
                  style={{ background: "rgba(59,130,246,0.15)", color: "var(--blue-light)", border: "1px solid rgba(59,130,246,0.2)" }}>
                  {c.cmd}
                </code>
                <p className="text-sm pt-1" style={{ color: "var(--text-sub)" }}>{c.desc}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {c.details.map(d => (
                  <div key={d} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--blue)" }} />
                    {d}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 버튼 */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-1">조회 후 버튼</h2>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            /정보 명령어 실행 후 나타나는 버튼들입니다 (본인에게만 표시)
          </p>
          <div className="space-y-3">
            {BUTTONS.map(b => (
              <div key={b.label} className="flex items-start gap-3 py-2"
                style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="text-sm font-semibold shrink-0 pt-0.5" style={{ color: "var(--blue-light)", minWidth: "80px" }}>
                  {b.label}
                </span>
                <p className="text-sm" style={{ color: "var(--text-sub)" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 제공 기능 전체 */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">제공 정보 목록</h2>
          <div className="space-y-3">
            {FEATURES.map(f => (
              <div key={f.label} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #60a5fa)" }} />
                <div>
                  <p className="text-sm font-semibold text-white">{f.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
