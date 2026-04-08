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
    description: `메이플스토리 캐릭터 ${decoded}의 레벨, 직업, 장비, 유니온 정보를 확인하세요.`,
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">

      {/* 캐릭터 프로필 카드 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {/* 상단: 캐릭터 이미지 */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6">
          <div className="bg-gradient-to-b from-blue-50 to-indigo-50 rounded-2xl w-36 h-36 flex items-center justify-center border border-blue-100 mb-4">
            <CharacterImage src={basic.character_image} name={basic.character_name} size="lg" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#191F28]">{basic.character_name}</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {basic.character_class} · Lv.{basic.character_level}
          </p>

          {/* 배지 */}
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full">
              🌍 {basic.world_name}
            </span>
            {basic.character_guild_name && (
              <span className="bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                🛡️ {basic.character_guild_name}
              </span>
            )}
            {data.popularity !== 0 && (
              <span className="bg-pink-50 text-pink-500 text-xs font-semibold px-3 py-1.5 rounded-full">
                ❤️ 인기도 {data.popularity.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 탭 (기본정보 / 장비 / 어빌리티 / 유니온) */}
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
