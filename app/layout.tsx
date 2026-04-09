import type { Metadata, Viewport } from "next"
import "./globals.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3182F6",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://www.maplebot.co.kr"),
  title: {
    default: "메이플봇 | 메이플스토리 캐릭터 조회",
    template: "%s | 메이플봇",
  },
  description:
    "메이플스토리 캐릭터 정보를 빠르게 조회하세요. " +
    "레벨, 직업, 스탯, 길드 정보를 한눈에 확인할 수 있습니다. 디스코드 봇도 지원합니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.maplebot.co.kr",
    siteName: "메이플봇",
    title: "메이플봇 | 메이플스토리 캐릭터 조회",
    description: "메이플스토리 캐릭터 정보를 빠르게 조회하세요.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <script type="text/javascript" src="https://openapi.nexon.com/js/analytics.js?app_id=262525" async />
      </head>
      <body style={{ fontFamily: "'Noto Sans KR', 'Pretendard', sans-serif", background: "var(--bg)", color: "var(--text)" }}
        className="antialiased min-h-screen">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
