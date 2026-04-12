export interface UnionGrades {
  B: string
  A: string
  S: string
  SS: string
  SSS: string
}

export interface UnionCharacter {
  name: string
  effect: string
  grades: UnionGrades
  category: string
}

export const UNION_DATA: UnionCharacter[] = [
  // ── 공통 ────────────────────────────────────────────────
  { name: "신궁",         effect: "크리티컬 확률 증가",            grades: { B: "1%",  A: "2%",  S: "3%",  SS: "4%",  SSS: "5%"  }, category: "공통" },
  { name: "나이트로드",   effect: "크리티컬 확률 증가",            grades: { B: "1%",  A: "2%",  S: "3%",  SS: "4%",  SSS: "5%"  }, category: "공통" },
  { name: "메르세데스",   effect: "스킬 쿨타임 감소",              grades: { B: "2%",  A: "3%",  S: "4%",  SS: "5%",  SSS: "6%"  }, category: "공통" },
  { name: "데몬 어벤져",  effect: "보스 공격력 증가",              grades: { B: "1%",  A: "2%",  S: "3%",  SS: "5%",  SSS: "6%"  }, category: "공통" },
  { name: "블래스터",     effect: "방어율 무시 증가",              grades: { B: "1%",  A: "2%",  S: "3%",  SS: "4%",  SSS: "5%"  }, category: "공통" },
  { name: "와일드헌터",   effect: "공격 시 20% 확률로 데미지 증가", grades: { B: "4%",  A: "8%",  S: "12%", SS: "16%", SSS: "20%" }, category: "공통" },
  { name: "메카닉",       effect: "버프 지속시간 증가",            grades: { B: "5%",  A: "10%", S: "15%", SS: "20%", SSS: "25%" }, category: "공통" },
  { name: "은월",         effect: "크리티컬 데미지 증가",          grades: { B: "1%",  A: "2%",  S: "3%",  SS: "5%",  SSS: "6%"  }, category: "공통" },
  { name: "렌",           effect: "이동속도/최대 이동속도 증가",   grades: { B: "2",   A: "4",   S: "6",   SS: "8",   SSS: "10"  }, category: "공통" },
  { name: "메이플M",      effect: "공격력/마력 증가",              grades: { B: "5",   A: "10",  S: "15",  SS: "20",  SSS: "25"  }, category: "공통" },

  // ── 힘(STR) ─────────────────────────────────────────────
  { name: "스트라이커",   effect: "힘 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "힘(STR)" },
  { name: "카이저",       effect: "힘 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "힘(STR)" },
  { name: "바이퍼",       effect: "힘 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "힘(STR)" },
  { name: "히어로",       effect: "힘 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "힘(STR)" },
  { name: "팔라딘",       effect: "힘 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "힘(STR)" },
  { name: "캐논마스터",   effect: "힘 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "힘(STR)" },
  { name: "아크",         effect: "힘 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "힘(STR)" },
  { name: "아델",         effect: "힘 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "힘(STR)" },
  { name: "제논",         effect: "힘/덱/럭 증가", grades: { B: "5", A: "10", S: "20", SS: "40", SSS: "50" }, category: "힘(STR)/민첩(DEX)/행운(LUK)" },

  // ── 민첩(DEX) ────────────────────────────────────────────
  { name: "보우마스터",     effect: "덱 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "민첩(DEX)" },
  { name: "윈드브레이커",   effect: "덱 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "민첩(DEX)" },
  { name: "엔젤릭버스터",   effect: "덱 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "민첩(DEX)" },
  { name: "패스파인더",     effect: "덱 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "민첩(DEX)" },
  { name: "카인",           effect: "덱 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "민첩(DEX)" },

  // ── 지력(INT) ────────────────────────────────────────────
  { name: "아크메이지(썬,콜)", effect: "인트 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "지력(INT)" },
  { name: "비숍",              effect: "인트 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "지력(INT)" },
  { name: "배틀메이지",        effect: "인트 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "지력(INT)" },
  { name: "루미너스",          effect: "인트 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "지력(INT)" },
  { name: "플레임위자드",      effect: "인트 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "지력(INT)" },
  { name: "키네시스",          effect: "인트 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "지력(INT)" },
  { name: "일리움",            effect: "인트 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "지력(INT)" },
  { name: "라라",              effect: "인트 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "지력(INT)" },

  // ── 행운(LUK) ────────────────────────────────────────────
  { name: "나이트워커",    effect: "럭 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "행운(LUK)" },
  { name: "섀도어",        effect: "럭 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "행운(LUK)" },
  { name: "듀얼블레이더",  effect: "럭 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "행운(LUK)" },
  { name: "카데나",        effect: "럭 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "행운(LUK)" },
  { name: "호영",          effect: "럭 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "행운(LUK)" },
  { name: "칼리",          effect: "럭 증가", grades: { B: "10", A: "20", S: "40", SS: "80", SSS: "100" }, category: "행운(LUK)" },

  // ── 기타 ─────────────────────────────────────────────────
  { name: "제로",          effect: "경험치 증가",              grades: { B: "4%",  A: "6%",  S: "8%",  SS: "10%", SSS: "12%"  }, category: "기타" },
  { name: "팬텀",          effect: "메소 획득량 증가",          grades: { B: "1%",  A: "2%",  S: "3%",  SS: "4%",  SSS: "5%"   }, category: "기타" },
  { name: "소울마스터",    effect: "최대 HP 증가",              grades: { B: "250", A: "500", S: "1000", SS: "2000", SSS: "2500" }, category: "기타" },
  { name: "미하일",        effect: "최대 HP 증가",              grades: { B: "250", A: "500", S: "1000", SS: "2000", SSS: "2500" }, category: "기타" },
  { name: "캡틴",          effect: "소환수 지속시간 증가",      grades: { B: "4%",  A: "6%",  S: "8%",  SS: "10%", SSS: "12%"  }, category: "기타" },
  { name: "아란",          effect: "타격 시 70% 확률로 HP 회복", grades: { B: "2%",  A: "4%",  S: "6%",  SS: "8%",  SSS: "10%"  }, category: "기타" },
  { name: "에반",          effect: "타격 시 70% 확률로 MP 회복", grades: { B: "2%",  A: "4%",  S: "6%",  SS: "8%",  SSS: "10%"  }, category: "기타" },
  { name: "다크나이트",    effect: "최대 HP 증가",              grades: { B: "2%",  A: "3%",  S: "4%",  SS: "5%",  SSS: "6%"   }, category: "기타" },
  { name: "아크메이지(불,독)", effect: "최대 MP 증가",          grades: { B: "2%",  A: "3%",  S: "4%",  SS: "5%",  SSS: "6%"   }, category: "기타" },
  { name: "데몬 슬레이어", effect: "상태이상 저항",             grades: { B: "1",   A: "2",   S: "3",   SS: "4",   SSS: "5"    }, category: "기타" },
]
