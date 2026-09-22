export type ChoiceKey = 'site' | 'category' | 'audience' | 'scope' | 'publish' | 'type' | 'topic' | 'purpose' | 'action' | 'tone' | 'length' | 'tags';
export type Choices = Record<ChoiceKey, string>;
export type Extras = { adminUrl: string; include: string; exclude: string; link: string; referenceUrl: string; keyword: string; notes: string; thumbnailText: string; thumbnailSource: string };
export type ThumbnailMode = '제작 안 함' | '새 썸네일 제작' | '기존 이미지 사용';
export type ThumbnailSettings = { mode: ThumbnailMode; size: string; sizeCustom: string; style: string; styleCustom: string };

export const CUSTOM = '직접 작성';
export const sites = [
  'https://www.maplehub.co.kr',
  'https://www.메이플급처.com',
  'https://maplesayo.com',
  'https://www.maplestoryitem.com',
  'https://mapleitem.co.kr/',
  'https://www.maplediscord.com',
  'https://maplesam.co.kr/',
];
export const bookmarks = [
  { name: '메이플 허브', url: sites[0] },
  { name: '한글메이플 급처', url: sites[1] },
  { name: '메이플 사요', url: sites[2] },
  { name: '메이플스토리 아이템', url: sites[3] },
  { name: '메이플 아이템', url: sites[4] },
  { name: '메이플디스코드', url: sites[5] },
  { name: '메이플샘', url: sites[6] },
];

export const initialChoices: Choices = {
  site: '', category: '사이트에 맞게 선택', audience: '메이플스토리 이용자',
  scope: '글 작성만', publish: '초안 저장 후 확인받기', type: '일반 정보',
  topic: '최신 정보를 조사해 주제 선정', purpose: '정확한 정보 전달', action: '없음',
  tone: '친근한 존댓말', length: '보통 (1,500~2,000자)', tags: '관련 태그 5개 이내',
};
export const initialExtras: Extras = { adminUrl: '', include: '', exclude: '', link: '', referenceUrl: '', keyword: '', notes: '', thumbnailText: '', thumbnailSource: '' };

export const options: Record<ChoiceKey, string[]> = {
  site: sites,
  category: ['사이트에 맞게 선택', '공지사항', '이벤트', '업데이트', '가이드', '블로그'],
  audience: ['메이플스토리 이용자', '초보자', '복귀 유저', '기존 유저', '아이템 거래 이용자'],
  scope: ['글 작성만', '관리자 페이지에 초안 등록까지', '관리자 페이지에 공개 게시까지'],
  publish: ['초안 저장 후 확인받기', '검토 후 바로 게시'],
  type: ['일반 정보', '이벤트 안내', '업데이트·패치', '가이드·공략', '홍보·참여 안내'],
  topic: ['최신 정보를 조사해 주제 선정', '진행 중인 이벤트', '최근 업데이트·패치', '초보자·복귀 유저 가이드', '아이템·메소 관련 정보'],
  purpose: ['정확한 정보 전달', '검색 유입', '사이트 이용 안내', '이벤트 참여 안내', '문의 유도'],
  action: ['없음', '관련 글 보기', '사이트 기능 이용', '디스코드 참여', '문의하기'],
  tone: ['친근한 존댓말', '담백한 정보 전달', '공식 안내문'],
  length: ['간단히 (800~1,200자)', '보통 (1,500~2,000자)', '자세히 (2,500~3,500자)'],
  tags: ['태그 없이', '관련 태그 5개 이내', '관련 태그 10개 이내'],
};
export const labels: Record<ChoiceKey, string> = {
  site: '사이트', category: '게시판 / 카테고리', audience: '주요 독자', scope: '작업 범위',
  publish: '게시 방식', type: '글 유형', topic: '주제', purpose: '글의 목적',
  action: '독자에게 유도할 행동', tone: '말투', length: '분량', tags: '태그',
};

