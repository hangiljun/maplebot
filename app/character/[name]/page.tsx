import type { Metadata } from "next"
import Link from "next/link"
import { Search } from "lucide-react"
import { fetchCharacter } from "@/lib/maple"
import CharacterImage from "./CharacterImage"
import CharacterTabs from "./CharacterTabs"

interface Props {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  const decoded = decodeURIComponent(name)
  return {
    title: `${decoded} 캐릭터 조회`,
    description: `메이플스토리 캐릭터 ${decoded}의 레벨, 직업, 장비, 유니온, 스킬 정보를 확인하세요.`,
  }
}

export default async function CharacterDetailPage({ params }: Props) {
  const { name } = await params
  const decoded = decodeURIComponent(name)
  const data = await fetchCharacter(decoded)

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-lg font-bold text-[#191F28]">캐릭터를 찾을 수 없어요</h2>
        <p className="text-sm text-gray-400 mt-2">
          &apos;{decoded}&apos; 캐릭터가 존재하지 않거나 조회에 실패했습니다.
        </p>
        <Link href="/"
          className="inline-flex items-center gap-2 mt-6 bg-[#3182F6] hover:bg-[#1C6EE8] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors">
          <Search size={14} /> 다시 검색
        </Link>
      </div>
    )
  }

  const { basic } = data
  const expRate = Math.min(Math.max(parseFloat(basic.character_exp_rate) || 0, 0), 100)
  const joinDate = basic.character_date_create
    ? new Date(basic.character_date_create).toLocaleDateString("ko-KR", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

      {/* 프로필 카드 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-blue-500 to-blue-400" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="rounded-2xl border-4 border-white shadow-md bg-white shrink-0">
              <CharacterImage src={basic.character_image} name={basic.character_name} />
            </div>
            <div className="mb-1 min-w-0">
              <h1 className="text-xl font-extrabold text-[#191F28] truncate">{basic.character_name}</h1>
              <p className="text-sm text-gray-400 font-medium mt-0.5">
                {basic.character_class} · Lv.{basic.character_level}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              🌍 {basic.world_name}
            </span>
            {basic.character_guild_name && (
              <span className="bg-gray-50 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                🛡️ {basic.character_guild_name}
              </span>
            )}
            {data.popularity !== 0 && (
              <span className="bg-pink-50 text-pink-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                ❤️ 인기도 {data.popularity.toLocaleString()}
              </span>
            )}
            {joinDate && (
              <span className="bg-gray-50 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full">
                📅 {joinDate}
              </span>
            )}
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-400 font-medium mb-1.5">
              <span>Lv.{basic.character_level} 경험치</span>
              <span>{basic.character_exp_rate}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-[#3182F6] h-1.5 rounded-full" style={{ width: `${expRate}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 탭 (기본정보 / 장비 / 유니온 / 헥사 스킬) */}
      <CharacterTabs data={data} />

      {/* 다시 검색 */}
      <div className="flex justify-center pt-2">
        <Link href="/"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#3182F6] transition-colors font-medium">
          <Search size={14} /> 다른 캐릭터 검색하기
        </Link>
      </div>

    </div>
  )
}
