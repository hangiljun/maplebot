const UPDATES = [
  {
    version: "v1.3",
    date: "2025.04.09",
    tag: "기능 추가",
    items: [
      "디스코드 봇 코디 버튼 추가 (착용 중인 캐시 아이템, 헤어/성형/피부)",
      "Nexon API 2번째 키 폴백 지원으로 안정성 향상",
      "ocid 캐싱으로 API 호출 최적화",
    ],
  },
  {
    version: "v1.2",
    date: "2025.04.08",
    tag: "기능 추가",
    items: [
      "디스코드 봇 헥사 버튼 추가 (코어 레벨, 헥사 스탯)",
      "레벨 변동 버튼 추가 (경험치 7일, 레벨 히스토리)",
      "웹 다크 테마 전면 개편",
    ],
  },
  {
    version: "v1.1",
    date: "2025.04.07",
    tag: "개선",
    items: [
      "429 rate limit 재시도 로직 추가",
      "캐릭터 카드 UI 개선",
      "심볼, 코디, 레벨 탭 데이터 수정",
    ],
  },
  {
    version: "v1.0",
    date: "2025.04.06",
    tag: "출시",
    items: [
      "메이플봇 웹사이트 및 디스코드 봇 최초 출시",
      "/정보 명령어로 캐릭터 기본 정보 조회",
      "장비, 어빌리티, 유니온, 심볼, 헥사, 코디 탭",
    ],
  },
]

const TAG_STYLE: Record<string, { bg: string; color: string }> = {
  "기능 추가": { bg: "rgba(34,197,94,0.15)",  color: "#4ade80" },
  "개선":      { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa" },
  "수정":      { bg: "rgba(239,68,68,0.15)",   color: "#f87171" },
  "출시":      { bg: "rgba(168,85,247,0.15)",  color: "#c084fc" },
}

export default function UpdatesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pb-20" style={{ paddingTop: "80px" }}>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-black text-white mb-3">업데이트 내용</h1>
        <p className="text-sm" style={{ color: "var(--text-sub)" }}>
          메이플봇의 업데이트 이력을 확인하세요
        </p>
      </div>

      <div className="space-y-4">
        {UPDATES.map((u) => {
          const style = TAG_STYLE[u.tag] ?? TAG_STYLE["개선"]
          return (
            <div key={u.version} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-black text-white text-lg">{u.version}</span>
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: style.bg, color: style.color }}>
                  {u.tag}
                </span>
                <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>{u.date}</span>
              </div>
              <ul className="space-y-2">
                {u.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm"
                    style={{ color: "var(--text-sub)" }}>
                    <div className="w-1 h-1 rounded-full mt-2 shrink-0"
                      style={{ background: style.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
