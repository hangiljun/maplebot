import Link from "next/link"

export default function Footer() {
  return (
    <footer className="mt-auto">
      {/* 넥슨 법적 고지 */}
      <div className="section-container pb-4">
        <div className="rounded-xl px-5 py-4 text-xs text-center leading-relaxed"
          style={{ background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.1)", color: "var(--text-muted)" }}>
          본 서비스는 Nexon OpenAPI를 활용하며, Nexon(넥슨)의 공식 서비스가 아닙니다.<br />
          메이플스토리 및 관련 모든 자산에 대한 저작권은 넥슨 코리아(Nexon Korea Corporation)에 있습니다.<br />
          본 서비스의 모든 캐릭터 데이터는 Nexon OpenAPI를 통해 실시간으로 제공되며, Nexon의 서비스 이용약관에 따라 활용됩니다.
        </div>
      </div>

      {/* 푸터 링크 */}
      <div className="text-center py-6 text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mb-2">
          <Link href="/bot-guide" className="hover:text-blue-500 transition-colors">봇 기능 설명</Link>
          <span>·</span>
          <Link href="/updates" className="hover:text-blue-500 transition-colors">업데이트 내용</Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-blue-500 transition-colors">개인정보처리방침</Link>
          <span>·</span>
          <a href="mailto:myrlfwns1@naver.com" className="hover:text-blue-500 transition-colors">개발자 문의</a>
        </div>
        © 2025 메이플봇 · Powered by Nexon OpenAPI · 비공식 서비스
      </div>
    </footer>
  )
}
