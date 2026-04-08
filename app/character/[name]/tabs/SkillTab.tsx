import { SkillItem } from "@/lib/maple"

function SkillCard({ skill }: { skill: SkillItem }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 flex gap-3 items-start">
      <div className="w-12 h-12 bg-[#1a1a2e] rounded-lg flex items-center justify-center shrink-0 border border-gray-200">
        {skill.skill_icon
          ? <img src={skill.skill_icon} alt={skill.skill_name} className="w-10 h-10 object-contain" />
          : <span className="text-xl">✨</span>
        }
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-bold text-[#191F28] truncate">{skill.skill_name}</p>
          {skill.skill_level > 0 && (
            <span className="shrink-0 text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
              Lv.{skill.skill_level}
            </span>
          )}
        </div>
        {skill.skill_effect && (
          <p className="text-[11px] text-gray-400 mt-0.5 leading-snug line-clamp-2">{skill.skill_effect}</p>
        )}
      </div>
    </div>
  )
}

export default function SkillTab({ skills }: { skills: SkillItem[] }) {
  if (!skills.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-3">✨</div>
        <p className="text-sm">스킬 정보를 불러올 수 없어요</p>
        <p className="text-xs mt-1">6차 스킬(헥사)이 없는 캐릭터일 수 있습니다</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {skills.map((skill, i) => (
        <SkillCard key={i} skill={skill} />
      ))}
    </div>
  )
}
