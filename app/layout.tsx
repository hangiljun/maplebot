import type { Metadata, Viewport } from "next"
import { Noto_Sans_KR } from "next/font/google"
import "./globals.css"
import Navbar from "./components/Navbar"

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
})

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

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.className} bg-[#F9FAFB] text-[#191F28] antialiased min-h-screen`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
