import type { Metadata } from "next"
import Link from "next/link"
import { Search, Bot, BarChart2 } from "lucide-react"

export const metadata: Metadata = {
  title: "메이플봇 | 메이플스토리 캐릭터 조회",
  alternates: { canonical: "/" },
}

const features = [
  {
    icon: <Search size={24} className="text-[#3182F6]" />,
    title: "캐릭터 조회",
    desc: "닉네임 하나로 레벨, 직업, 스탯 등 모든 정보를 한눈에 확인하세요.",
    href: "/character",
    label: "조회하기",
  },
  {
    icon: <BarChart2 size={24} className="text-[#3182F6]" />,
    title: "랭킹",
    desc: "서버별 레벨 랭킹을 확인하고 내 캐릭터의 순위를 알아보세요.",
    href: "/ranking",
    label: "랭킹 보기",
  },
  {
    icon: <Bot size={24} className="text-[#3182F6]" />,
    title: "디스코드 봇",
    desc: "디스코드에서 /캐릭터 명령어로 바로 캐릭터 정보를 조회하세요.",
    href: "/bot",
    label: "봇 초대하기",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">

      {/* 히어로 */}
      <section className="bg-white border-b border-[#E5E8EB]">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-6">🍁</div>
          <h1 className="text-4xl md:text-5xl font-black text-[#191F28] tracking-tight">
            메이플봇
          </h1>
          <p className="text-[#8B95A1] text-lg mt-4 max-w-md mx-auto leading-relaxed">
            메이플스토리 캐릭터 정보를 빠르게 조회하고<br />
            디스코드에서도 바로 확인하세요
          </p>

          {/* 검색 바 */}
          <div className="mt-8 max-w-md mx-auto flex gap-2">
            <Link href="/character"
              className="flex-1 flex items-center gap-2 border border-[#E5E8EB] rounded-xl px-4 py-3 bg-[#F9FAFB] text-sm text-[#C8CDD4] hover:border-[#3182F6] transition-colors cursor-text">
              <Search size={16} className="text-[#C8CDD4]" />
              캐릭터 닉네임을 입력하세요
            </Link>
            <Link href="/character"
              className="bg-[#3182F6] hover:bg-[#1C6EE8] text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors whitespace-nowrap">
              조회
            </Link>
          </div>
        </div>
      </section>

      {/* 기능 소개 */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-[#E5E8EB] rounded-2xl px-6 py-6 flex flex-col gap-3">
              <div className="w-11 h-11 bg-[#EBF3FE] rounded-xl flex items-center justify-center">
                {f.icon}
              </div>
              <div>
                <h2 className="font-bold text-[#191F28]">{f.title}</h2>
                <p className="text-sm text-[#8B95A1] mt-1 leading-relaxed">{f.desc}</p>
              </div>
              <Link href={f.href}
                className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[#3182F6] hover:text-[#1C6EE8] transition-colors">
                {f.label} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 디스코드 CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="bg-[#5865F2] rounded-2xl px-6 py-8 text-center text-white">
          <div className="text-4xl mb-3">🤖</div>
          <h2 className="text-xl font-bold">디스코드 봇을 서버에 추가하세요</h2>
          <p className="text-[#C5C8FF] text-sm mt-2 mb-5">
            /캐릭터 명령어로 메이플스토리 캐릭터를 디스코드에서 바로 조회할 수 있어요
          </p>
          <Link href="/bot"
            className="inline-flex items-center gap-2 bg-white text-[#5865F2] hover:bg-[#F2F3FF] px-6 py-2.5 rounded-xl font-bold text-sm transition-colors">
            <Bot size={16} />
            봇 초대하기
          </Link>
        </div>
      </section>

    </div>
  )
}
