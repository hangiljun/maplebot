export const UPDATES = [
  {
    version: "v1.5", date: "2026.04.13", tag: "기능 추가", color: "#f97316",
    items: [
      { type: "기능", text: "연무장 DPS 조회 추가 — 디스코드 /정보 하단 🥊 연무장 버튼으로 총합 데미지·평균 DPS·스킬별 TOP 5 분석 제공" },
      { type: "기능", text: "웹사이트 캐릭터 조회 탭 개편 — 어빌리티를 기본 정보 탭 하단에 통합, 연무장 탭 신규 추가" },
      { type: "기능", text: "장비 드롭다운 상세 조회 — 장비 목록 하단 Select Menu로 아이템 선택 시 스탯·잠재·소울·스크롤 상세 정보 표시" },
      { type: "기능", text: "/링크·/유니온 커맨드 — 링크 스킬 키워드 검색 및 레벨 버튼 전환, 유니온 공격대원 계층형 탐색 지원" },
      { type: "기술", text: "슬래시 커맨드 글로벌 등록 전환 — 모든 서버에서 즉시 사용 가능 (기존 특정 길드 전용 등록 방식 제거)" },
      { type: "기술", text: "봇 초대 URL 권한 최소화 — 불필요한 파일 첨부·메시지 기록 권한 제거, 메시지 보내기·링크 첨부만 유지" },
    ],
  },
  {
    version: "v1.4", date: "2026.04.09", tag: "기능 추가", color: "#4ade80",
    items: [
      { type: "기능", text: "다크 네이비 테마 전면 적용 — 사용자 경험 개선을 위한 인터페이스 최적화" },
      { type: "기능", text: "개인정보처리방침 페이지 신설 (/privacy)" },
      { type: "기술", text: "캐릭터 검색 입력값 검증 — 특수문자 자동 필터링, 12자 제한" },
      { type: "기술", text: "공유 Footer 컴포넌트 분리, 넥슨 저작권 고지 가이드라인 적용" },
      { type: "기능", text: "봇 가이드 3단계 튜토리얼, 명령어 복사 버튼, FAQ 섹션 추가" },
      { type: "기술", text: "section-container 클래스로 전 페이지 레이아웃 중앙 정렬 통일" },
    ],
  },
  {
    version: "v1.3", date: "2026.04.05", tag: "기능 추가", color: "#60a5fa",
    items: [
      { type: "기능", text: "디스코드 봇 코디 버튼 추가 (착용 캐시 아이템, 헤어/성형/피부)" },
      { type: "기술", text: "Nexon API 이중화 — NEXON_API_KEY_2 429 폴백으로 가용성 향상" },
      { type: "기술", text: "ocid 1시간 인메모리 캐싱 적용 — API 일일 호출량 최적화" },
      { type: "기술", text: "beauty-equipment 엔드포인트 분리 호출로 헤어/성형 데이터 정확도 개선" },
    ],
  },
  {
    version: "v1.2", date: "2026.04.01", tag: "기능 추가", color: "#60a5fa",
    items: [
      { type: "기능", text: "디스코드 봇 헥사 버튼 추가 (코어 레벨, 헥사 스탯)" },
      { type: "기능", text: "레벨 변동 버튼 추가 (경험치 7일 히스토리, 레벨 변동 이력)" },
      { type: "기술", text: "API 배치 호출 로직 분리(batch1/2/3) — rate limit 회피 및 응답 안정성 개선" },
      { type: "기술", text: "웹 다크 테마 전면 개편" },
    ],
  },
  {
    version: "v1.1", date: "2026.03.25", tag: "개선", color: "#f59e0b",
    items: [
      { type: "기술", text: "Nexon API 429 rate limit 자동 재시도 로직 추가" },
      { type: "기술", text: "심볼·코디 데이터 파싱 로직 수정 — 정확도 향상" },
      { type: "기능", text: "캐릭터 카드 UI 개선 — 정보 밀도 및 가독성 향상" },
    ],
  },
  {
    version: "v1.0", date: "2026.03.20", tag: "출시", color: "#a855f7",
    items: [
      { type: "기능", text: "메이플봇 웹사이트 및 디스코드 봇 최초 출시" },
      { type: "기능", text: "/정보 슬래시 명령어로 캐릭터 기본 정보 조회 지원" },
      { type: "기능", text: "장비·어빌리티·유니온·심볼·헥사·코디 7개 탭 탑재" },
      { type: "기술", text: "Nexon OpenAPI 연동 — 실시간 캐릭터 데이터 파이프라인 구축" },
    ],
  },
]

export const ROADMAP = [
  { label: "길드 정보 조회",   desc: "길드원 목록, 길드 레벨, 랭킹 조회 지원",   status: "계획 중" },
  { label: "아이템 시세 조회", desc: "경매장 아이템 시세 실시간 조회",            status: "검토 중" },
  { label: "서버 점검 알림",   desc: "Nexon 서버 점검 시 디스코드 자동 알림",    status: "검토 중" },
]

export const TAG_STYLE: Record<string, string> = {
  "기능 추가": "#4ade80",
  "개선":      "#60a5fa",
  "수정":      "#f87171",
  "출시":      "#c084fc",
}

export const TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  "기능": { bg: "rgba(96,165,250,0.1)",  color: "#60a5fa" },
  "기술": { bg: "rgba(251,191,36,0.1)",  color: "#fbbf24" },
}
