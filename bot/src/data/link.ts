export interface LinkCharacter {
  /** 캐릭터 직업명 (예: "메르세데스") */
  name: string
  /** 링크 스킬명 (예: "엘프의 축복") */
  skillName: string
  /** 최대 레벨 */
  maxLevel: number
  /** 레벨별 효과 설명 (index 0 = Lv.1) */
  effects: string[]
  /** 직업 카테고리 (예: "궁수", "전사") */
  category?: string
}

/**
 * 링크 스킬 데이터
 * 사용자가 데이터를 제공하면 여기에 추가하세요.
 *
 * 검색 예시:
 *   /링크 경험치  → effects에 "경험치" 포함된 캐릭터 전체
 *   /링크 메르세데스 → name이 "메르세데스"인 항목 상세
 */
export const LINK_DATA: LinkCharacter[] = [
  // 데이터를 여기에 추가하세요
  // 예시:
  // {
  //   name: "메르세데스",
  //   skillName: "엘프의 축복",
  //   maxLevel: 2,
  //   effects: [
  //     "경험치 획득량 15% 증가",
  //     "경험치 획득량 30% 증가",
  //   ],
  //   category: "궁수",
  // },
]
