export interface UnionCharacter {
  /** 캐릭터 직업명 (예: "메르세데스") */
  name: string
  /** 유니온 블록 효과 (예: "보스 몬스터 공격 시 데미지 X% 증가") */
  effect: string
  /** 직업 카테고리 (예: "궁수", "전사") */
  category?: string
}

/**
 * 유니온 캐릭터 데이터
 * 사용자가 데이터를 제공하면 여기에 추가하세요.
 *
 * 검색 예시:
 *   /유니온 공격력  → effect에 "공격력" 포함된 캐릭터 전체
 *   /유니온 메르세데스 → name이 "메르세데스"인 항목 상세
 */
export const UNION_DATA: UnionCharacter[] = [
  // 데이터를 여기에 추가하세요
  // 예시:
  // { name: "메르세데스", effect: "경험치 획득량 X% 증가", category: "궁수" },
  // { name: "팬텀", effect: "크리티컬 확률 X% 증가", category: "도적" },
]