export function makePrompt(choices: Choices, custom: Record<ChoiceKey, string>, extras: Extras, thumbnail: ThumbnailSettings) {
  const get = (key: ChoiceKey) => (choices[key] === CUSTOM ? custom[key].trim() : choices[key]);
  const site = get('site');
  const scope = get('scope');
  const contentType = get('type');
  const topic = get('topic');
  const eventRelated = contentType.includes('이벤트') || topic.includes('이벤트');
  const uploads = scope.includes('관리자 페이지') || scope.includes('등록') || scope.includes('게시');
  const publish = scope === '관리자 페이지에 공개 게시까지' ? '검토 후 바로 게시' : '초안 저장 후 확인받기';
  const thumbnailSize = thumbnail.size === CUSTOM ? thumbnail.sizeCustom.trim() : thumbnail.size;
  const thumbnailStyle = thumbnail.style === CUSTOM ? thumbnail.styleCustom.trim() : thumbnail.style;
  const lines = [
    '# 웹사이트 콘텐츠 작성 요청', '',
    '## 사이트와 작업',
    `- 사이트: ${site || '[사이트 주소를 입력하세요]'}`,
    `- 작업 범위: ${scope}`,
    `- 카테고리: ${get('category')}`,
    `- 주요 독자: ${get('audience')}`,
  ];
  if (uploads) {
    if (extras.adminUrl.trim()) lines.push(`- 관리자 페이지: ${extras.adminUrl.trim()}`);
    lines.push(`- 게시 방식: ${publish}`);
  }
  lines.push('', '## 글의 방향',
    `- 글 유형: ${get('type')}`,
    `- 주제: ${get('topic')}`,
    `- 목적: ${get('purpose')}`,
    `- 독자에게 유도할 행동: ${get('action')}`,
    `- 말투: ${get('tone')}`,
    `- 분량: ${get('length')}`,
    `- 태그: ${get('tags')}`,
  );
  if (extras.keyword.trim()) lines.push(`- 핵심 키워드: ${extras.keyword.trim()}`);
  if (extras.include.trim()) lines.push('', '## 반드시 포함할 내용', extras.include.trim());
  if (extras.link.trim()) lines.push('', '## 넣을 링크', extras.link.trim());
  if (extras.exclude.trim()) lines.push('', '## 제외할 내용', extras.exclude.trim());
  if (extras.notes.trim()) lines.push('', '## 추가 요청', extras.notes.trim());
  lines.push('', '## 참고 자료',
    `- 먼저 선택한 사이트(${site || '[사이트 주소]'})의 기존 게시물과 실제 제공 기능을 확인하세요.`,
    '- 메이플스토리 공식 공지사항: https://maplestory.nexon.com/News/Notice/All',
  );
  if (eventRelated) lines.push('- 메이플스토리 공식 진행 중 이벤트: https://maplestory.nexon.com/News/Event/Ongoing');
  if (contentType.includes('패치') || topic.includes('업데이트') || topic.includes('패치')) lines.push('- 메이플스토리 공식 업데이트: https://maplestory.nexon.com/News/Update');
  if (contentType.includes('가이드') || contentType.includes('공략')) lines.push('- 메이플스토리 공식 게임 가이드: https://maplestory.nexon.com/Guide/N23GameInformation');
  if (extras.referenceUrl.trim()) lines.push(`- 추가 참고 자료: ${extras.referenceUrl.trim()}`);
  lines.push('',
    "## 작성 기준",
    "",
    "### 1. 독자의 질문과 채널의 주제",
    "- 선택한 사이트의 핵심 주제와 주요 독자를 확인하고, 이번 글이 답할 구체적인 질문 하나를 중심으로 작성하세요. 노출만을 위해 무관한 인기 주제로 확장하지 마세요.",
    "- 핵심 검색어는 독자가 실제로 사용할 표현으로 정하고, 제목과 필요한 소제목·본문에 자연스럽게 사용하세요. 키워드 밀도나 반복 횟수를 목표로 삼지 마세요.",
    "- 기존 게시물과 검색 의도가 겹치면 차별화할 질문·대상·상황을 정하세요. 새로 더할 가치가 없다면 유사 글을 양산하지 말고 기존 글의 보완 방향을 제안하세요. 기존 글 수정은 별도 요청이 있을 때만 수행하세요.",
    "",
    "### 2. 실제 경험과 고유한 설명",
    "- 작성자가 제공한 실제 경험·스크린샷·측정 기록·사례가 있다면 조건, 과정, 결과, 시행착오와 적용 한계를 구체적으로 설명하세요. 제공되지 않은 직접 경험, 플레이 기록, 구매 사실, 후기, 수치와 인용문을 만들지 마세요.",
    "- 경험 자료가 없다면 직접 해본 것처럼 쓰지 말고 공식 자료를 근거로 한 안내임을 분명히 하세요. 독자 상황별 선택 기준, 근거가 있는 비교, 실행 순서 등 원문 요약 이상의 도움을 제공하세요.",
    "- 타인의 문장이나 글 구성을 복제하거나 여러 글을 짜깁기하지 마세요. 사실, 작성자가 제공한 경험, 자료에 근거한 해석·제안을 구분하고 일반화할 수 없는 사례에는 한계를 밝혀 주세요.",
    "",
    "### 3. 사실 확인과 투명한 출처",
    "- 작업하는 날의 한국 시간을 기준으로 정보의 유효성을 확인하세요. 공지 게시일, 실제 적용일, 적용 서버·버전과 대상 조건을 구분하고 테스트월드 내용을 정식 서버에 확정된 것처럼 쓰지 마세요.",
    "- 공식 발표·원자료를 우선 확인하고 사이트의 기존 게시물과 대조하세요. 중요한 수치나 주장은 해당 설명 가까이에 근거를 연결하고, 글 끝에 실제 확인한 출처의 작성자 또는 기관명, 제목과 원문 링크를 정리하세요.",
    "- 참고 페이지에 접근할 수 없거나 자료끼리 충돌하면 확인한 범위와 미확인 항목을 구분하세요. 핵심 결론을 검증할 수 없으면 단정하지 말고 추가 확인이 필요한 초안으로 표시하세요.",
    "- 선택한 사이트의 기능·혜택은 실제 페이지에서 확인한 것만 소개하세요. 확인되지 않은 거래 실적·최저가·성과·수익·보장 표현을 만들지 마세요.",
    "- 원고료·협찬·제휴 수수료 등 경제적 이해관계가 확인되면 독자가 쉽게 알아볼 수 있도록 글 앞부분이나 관련 내용 가까이에 구체적으로 표시하세요. 내돈내산·협찬 없음도 확인된 경우에만 쓰고, 관계가 불명확하면 작성자 확인 항목으로 남기세요.",
    "",
    "### 4. 읽고 이해하기 쉬운 구성",
    "- 내용을 정확히 설명하는 제목 후보 3개와 최종 제목 1개를 제시하세요. 낚시성 표현을 피하고 도입부에서 핵심 질문의 답과 적용 조건을 먼저 알려주세요.",
    "- 짧은 핵심 요약, 설명적인 소제목, 문단으로 본문을 구성하세요. 표·목록·질문답변은 정보를 이해하는 데 도움이 될 때만 사용하고 모든 글에 같은 형식을 억지로 적용하지 마세요.",
    "- 본문과 직접 관련된 이미지·동영상만 활용하세요. 미디어에 담긴 핵심 정보는 본문에도 텍스트로 설명하고, 이미지를 사용하는 경우 실제 내용을 설명하는 대체 텍스트를 별도로 제시하세요. 생성 이미지를 실제 플레이나 사용 경험의 증거처럼 제시하지 마세요.",
    "- 이 글만의 내용을 요약하는 검색 설명문을 1~2문장으로 따로 제시하세요. 120~160자는 초안의 참고 범위일 뿐 필수 규칙이나 노출 보장 조건이 아닙니다. 태그는 선택한 설정을 따르세요.",
    "- 관련 내부 글이 실제로 존재하고 독자의 다음 질문에 도움이 될 때만 설명적인 문구로 연결하세요. 홍보 목적의 외부 링크와 문맥에 무관한 키워드·광고 문구를 반복하지 마세요.",
    "",
    "### 5. 최신성 유지와 최종 편집",
    "- 이벤트·패치·가격처럼 변하는 정보는 실제 확인한 기준일과 적용 기간을 명시하고, 게시 시점에 종료·변경되었는지 확인하세요. 시간이 지나도 유효한 정보는 새 날짜를 붙이기보다 설명의 깊이와 정확성을 우선하세요.",
    "- 이후 변경될 수 있는 항목과 갱신이 필요한 조건을 완료 보고에 남기세요. 재검증하거나 내용을 바꾸지 않고 확인일·수정일만 최신으로 표시하지 마세요.",
    "- 최종 전달 전에 사실·출처·기간·링크·중복 표현·홍보 비중을 점검하고 의미 없는 반복과 기계적인 요약 문장을 편집하세요. 작성자의 경험과 이해관계처럼 본인 확인이 필요한 내용은 별도로 표시하세요.",
    "- 정보가 부족하면 지정 분량을 채우기 위해 내용을 늘리지 마세요. 보완에 필요한 자료를 알려주고, 핵심 사실이 미확인인 글은 게시 가능한 완성본으로 처리하지 마세요.",
    "- 위 기준은 독자에게 유용한 콘텐츠를 만들기 위한 기준입니다. 검색 수집·색인·상위 노출이나 AI 브리핑 인용이 보장된다고 표현하지 마세요.",
    "",
    "### 글 유형에 맞춘 보완"
  );
  if (eventRelated) lines.push('- 이벤트 글에는 참여 대상, 참여 기간, 참여 방법, 주요 보상, 주의 사항을 확인해 넣고 참여 기간과 보상 수령 기간을 구분하세요.');
  if (contentType.includes('가이드') && eventRelated) lines.push('- 이번 글은 이벤트 소식 나열보다 독자가 따라 할 수 있는 참여 가이드에 초점을 맞추세요.');
  if (contentType.includes('가이드')) lines.push('- 가이드는 준비 조건, 순서대로 따라 할 단계, 흔히 하는 실수, 완료 체크리스트로 구성하세요.');
  if (contentType.includes('패치')) lines.push('- 업데이트는 적용 서버와 날짜, 변경 전후, 이용자에게 미치는 영향, 지금 확인할 사항을 구분하세요.');
  if (get('purpose') === '검색 유입') lines.push('- 검색 유입을 위한 글은 핵심 질문에 충분히 답했는지 점검하고, 독자의 선택에 필요한 비교 기준이나 실제로 관련 있는 후속 질문만 보완하세요.');
  if (contentType.includes('홍보')) lines.push('- 확인한 실제 기능의 이용 순서를 설명하세요. 확인되지 않은 후기·거래 실적·최저가·수익 보장을 만들지 마세요.');
  if (get('action') === '사이트 기능 이용') lines.push('- 사이트 기능 이용 안내는 글의 주제와 직접 관련된 실제 기능이 확인된 경우에만 넣으세요.');
  if (get('topic') === '최신 정보를 조사해 주제 선정') lines.push('- 현재 유효한 공식 자료와 기존 글을 확인해 채널의 핵심 주제 안에서 독자에게 새로운 도움을 주는 주제를 고르세요.');
  if (thumbnail.mode !== '제작 안 함') {
    lines.push('', '## 썸네일');
    if (thumbnail.mode === '새 썸네일 제작') {
      lines.push('- 글의 핵심을 보여주는 썸네일 이미지 1개를 제작하세요.',
        `- 크기: ${thumbnailSize || '[크기를 입력하세요]'}`,
        `- 디자인: ${thumbnailStyle || '[스타일을 입력하세요]'}`,
        `- 이미지 문구: ${extras.thumbnailText.trim() || '글에 맞는 짧은 문구를 선정'}`,
        '- 한글 문구의 오탈자와 작은 화면에서의 가독성을 확인하세요.',
        '- 공식 게임 이미지나 다른 사이트 썸네일을 무단으로 복사하지 마세요.',
        '- 제작한 이미지의 파일 경로를 알려주세요.');
    } else {
      lines.push(`- 사용할 기존 이미지: ${extras.thumbnailSource.trim() || '[이미지 파일 또는 URL을 입력하세요]'}`,
        '- 이미지를 수정하거나 새로 만들지 말고, 사용 가능 여부와 표시 상태를 확인하세요.');
    }
    if (uploads) lines.push('- 관리자 페이지에서 대표 이미지 등록 기능과 권한을 확인한 뒤, 가능하면 이 이미지를 글과 함께 등록하세요.',
      '- 파일 업로드가 불가능하면 등록했다고 말하지 말고 이유와 이미지 파일 경로를 알려주세요.');
    else lines.push('- 작업 범위가 글 작성만이므로 이미지는 파일로 전달하고 사이트에는 등록하지 마세요.');
  }
  if (!uploads) lines.push('', '## 작업 경계', '- 완성한 글만 전달하세요. 관리자 페이지에 로그인하거나 글을 등록·공개하지 마세요.');
  if (uploads) lines.push('', '## 관리자 페이지 등록',
    '- 로그인 상태와 권한을 확인하고, 제목·본문·카테고리·태그를 입력하세요.',
    '- 기존 글과 내용이 중복되는지 확인하고 미리보기에서 표시 상태를 점검하세요.',
    publish === '검토 후 바로 게시'
      ? '- 검토가 끝나고 문제가 없으면 공개 게시한 뒤 실제 게시물 주소를 알려주세요. 핵심 사실·필수 이해관계 표시 등 게시 전 확인이 필요한 사항이 남아 있으면 공개하지 말고 초안과 확인 항목을 전달하세요.'
      : '- 초안으로 저장하고 글과 미리보기 주소를 보여주세요. 공개 게시하지 마세요. 초안 저장 기능이 없으면 입력을 중단하고 완성한 글을 전달하세요.',
  );
  lines.push('', '## 완료 보고',
    '- 완성한 글과 분리해 최종 제목, 사용한 주요 출처, 실제 정보 확인 기준일, 확인하지 못한 내용을 간단히 보고하세요.',
    '- 기존 자료보다 추가한 설명이나 독자에게 주는 도움을 요약하고, 작성자 확인이 필요한 경험·이해관계와 향후 갱신할 항목이 있다면 함께 알려주세요.',
    '- 검색 설명문과 이미지 대체 텍스트가 있다면 게시용 부가 정보로 구분하세요. 작성·전달한 것과 실제 사이트에 반영한 것을 구분해 보고하세요.',
    ...(thumbnail.mode === '제작 안 함' ? [] : ['- 썸네일 파일 경로와 실제 등록 여부를 알려주세요.']),
    uploads ? '- 초안 또는 게시 상태와 해당 주소를 알려주세요.' : '- 완성한 글을 제시하세요.',
    '- 실제로 수행하지 않은 단계는 완료했다고 말하지 마세요.');
  return lines.join('\n');
}
