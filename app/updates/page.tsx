const UPDATES = [
  {
    version: "v1.4",
    date: "2026.04.09",
    tag: "기능 추가",
    color: "#4ade80",
    items: [
      { type: "기능", text: "다크 네이비 테마 전면 적용 — 넥슨 심사 대응 UI 리뉴얼" },
      { type: "기능", text: "개인정보처리방침 페이지 신설 (/privacy)" },
      { type: "기술", text: "캐릭터 검색 입력값 검증 — 특수문자 자동 필터링, 12자 제한" },
      { type: "기술", text: "공유 Footer 컴포넌트 분리, 넥슨 저작권 고지 가이드라인 적용" },
      { type: "기능", text: "봇 가이드 3단계 튜토리얼, 명령어 복사 버튼, FAQ 섹션 추가" },
      { type: "기술", text: "section-container 클래스로 전 페이지 레이아웃 중앙 정렬 통일" },
    ],
  },
  {
    version: "v1.3",
    date: "2025.04.09",
    tag: "기능 추가",
    color: "#60a5fa",
    items: [
      { type: "기능", text: "디스코드 봇 코디 버튼 추가 (착용 캐시 아이템, 헤어/성형/피부)" },
      { type: "기술", text: "Nexon API 이중화 — NEXON_API_KEY_2 429 폴백으로 가용성 향상" },
      { type: "기술", text: "ocid 1시간 인메모리 캐싱 적용 — API 일일 호출량 최적화" },
      { type: "기술", text: "beauty-equipment 엔드포인트 분리 호출로 헤어/성형 데이터 정확도 개선" },
    ],
  },
  {
    version: "v1.2",
    date: "2025.04.08",
    tag: "기능 추가",
    color: "#60a5fa",
    items: [
      { type: "기능", text: "디스코드 봇 헥사 버튼 추가 (코어 레벨, 헥사 스탯)" },
      { type: "기능", text: "레벨 변동 버튼 추가 (경험치 7일 히스토리, 레벨 변동 이력)" },
      { type: "기술", text: "API 배치 호출 로직 분리(batch1/2/3) — rate limit 회피 및 응답 안정성 개선" },
      { type: "기술", text: "웹 다크 테마 전면 개편" },
    ],
  },
  {
    version: "v1.1",
    date: "2025.04.07",
    tag: "개선",
    color: "#f59e0b",
    items: [
      { type: "기술", text: "Nexon API 429 rate limit 자동 재시도 로직 추가" },
      { type: "기술", text: "심볼·코디 데이터 파싱 로직 수정 — 정확도 향상" },
      { type: "기능", text: "캐릭터 카드 UI 개선 — 정보 밀도 및 가독성 향상" },
    ],
  },
  {
    version: "v1.0",
    date: "2025.04.06",
    tag: "출시",
    color: "#a855f7",
    items: [
      { type: "기능", text: "메이플봇 웹사이트 및 디스코드 봇 최초 출시" },
      { type: "기능", text: "/정보 슬래시 명령어로 캐릭터 기본 정보 조회 지원" },
      { type: "기능", text: "장비·어빌리티·유니온·심볼·헥사·코디 7개 탭 탑재" },
      { type: "기술", text: "Nexon OpenAPI 연동 — 실시간 캐릭터 데이터 파이프라인 구축" },
    ],
  },
]

const ROADMAP = [
  { label: "길드 정보 조회",   desc: "길드원 목록, 길드 레벨, 랭킹 조회 지원", status: "계획 중" },
  { label: "무릉도장 기록",    desc: "무릉도장 최고 층수 및 직업별 랭킹 조회", status: "계획 중" },
  { label: "아이템 시세 조회", desc: "경매장 아이템 시세 실시간 조회", status: "검토 중" },
  { label: "서버 점검 알림",   desc: "Nexon 서버 점검 시 디스코드 자동 알림", status: "검토 중" },
]

const TAG_STYLE: Record<string, string> = {
  "기능 추가": "#4ade80",
  "개선":      "#60a5fa",
  "수정":      "#f87171",
  "출시":      "#c084fc",
}

const TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  "기능": { bg: "rgba(96,165,250,0.1)",  color: "#60a5fa" },
  "기술": { bg: "rgba(251,191,36,0.1)",  color: "#fbbf24" },
}

export default function UpdatesPage() {
  return (
    <div className="section-container pb-20" style={{ paddingTop: "80px" }}>

      <div className="text-center mb-16">
        <h1 className="text-3xl font-black mb-3" style={{ color: "var(--text)" }}>업데이트 내용</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          메이플봇의 기능 추가 및 기술적 개선 이력을 확인하세요
        </p>
      </div>

      {/* 타임라인 */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="relative">
          {/* 세로 선 */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px"
            style={{ background: "var(--border)" }} />

          <div className="space-y-8">
            {UPDATES.map((u) => {
              const tagColor = TAG_STYLE[u.tag] ?? "#60a5fa"
              return (
                <div key={u.version} className="flex gap-6">
                  {/* 타임라인 점 */}
                  <div className="relative z-10 shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "var(--bg)", border: `2px solid ${tagColor}`, boxShadow: `0 0 10px ${tagColor}40` }}>
                      <div className="w-2.5 h-2.5 rounded-full"
                        style={{ background: tagColor }} />
                    </div>
                  </div>

                  {/* 카드 */}
                  <div className="flex-1 glass rounded-2xl p-5 mb-2"
                    style={{ border: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-black text-base" style={{ color: "var(--text)" }}>
                        {u.version}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                        style={{ background: `${tagColor}18`, color: tagColor, border: `1px solid ${tagColor}30` }}>
                        {u.tag}
                      </span>
                      <span className="ml-auto text-xs tabular-nums"
                        style={{ color: "var(--text-muted)" }}>{u.date}</span>
                    </div>

                    <ul className="space-y-2.5">
                      {u.items.map((item, i) => {
                        const ts = TYPE_STYLE[item.type] ?? TYPE_STYLE["기능"]
                        return (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 mt-0.5"
                              style={{ background: ts.bg, color: ts.color }}>
                              {item.type}
                            </span>
                            <span className="text-sm leading-relaxed"
                              style={{ color: "var(--text-sub)" }}>
                              {item.text}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 로드맵 */}
      <div className="max-w-2xl mx-auto glass rounded-2xl p-6"
        style={{ border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>개발 로드맵</h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: "rgba(59,130,246,0.1)", color: "var(--blue-light)", border: "1px solid rgba(59,130,246,0.2)" }}>
            예정
          </span>
        </div>

        <div className="space-y-1">
          {ROADMAP.map((r, i) => (
            <div key={r.label} className="flex items-center gap-4 py-3"
              style={{ borderBottom: i < ROADMAP.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text)" }}>
                  {r.label}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{r.desc}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full shrink-0"
                style={{ background: "var(--bg-surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
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
