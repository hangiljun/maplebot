import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "메이플봇 개인정보처리방침",
}

const SECTIONS = [
  {
    title: "1. 수집하는 개인정보 항목",
    content: `본 서비스(메이플봇)는 다음과 같은 정보를 수집합니다.

• 캐릭터 닉네임 (사용자가 직접 입력)
• Discord 서버 ID (봇 명령어 실행 시 자동 수집)

본 서비스는 이용자의 이메일, 비밀번호, 전화번호 등 민감한 개인정보를 수집하지 않습니다.
봇은 이용자의 Discord 비밀번호나 인증 정보를 요구하지 않습니다.`,
  },
  {
    title: "2. 개인정보의 수집 및 이용 목적",
    content: `수집된 정보는 다음 목적에만 사용됩니다.

• 캐릭터 닉네임: Nexon OpenAPI를 통한 캐릭터 정보 조회 목적으로만 사용
• Discord 서버 ID: 봇 명령어 처리 및 응답 전달 목적으로만 사용

수집된 정보는 제3자에게 제공, 판매, 또는 마케팅 목적으로 활용되지 않습니다.`,
  },
  {
    title: "3. 개인정보의 보유 및 이용 기간",
    content: `• 캐릭터 닉네임(ocid): API 호출 최적화를 위해 최대 1시간 서버 메모리에 임시 캐싱 후 자동 삭제
• Discord 서버 ID: 별도 저장하지 않으며, 명령어 응답 완료 후 즉시 폐기
• 데이터베이스에 이용자 정보를 영구 저장하지 않습니다.`,
  },
  {
    title: "4. Nexon OpenAPI 데이터 처리",
    content: `본 서비스는 Nexon OpenAPI를 통해 메이플스토리 캐릭터 정보를 조회합니다.

• 조회되는 정보는 메이플스토리 내 공개된 캐릭터 정보(레벨, 직업, 스탯 등)에 한합니다.
• 서버 부하 방지를 위해 조회 결과는 최대 1시간 임시 캐싱됩니다.
• Nexon OpenAPI 이용약관(https://openapi.nexon.com)을 준수합니다.`,
  },
  {
    title: "5. 개인정보의 제3자 제공",
    content: `본 서비스는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다.
단, 다음의 경우는 예외로 합니다.

• 이용자가 사전에 동의한 경우
• 법령의 규정에 의하거나 수사기관의 요구가 있는 경우`,
  },
  {
    title: "6. 이용자의 권리",
    content: `이용자는 언제든지 다음의 권리를 행사할 수 있습니다.

• 개인정보 처리 현황 열람 요청
• 개인정보 수집·이용·제공 동의 철회
• 개인정보 삭제 요청

위 권리 행사를 원하시는 경우 contact@maplebot.co.kr로 문의해 주세요.`,
  },
  {
    title: "7. 개인정보 보호책임자",
    content: `개인정보 처리에 관한 업무를 총괄하여 처리하고, 개인정보 처리와 관련한 불만처리 및 피해구제를 위해 아래와 같이 개인정보 보호책임자를 지정합니다.

• 이메일: myrlfwns1@naver.com
• 서비스명: 메이플봇 (maplebot.co.kr)`,
  },
  {
    title: "8. 개인정보처리방침 변경",
    content: `이 개인정보처리방침은 2026년 4월 6일부터 적용됩니다.
내용 변경 시 서비스 내 공지사항을 통해 사전 고지합니다.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="section-container pb-20" style={{ paddingTop: "80px" }}>
      <div className="max-w-3xl mx-auto">

      <div className="text-center mb-12">
        <h1 className="text-3xl font-black mb-3" style={{ color: "var(--text)" }}>개인정보처리방침</h1>
        <p className="text-sm" style={{ color: "var(--text-sub)" }}>
          메이플봇은 이용자의 개인정보를 중요하게 생각합니다.
        </p>
        <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>시행일: 2026년 4월 6일</p>
      </div>

      {/* 요약 카드 */}
      <div className="glass rounded-2xl p-6 mb-8"
        style={{ border: "1px solid rgba(37,99,235,0.2)", background: "rgba(37,99,235,0.04)" }}>
        <p className="text-sm font-bold mb-3" style={{ color: "var(--blue)" }}>핵심 요약</p>
        <ul className="space-y-2">
          {[
            "캐릭터 닉네임만 수집하며, 비밀번호·이메일 등 민감 정보는 수집하지 않습니다.",
            "수집 데이터는 Nexon OpenAPI 조회 목적으로만 사용되며 제3자에게 판매하지 않습니다.",
            "캐릭터 정보는 최대 1시간 임시 캐싱 후 자동 삭제되며, 영구 저장하지 않습니다.",
            "봇은 이용자의 Discord 비밀번호나 인증 정보를 절대 요구하지 않습니다.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-sub)" }}>
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--blue)" }} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* 본문 */}
      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <div key={section.title} className="glass rounded-2xl p-6">
            <h2 className="text-sm font-bold mb-3" style={{ color: "var(--text)" }}>{section.title}</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-sub)" }}>
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}
