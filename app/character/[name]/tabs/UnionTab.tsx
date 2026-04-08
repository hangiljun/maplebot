import { UnionInfo } from "@/lib/maple"

const UNION_GRADE_COLOR: Record<string, string> = {
  "그랜드마스터": "#FF8C00",
  "마스터":       "#A855F7",
  "다이아몬드":   "#60A5FA",
  "플래티넘":     "#94A3B8",
  "골드":         "#EAB308",
  "실버":         "#9CA3AF",
  "브론즈":       "#B45309",
}

function getGradeColor(grade: string) {
  for (const [key, color] of Object.entries(UNION_GRADE_COLOR)) {
    if (grade.includes(key)) return color
  }
  return "#6B7280"
}

export default function UnionTab({ union }: { union: UnionInfo | null }) {
  if (!union) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-3">🏰</div>
        <p className="text-sm">유니온 정보를 불러올 수 없어요</p>
      </div>
    )
  }

  const gradeColor = getGradeColor(union.union_grade)

  return (
    <div className="space-y-4">

      {/* 유니온 레벨 카드 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
        <div className="text-5xl mb-3">🏰</div>
        <p className="text-4xl font-extrabold text-[#191F28]">{union.union_level.toLocaleString()}</p>
        <p className="text-sm font-medium mt-1" style={{ color: gradeColor }}>
          {union.union_grade}
        </p>
      </div>

      {/* 아티팩트 */}
      {union.union_artifact_level > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">유니온 아티팩트</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-[#F5F6FA] rounded-xl py-3">
              <p className="text-xs text-gray-400 mb-1">아티팩트 레벨</p>
              <p className="text-xl font-extrabold text-[#191F28]">{union.union_artifact_level}</p>
            </div>
            <div className="bg-[#F5F6FA] rounded-xl py-3">
              <p className="text-xs text-gray-400 mb-1">아티팩트 경험치</p>
              <p className="text-xl font-extrabold text-[#191F28]">{union.union_artifact_exp.toLocaleString()}</p>
            </div>
            <div className="bg-[#F5F6FA] rounded-xl py-3">
              <p className="text-xs text-gray-400 mb-1">아티팩트 포인트</p>
              <p className="text-xl font-extrabold text-[#191F28]">{union.union_artifact_point.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
