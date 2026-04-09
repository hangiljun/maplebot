const UPDATES = [
  {
    version: "v1.4",
    date: "2026.04.09",
    tag: "기능 추가",
    items: [
      "흰색/파란색 테마 전면 개편 — 넥슨 서비스 심사 대응 UI 리뉴얼",
      "개인정보처리방침 페이지 신설 (최소 권한 원칙 명문화)",
      "캐릭터 검색 입력값 검증(Validation) 적용 — 특수문자 자동 필터링",
      "봇 가이드 단계별 튜토리얼 및 권한 안내 섹션 추가",
      "메인 페이지 디스코드 목업 — HTML/CSS 인터랙티브 프리뷰로 대체",
      "공유 푸터 컴포넌트 분리 및 넥슨 저작권 고지 문구 가이드라인 준수",
    ],
  },
  {
    version: "v1.3",
    date: "2025.04.09",
    tag: "기능 추가",
    items: [
      "디스코드 봇 코디 버튼 추가 (착용 중인 캐시 아이템, 헤어/성형/피부)",
      "Nexon API 이중화 — NEXON_API_KEY_2 429 폴백 적용으로 가용성 향상",
      "ocid 1시간 인메모리 캐싱 적용 — API 일일 호출량 최적화",
    ],
  },
  {
    version: "v1.2",
    date: "2025.04.08",
    tag: "기능 추가",
    items: [
      "디스코드 봇 헥사 버튼 추가 (코어 레벨, 헥사 스탯)",
      "레벨 변동 버튼 추가 (경험치 7일 히스토리, 레벨 변동 이력)",
      "API 배치 호출 로직 분리(batch1/2/3) — rate limit 회피 및 응답 안정성 개선",
      "웹 다크 테마 전면 개편",
    ],
  },
  {
    version: "v1.1",
    date: "2025.04.07",
    tag: "개선",
    items: [
      "Nexon API 429 rate limit 자동 재시도 로직 추가",
      "캐릭터 카드 UI 개선 — 정보 밀도 및 가독성 향상",
      "심볼, 코디, 레벨 탭 데이터 파싱 로직 수정",
      "beauty-equipment 엔드포인트 분리 호출로 헤어/성형 데이터 정확도 향상",
    ],
  },
  {
    version: "v1.0",
    date: "2025.04.06",
    tag: "출시",
    items: [
      "메이플봇 웹사이트 및 디스코드 봇 최초 출시",
      "/정보 슬래시 명령어로 캐릭터 기본 정보 조회",
      "장비, 어빌리티, 유니온, 심볼, 헥사, 코디 탭 기능 탑재",
      "Nexon OpenAPI 연동 — 실시간 캐릭터 데이터 제공 체계 구축",
    ],
  },
]

const TAG_STYLE: Record<string, { bg: string; color: string }> = {
  "기능 추가": { bg: "rgba(34,197,94,0.12)",  color: "#16a34a" },
  "개선":      { bg: "rgba(37,99,235,0.12)",   color: "#2563eb" },
  "수정":      { bg: "rgba(239,68,68,0.12)",   color: "#dc2626" },
  "출시":      { bg: "rgba(168,85,247,0.12)",  color: "#9333ea" },
}

const ROADMAP = [
  { label: "길드 정보 조회", desc: "길드원 목록, 길드 레벨, 랭킹 조회 지원 예정", status: "계획 중" },
  { label: "무릉도장 기록", desc: "무릉도장 최고 층수 및 직업별 랭킹 조회 예정", status: "계획 중" },
  { label: "아이템 시세 조회", desc: "경매장 아이템 시세 실시간 조회 기능 예정", status: "검토 중" },
  { label: "서버 점검 알림", desc: "넥슨 서버 점검 시 디스코드 채널 자동 알림 예정", status: "검토 중" },
]

export default function UpdatesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pb-20" style={{ paddingTop: "80px" }}>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-3" style={{ color: "var(--text)" }}>업데이트 내용</h1>
        <p className="text-sm" style={{ color: "var(--text-sub)" }}>
          메이플봇의 업데이트 이력을 확인하세요
        </p>
      </div>

      {/* 업데이트 로그 */}
      <div className="space-y-4 mb-10">
        {UPDATES.map((u) => {
          const style = TAG_STYLE[u.tag] ?? TAG_STYLE["개선"]
          return (
            <div key={u.version} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-black text-lg" style={{ color: "var(--text)" }}>{u.version}</span>
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

      {/* 로드맵 */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>개발 로드맵</h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: "rgba(37,99,235,0.1)", color: "var(--blue)" }}>
            예정
          </span>
        </div>
        <div className="space-y-3">
          {ROADMAP.map(r => (
            <div key={r.label} className="flex items-start gap-3 py-2.5"
              style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text)" }}>{r.label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{r.desc}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full shrink-0 font-medium"
                style={{ background: "rgba(15,23,42,0.05)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
          로드맵은 개발 진행 상황에 따라 변경될 수 있습니다.
          Nexon OpenAPI 정식 서비스 승인 이후 순차적으로 제공될 예정입니다.
        </p>
      </div>

    </div>
  )
}
