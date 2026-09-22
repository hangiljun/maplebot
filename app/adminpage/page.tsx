'use client';

import { useState, useEffect } from 'react';

interface Bookmark {
  id: string;
  name: string;
  url: string;
  lastVisited?: string;
}

interface PromptFormData {
  siteUrl: string;
  adminUrl: string;
  category: string;
  codeLocation: string;
  siteType: string;
  targetAudience: string;
  postCount: string;
  workScope: string;
  publishMethod: string;
  contentType: string;
  specificTopic: string;
  purpose: string;
  readerGain: string;
  readerAction: string;
  mustInclude1: string;
  mustInclude2: string;
  mustInclude3: string;
  requiredPhrase: string;
  serviceInfo: string;
  links: string;
  contactMethod: string;
  exclude1: string;
  exclude2: string;
  exclude3: string;
  excludeCompany: string;
  excludeNumbers: string;
  excludeWords: string;
  tone: string;
  wordCount: string;
  emoji: string;
  promotionLevel: string;
  coreKeyword: string;
  subKeyword: string;
  tagCount: string;
  thumbnailEnabled: boolean;
  thumbnailPath: string;
}

// 여기에 북마크를 추가/수정/삭제하세요
const BOOKMARKS: Omit<Bookmark, 'lastVisited'>[] = [
  { id: '1', name: '메이플 허브', url: 'https://www.maplehub.co.kr' },
  { id: '2', name: '한글메이플 급처', url: 'https://www.메이플급처.com' },
  { id: '3', name: '메이플 사요', url: 'https://maplesayo.com' },
  { id: '4', name: '메이플스토리 아이템', url: 'https://www.maplestoryitem.com' },
  { id: '5', name: '메이플 아이템', url: 'https://mapleitem.co.kr/' },
  { id: '6', name: '메이플디스코드', url: 'https://www.maplediscord.com' },
  { id: '7', name: '메이플샘', url: 'https://maplesam.co.kr/' },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [visitHistory, setVisitHistory] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'prompt'>('bookmarks');
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState<PromptFormData>({
    siteUrl: '선택하세요',
    adminUrl: '',
    category: '',
    codeLocation: '',
    siteType: '메이플스토리 정보 제공',
    targetAudience: '메이플스토리 초보자',
    postCount: '1개',
    workScope: '글 작성만',
    publishMethod: 'A. 최종 게시 전 확인받기',
    contentType: '일반 정보',
    specificTopic: '',
    purpose: '',
    readerGain: '',
    readerAction: '없음',
    mustInclude1: '',
    mustInclude2: '',
    mustInclude3: '',
    requiredPhrase: '없음',
    serviceInfo: '없음',
    links: '없음',
    contactMethod: '없음',
    exclude1: '',
    exclude2: '',
    exclude3: '',
    excludeCompany: '없음',
    excludeNumbers: '없음',
    excludeWords: '없음',
    tone: '친근한 존댓말',
    wordCount: '1,500~2,000',
    emoji: '사용하지 않음',
    promotionLevel: '없음',
    coreKeyword: '',
    subKeyword: '',
    tagCount: '15개',
    thumbnailEnabled: true,
    thumbnailPath: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/bookmark-visits')
        .then(res => res.json())
        .then(data => setVisitHistory(data))
        .catch(err => console.error('Failed to load visit history:', err));
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'rlfwns55') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleVisit = (id: string) => {
    const timestamp = new Date().toISOString();
    const updated = { ...visitHistory, [id]: timestamp };
    setVisitHistory(updated);

    fetch('/api/bookmark-visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookmarkId: id })
    }).catch(err => console.error('Failed to save visit:', err));
  };

  const formatLastVisited = (id: string) => {
    const lastVisited = visitHistory[id];
    if (!lastVisited) return '방문 기록 없음';

    const now = new Date();
    const visited = new Date(lastVisited);
    const diffMs = now.getTime() - visited.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return visited.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  const generatePrompt = () => {
    // 제목 생성
    let title = '웹사이트 콘텐츠';
    if (formData.workScope === '글 작성만') {
      title = formData.thumbnailEnabled ? '웹사이트 콘텐츠 및 썸네일 작성 요청' : '웹사이트 콘텐츠 작성 요청';
    } else if (formData.workScope === '글과 썸네일 제작') {
      title = '웹사이트 콘텐츠 및 썸네일 작성 요청';
    } else if (formData.workScope === '관리자 페이지 등록까지') {
      title = formData.thumbnailEnabled
        ? '웹사이트 콘텐츠 조사·작성·업로드 요청'
        : '웹사이트 콘텐츠 조사·작성·업로드 요청';
    }

    // 필수 내용 목록 생성
    const mustIncludeItems = [
      formData.mustInclude1,
      formData.mustInclude2,
      formData.mustInclude3
    ].filter(item => item && item.trim());

    // 제외할 내용 목록 생성
    const excludeItems = [
      formData.exclude1,
      formData.exclude2,
      formData.exclude3
    ].filter(item => item && item.trim());

    let sectionNumber = 1;
    let prompt = `# ${title}\n\n`;

    // 1. 사이트 및 작업 정보
    prompt += `## ${sectionNumber++}. 사이트 및 작업 정보\n\n`;

    if (formData.siteUrl && formData.siteUrl !== '선택하세요') {
      prompt += `* 사이트 주소: ${formData.siteUrl}\n`;
    }
    if (formData.workScope === '관리자 페이지 등록까지') {
      if (formData.adminUrl) {
        prompt += `* 관리자 페이지 주소: ${formData.adminUrl}\n`;
      }
      if (formData.codeLocation && !formData.codeLocation.startsWith('http')) {
        prompt += `* 코드 위치: ${formData.codeLocation}\n`;
      }
    }
    if (formData.category) {
      prompt += `* 게시판/카테고리: ${formData.category}\n`;
    }
    prompt += `* 주요 독자: ${formData.targetAudience}\n`;
    prompt += `* 작업 범위: ${formData.workScope}\n`;

    if (formData.workScope === '관리자 페이지 등록까지') {
      prompt += `* 게시 방식: ${formData.publishMethod}\n`;
    }

    prompt += `\n`;

    // 2. 글 주제와 목적
    prompt += `## ${sectionNumber++}. 글 주제와 목적\n\n`;
    prompt += `* 글 유형: ${formData.contentType}\n`;
    if (formData.specificTopic) {
      prompt += `* 주제: ${formData.specificTopic}\n`;
    }
    if (formData.purpose) {
      prompt += `* 목적: ${formData.purpose}\n`;
    }
    if (formData.readerGain) {
      prompt += `* 독자가 얻을 정보: ${formData.readerGain}\n`;
    }
    if (formData.readerAction && formData.readerAction !== '없음') {
      prompt += `* 독자에게 유도할 행동: ${formData.readerAction}\n`;
    }
    prompt += `\n`;

    // 3. 반드시 포함할 내용
    const hasIncludeContent = mustIncludeItems.length > 0
      || (formData.requiredPhrase && formData.requiredPhrase !== '없음')
      || (formData.serviceInfo && formData.serviceInfo !== '없음')
      || (formData.links && formData.links !== '없음')
      || (formData.contactMethod && formData.contactMethod !== '없음');

    if (hasIncludeContent) {
      prompt += `## ${sectionNumber++}. 반드시 포함할 내용\n\n`;

      if (mustIncludeItems.length > 0) {
        prompt += `본문에 자연스럽게 포함할 내용:\n`;
        mustIncludeItems.forEach(item => {
          prompt += `* ${item}\n`;
        });
        prompt += `\n`;
      }

      if (formData.requiredPhrase && formData.requiredPhrase !== '없음') {
        prompt += `* 반드시 사용할 문구: ${formData.requiredPhrase}\n`;
      }
      if (formData.serviceInfo && formData.serviceInfo !== '없음') {
        prompt += `* 안내할 서비스나 기능: ${formData.serviceInfo}\n`;
      }
      if (formData.links && formData.links !== '없음') {
        prompt += `* 삽입할 링크: ${formData.links}\n`;
      }
      if (formData.contactMethod && formData.contactMethod !== '없음') {
        prompt += `* 문의 방법: ${formData.contactMethod}\n`;
      }
      prompt += `\n`;
    }

    // 4. 제외할 내용
    const hasExcludeContent = excludeItems.length > 0
      || (formData.excludeCompany && formData.excludeCompany !== '없음')
      || (formData.excludeNumbers && formData.excludeNumbers !== '없음')
      || (formData.excludeWords && formData.excludeWords !== '없음');

    if (hasExcludeContent) {
      prompt += `## ${sectionNumber++}. 제외할 내용\n\n`;

      if (excludeItems.length > 0) {
        prompt += `작성하지 말아야 할 내용:\n`;
        excludeItems.forEach(item => {
          prompt += `* ${item}\n`;
        });
        prompt += `\n`;
      }

      if (formData.excludeCompany && formData.excludeCompany !== '없음') {
        prompt += `* 언급하지 않을 업체/사이트: ${formData.excludeCompany}\n`;
      }
      if (formData.excludeNumbers && formData.excludeNumbers !== '없음') {
        prompt += `* 제외할 가격/수치: ${formData.excludeNumbers}\n`;
      }
      if (formData.excludeWords && formData.excludeWords !== '없음') {
        prompt += `* 사용하지 않을 단어/표현: ${formData.excludeWords}\n`;
      }

      prompt += `\n공통 제외 사항:\n`;
      prompt += `* 확인되지 않은 소문, 거래 실적, 이용 후기, 회원 수\n`;
      prompt += `* "무조건 안전", "최고가 보장" 같은 근거 없는 단정\n`;
      prompt += `* 다른 사이트의 문장이나 이미지 무단 복사\n`;
      prompt += `* 같은 내용의 불필요한 반복\n`;
      prompt += `\n`;
    }

    // 5. 문체·분량·키워드
    prompt += `## ${sectionNumber++}. 문체·분량·키워드\n\n`;
    prompt += `* 말투: ${formData.tone}\n`;
    prompt += `* 분량: 약 ${formData.wordCount}자 (내용이 부족하면 억지로 늘리지 말 것)\n`;
    if (formData.emoji !== '사용하지 않음') {
      prompt += `* 이모지: ${formData.emoji}\n`;
    }
    if (formData.coreKeyword) {
      prompt += `* 핵심 키워드: ${formData.coreKeyword}\n`;
    }
    if (formData.subKeyword) {
      prompt += `* 보조 키워드: ${formData.subKeyword}\n`;
    }
    prompt += `* 태그: ${formData.tagCount} (본문과 관련된 것만)\n`;
    prompt += `\n`;

    // 6. 글 유형별 작성 지시
    prompt += `## ${sectionNumber++}. 작성 지시\n\n`;

    if (formData.contentType === '이벤트·패치') {
      prompt += `공식 메이플스토리 홈페이지, 공식 업데이트 공지를 우선 사용하세요.\n\n`;
      prompt += `* 공지 게시일과 실제 적용일을 구분하세요.\n`;
      prompt += `* 이벤트는 참여 대상, 기간, 참여 방법, 주요 보상을 명확히 작성하세요.\n`;
      prompt += `* 패치는 적용 날짜와 정식 서버·테스트월드 여부를 표시하세요.\n`;
      prompt += `* 테스트월드 내용을 정식 서버 확정으로 작성하지 마세요.\n`;
      prompt += `* 확인할 수 없는 날짜, 수치, 패치 버전은 추측하지 마세요.\n`;
    } else if (formData.contentType === '홍보·참여 안내') {
      prompt += `* 참여 목적과 제공 정보를 명확히 전달하세요.\n`;
      prompt += `* 참여 방법과 링크를 정확하게 안내하세요.\n`;
      prompt += `* 확인되지 않은 회원 수, 후기, '공식' 여부를 지어내지 마세요.\n`;
      prompt += `* 과도한 태그나 키워드 반복을 피하세요.\n`;
    } else {
      prompt += `* 주제와 관련된 사실을 확인하고 정확하게 작성하세요.\n`;
      prompt += `* 독자가 이해하기 쉽게 설명하세요.\n`;
      prompt += `* 참고한 주요 출처를 본문 하단에 남기세요.\n`;
    }

    prompt += `\n기본 구성:\n`;
    prompt += `1. 명확한 제목\n`;
    prompt += `2. 핵심 요약 2-3줄\n`;
    prompt += `3. 소제목으로 구분한 본문\n`;
    prompt += `4. 독자가 확인하거나 해야 할 사항\n`;
    prompt += `\n`;

    if (formData.workScope === '관리자 페이지 등록까지') {
      prompt += `기존 게시물 중복 확인:\n`;
      prompt += `* 제목뿐 아니라 주요 내용과 범위가 겹치는지 확인하세요.\n`;
      prompt += `* 같은 주제를 표현만 바꿔 새 글로 만들지 마세요.\n`;
      prompt += `\n`;
    }

    // 7. 썸네일 (토글 ON인 경우)
    if (formData.thumbnailEnabled && formData.thumbnailPath) {
      prompt += `## ${sectionNumber++}. 썸네일\n\n`;
      prompt += `* 썸네일 이미지 경로: ${formData.thumbnailPath}\n`;
      prompt += `* 위 경로의 썸네일 이미지를 사용하세요.\n`;
      prompt += `\n`;
    }

    // 8. 관리자 페이지 등록 (작업 범위에 따라)
    if (formData.workScope === '관리자 페이지 등록까지') {
      prompt += `## ${sectionNumber++}. 관리자 페이지 등록\n\n`;
      if (formData.adminUrl) {
        prompt += `관리자 페이지 주소: ${formData.adminUrl}\n\n`;
      }
      prompt += `등록할 내용:\n`;
      prompt += `* 제목, 본문, 카테고리, 태그\n`;
      if (formData.thumbnailEnabled) {
        prompt += `* 썸네일 이미지\n`;
      }
      prompt += `\n확인 사항:\n`;
      prompt += `* 소제목, 굵은 글씨, 표, 목록이 정상 표시되는지\n`;
      if (formData.thumbnailEnabled) {
        prompt += `* 이미지가 정상 업로드되고 표시되는지\n`;
      }
      prompt += `* 미리보기로 모바일 화면 확인\n`;
      prompt += `\n`;

      // 게시 방식
      if (formData.publishMethod.startsWith('A')) {
        prompt += `**게시 방식**: 초안 저장 후 확인받기\n`;
        prompt += `* 공개 게시 버튼은 누르지 마세요.\n`;
        prompt += `* 검토할 글과 초안/미리보기 링크를 제시하세요.\n`;
      } else {
        prompt += `**게시 방식**: 검토 후 바로 게시\n`;
        prompt += `* 문제가 없으면 공개 게시하세요.\n`;
        prompt += `* 게시 후 실제 페이지를 열어 확인하세요.\n`;
        prompt += `* 게시물 주소를 알려주세요.\n`;
      }
      prompt += `\n`;
    }

    // 9. 완료 보고
    prompt += `## ${sectionNumber++}. 완료 보고\n\n`;
    prompt += `작업이 끝나면 간단히 보고하세요:\n`;
    prompt += `* 작성한 글 제목\n`;
    if (formData.contentType === '이벤트·패치') {
      prompt += `* 사용한 주요 출처\n`;
    }
    if (formData.thumbnailEnabled) {
      prompt += `* 썸네일 이미지 경로\n`;
    }
    if (formData.workScope === '관리자 페이지 등록까지') {
      prompt += `* 게시 상태 (초안 저장 / 공개 게시 완료)\n`;
      prompt += `* 게시물 주소 (있는 경우)\n`;
    }

    prompt += `\n확인하지 못한 정보가 있다면 보고에 표시하고, 실제로 수행하지 않은 단계는 완료했다고 말하지 마세요.`;

    return prompt;

## 1. 사이트 및 작업 정보

* 사이트 주소: ${formData.siteUrl === '선택하세요' ? '[입력]' : formData.siteUrl}
* 관리자 페이지 주소: ${formData.adminUrl || '[입력]'}
* 게시판/카테고리: ${formData.category || '[입력]'}
* 코드 위치: ${formData.codeLocation || '[입력]'}
* 사이트 성격: ${formData.siteType}
* 주요 독자: ${formData.targetAudience}
* 작성할 게시물 수: ${formData.postCount}
* 작업 범위: ${formData.workScope}
* 게시 방식: ${formData.publishMethod}
* 별도 선택이 없으면 A 방식으로 진행하세요.

관리자 페이지를 이용할 때는 현재 로그인 상태를 먼저 확인하세요. 로그인이나 권한 문제로 진행할 수 없다면 필요한 조치를 알려주세요.

필수 사이트 정보가 비어 있으면 임의로 사이트를 선택하지 말고 먼저 질문하세요.

## 2. 글 주제와 목적

* 전체 분야: 메이플스토리
* 이번 글의 구체적인 주제: ${formData.specificTopic || '[직접 입력 / 최신 정보를 조사해 선정]'}
* 글의 목적: ${formData.purpose || '[정보 전달 / 검색 유입 / 사이트 이용 안내 / 문의 유도 등]'}
* 독자가 글을 읽고 얻어야 할 정보: ${formData.readerGain || '[입력]'}
* 독자에게 유도할 행동: ${formData.readerAction}

주제를 직접 지정했다면 해당 주제를 중심으로 작성하세요.

주제 선정을 맡겼다면 현재 시점의 공식 자료와 기존 게시물을 확인하여, 독자에게 도움이 되고 기존 글과 중복되지 않는 주제를 선정하세요.

조사할 주제 후보:

* 최근 정식 서버 업데이트 및 패치
* 진행 중이거나 예정된 이벤트
* 테스트월드 업데이트
* 신규 아이템과 보상
* 보스 관련 변경사항
* 메소 생산·소모 구조에 영향을 주는 변경사항
* 아이템 수요·공급과 가치에 영향을 줄 수 있는 변경사항
* 초보자와 복귀 유저에게 필요한 정보

검색량 자료가 없다면 "검색량이 많다", "검색어 1위"처럼 확인되지 않은 표현은 사용하지 마세요.

## 3. 반드시 포함할 내용

아래 항목은 본문에 자연스럽게 포함하세요.

* ${formData.mustInclude1 || '[필수 내용 1]'}
* ${formData.mustInclude2 || '[필수 내용 2]'}
* ${formData.mustInclude3 || '[필수 내용 3]'}
* 반드시 사용할 문구: ${formData.requiredPhrase}
* 안내할 서비스나 기능: ${formData.serviceInfo}
* 삽입할 링크: ${formData.links}
* 문의 방법: ${formData.contactMethod}

추가 작성 기준:

* 글 앞부분에 핵심 내용을 먼저 요약하세요.
* 독자에게 무엇이 달라지는지, 무엇을 확인하거나 해야 하는지 설명하세요.
* 이벤트 글에는 확인 가능한 참여 대상, 기간, 참여 방법, 주요 보상과 주의사항을 포함하세요.
* 패치 글에는 적용 날짜와 정식 서버·테스트월드 여부를 명확하게 표시하세요.
* 참고한 주요 공식 출처를 본문 하단에 링크로 남기세요.
* 지정된 정보가 확인되지 않으면 임의로 채우지 말고 검토 보고에 표시하세요.

## 4. 제외할 내용

아래 내용은 작성하지 마세요.

* ${formData.exclude1 || '[제외할 내용 1]'}
* ${formData.exclude2 || '[제외할 내용 2]'}
* ${formData.exclude3 || '[제외할 내용 3]'}
* 언급하지 않을 업체·사이트·서비스: ${formData.excludeCompany}
* 제외할 가격·수치·비율: ${formData.excludeNumbers}
* 사용하지 않을 단어·표현: ${formData.excludeWords}

공통 제외 기준:

* 확인되지 않은 소문을 사실처럼 설명하는 내용
* 제공하지 않은 거래 실적, 이용 후기, 회원 수 등
* "무조건 안전", "최고가 보장", "반드시 오른다" 같은 근거 없는 단정
* 경쟁 업체를 비방하거나 근거 없이 비교하는 내용
* 다른 사이트의 문장이나 이미지 무단 복사
* 같은 설명과 키워드의 불필요한 반복
* 주제와 관계없는 홍보 문구와 긴 인사말

필수 내용과 제외 조건이 충돌하면 해당 부분을 질문하세요.

## 5. 자료 조사 및 사실 확인

공식 메이플스토리 홈페이지, 공식 업데이트 공지, 공식 이벤트 안내를 우선 사용하세요.

* 작업 당일의 한국 시간을 기준으로 정보를 확인하세요.
* 공지 게시일과 실제 적용일을 구분하세요.
* 이벤트 참여 기간과 보상 수령 기간이 다르면 각각 표시하세요.
* 테스트월드 내용을 정식 서버에 확정 적용된 것처럼 작성하지 마세요.
* 수정 공지나 후속 공지가 있다면 최신 내용을 반영하세요.
* 커뮤니티 반응은 공식 사실의 근거로 사용하지 마세요.
* 공식적으로 확인된 사실과 작성자의 예상·분석을 구분하세요.
* 메소나 아이템 가치에 대한 분석에는 근거와 불확실성을 함께 설명하세요.
* 확인할 수 없는 날짜, 수치, 패치 버전, 아이템 이름은 추측하지 마세요.

자료에 접근할 수 없다면 접근하지 못한 자료를 확인했다고 말하지 마세요.

## 6. 기존 게시물과 중복 확인

작성 전에 사이트의 해당 카테고리와 관련 게시물을 확인하세요.

* 제목뿐 아니라 주요 내용과 다루는 범위가 겹치는지 확인하세요.
* 같은 주제를 표현만 바꿔 새 글로 만들지 마세요.
* 기존 글 이후의 변경사항을 다룬다면 새롭게 달라진 점을 중심으로 작성하세요.
* 기존 글을 수정하는 편이 적합하다면 이유를 알려주세요. 기존 게시물을 임의로 수정하거나 삭제하지 마세요.
* 기존 게시물을 확인할 수 없다면 중복 검토를 완료했다고 보고하지 마세요.

## 7. 글의 말투·분량·구성

* 말투: ${formData.tone}
* 분량: 공백 포함 약 ${formData.wordCount}자
* 이모지: ${formData.emoji}
* 홍보 강도: ${formData.promotionLevel}

작성 기준:

* 해당 정보를 잘 모르는 사람도 이해할 수 있게 작성하세요.
* 전문 용어는 필요한 경우 짧게 설명하세요.
* 모바일에서 읽기 편하도록 문단을 짧게 나누세요.
* 소제목만 읽어도 글의 흐름을 알 수 있게 구성하세요.
* 중요한 부분에만 굵은 글씨를 사용하세요.
* 비교 항목은 표로, 준비 사항이나 참여 순서는 목록으로 정리하세요.
* 분량을 맞추기 위해 같은 내용을 반복하지 마세요.
* 정보가 적으면 불필요하게 늘리지 마세요.

기본 구성:

1. 내용을 명확하게 보여주는 제목
2. 핵심 요약 3줄
3. 소제목으로 구분한 본문
4. 독자가 확인하거나 해야 할 사항
5. 필요한 경우에만 문의·이용 안내
6. 주요 출처

## 8. 검색 유입 및 태그

* 핵심 키워드: ${formData.coreKeyword || '[직접 입력 / 주제에 맞게 선정]'}
* 보조 키워드: ${formData.subKeyword || '[직접 입력 / 주제에 맞게 선정]'}
* 태그 개수: ${formData.tagCount}

제목은 검색하는 사람이 글의 내용을 바로 이해할 수 있게 작성하세요.

* 핵심 키워드를 제목과 본문에 자연스럽게 포함하세요.
* 클릭을 유도하기 위해 내용을 과장하지 마세요.
* 동일한 키워드를 부자연스럽게 반복하지 마세요.
* 관련 없는 인기 검색어는 넣지 마세요.
* 연도, 날짜, 패치 버전은 필요한 경우에만 정확하게 넣으세요.
* 태그는 실제 본문과 관련된 단어로 작성하세요.
* 사이트에 검색 설명 입력란이 있으면 글의 핵심을 요약한 설명도 작성하세요.
${formData.thumbnailEnabled ? `
## 9. 썸네일 제작

글의 핵심 내용을 한눈에 이해할 수 있는 썸네일 1개를 제작하세요.

* 최종 크기: ${formData.thumbnailSize}
* 비율: ${formData.thumbnailRatio}
* 파일 형식: ${formData.thumbnailFormat}
* 디자인 분위기: ${formData.thumbnailStyle}
* 주요 색상: ${formData.thumbnailColor || '[입력 / 사이트에 맞게 선택]'}
* 필수 문구: ${formData.thumbnailText || '[입력 / 본문에 맞게 선정]'}
* 제외할 요소: ${formData.thumbnailExclude}

제작 기준:

* 작은 화면에서도 핵심 문구가 잘 보여야 합니다.
* 제목 전체를 넣기보다 핵심 내용을 짧게 요약하세요.
* 글자를 크게 배치하고 배경과 충분한 대비를 주세요.
* 가장자리에서 글자가 잘리지 않도록 여백을 확보하세요.
* 메이플스토리 관련 글이라는 점이 직관적으로 드러나게 구성하세요.
* 공식 공지나 공식 제작물로 오해하게 만드는 표현은 피하세요.
* 다른 사이트의 썸네일을 그대로 가져오지 마세요.
* 제작 후 한글 오탈자, 글자 깨짐, 잘림과 최종 파일 크기를 확인하세요.
` : ''}
## 10. 등록 전 검토

관리자 페이지에 등록하기 전에 다음 항목을 확인하고 발견한 오류를 수정하세요.

* 제목과 본문 오탈자
* 필수 내용 포함 여부
* 제외할 내용이 들어갔는지 여부
* 날짜와 패치 버전
* 이벤트 참여·보상 수령 기간
* 아이템, 보스, 이벤트 이름
* 수치와 참여 조건
* 정식 서버와 테스트월드 구분
* 확인된 사실과 예상·분석 구분
* 출처가 실제 서술 내용을 뒷받침하는지
* 링크가 올바른 주소로 연결되는지
* 기존 게시물과의 중복
* 태그의 관련성
* 썸네일 문구와 가독성

핵심 사실을 확인하지 못했다면 게시하지 말고, 확인이 필요한 내용을 알려주세요.

## 11. 관리자 페이지 등록

선택한 작업 범위가 업로드를 포함하는 경우, 새 게시물에 아래 내용을 입력하세요.

* 제목
* 본문
* 썸네일
* 카테고리
* 태그
* 검색 설명과 이미지 대체 텍스트: 지원하는 경우

사이트 편집기에서 정상적으로 표시되는 형식을 사용하세요.

* 소제목, 굵은 글씨, 표, 목록과 줄바꿈을 확인하세요.
* 이미지가 정상적으로 업로드되고 표시되는지 확인하세요.
* 미리보기가 가능하면 모바일 화면도 확인하세요.
* 기존 게시물, 사이트 설정, 디자인과 메뉴는 임의로 변경하지 마세요.
* 같은 게시물을 중복 등록하지 마세요.

## 12. 게시 방식

A. 최종 게시 전 확인

* 글 작성, 썸네일 제작, 검토와 관리자 페이지 입력까지 완료하세요.
* 초안 저장 기능이 있으면 초안으로 저장하세요.
* 최종 공개 게시 버튼은 누르지 마세요.
* 검토할 글과 썸네일, 가능하면 초안 또는 미리보기 링크를 제시한 뒤 게시 여부를 확인받으세요.
* 초안 저장 기능이 없다면 현재 입력 상태와 저장 여부를 정확히 알려주세요.

B. 검토 후 바로 게시

* 검토를 완료하고 문제가 없으면 공개 게시하세요.
* 게시 후 실제 페이지를 열어 제목, 본문, 썸네일과 표시 상태를 확인하세요.
* 정상 게시를 확인한 뒤 게시물 주소를 알려주세요.

별도 선택이 없으면 A 방식으로 진행하세요.

## 13. 작업 완료 보고

작업이 끝나면 아래 내용을 간단하게 보고하세요.

* 작성한 글 제목
* 선정한 주제와 이유
* 사용한 주요 출처
* 썸네일 문구
* 검토 결과와 확인하지 못한 항목
* 게시 상태: 작성 완료 / 관리자 입력 완료 / 초안 저장 / 공개 게시 완료
* 초안·미리보기·게시물 주소: 있는 경우

실제로 수행한 단계만 완료했다고 보고하세요. 로그인, 권한 또는 사이트 오류로 작업이 막히면 중단된 단계와 해결에 필요한 사항을 정확히 알려주세요.`;
  };

  const handleCopyPrompt = () => {
    const prompt = generatePrompt();
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const updateFormData = (field: keyof PromptFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: '#FFFFFF',
          padding: '48px',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '8px',
            textAlign: 'center',
            color: '#1F2937'
          }}>
            🔒 관리자 페이지
          </h1>
          <p style={{
            textAlign: 'center',
            color: '#6B7280',
            marginBottom: '32px',
            fontSize: '14px'
          }}>
            비밀번호를 입력하세요
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '16px',
                marginBottom: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />

            {error && (
              <p style={{
                color: '#EF4444',
                fontSize: '14px',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F3F4F6',
      padding: '20px'
    }}>
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' }}>
              {activeTab === 'bookmarks' ? '📚 즐겨찾기' : '✏️ 프롬프트 제작'}
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
              {activeTab === 'bookmarks'
                ? '북마크 추가/삭제는 코드를 직접 수정하세요'
                : '질문에 대한 답변을 입력하고 프롬프트를 생성하세요'}
            </p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            style={{
              padding: '8px 16px',
              background: '#EF4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            로그아웃
          </button>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setActiveTab('bookmarks')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'bookmarks' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#FFFFFF',
              color: activeTab === 'bookmarks' ? 'white' : '#6B7280',
              border: activeTab === 'bookmarks' ? 'none' : '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            📚 즐겨찾기
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'prompt' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#FFFFFF',
              color: activeTab === 'prompt' ? 'white' : '#6B7280',
              border: activeTab === 'prompt' ? 'none' : '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ✏️ 프롬프트 제작
          </button>
        </div>

        {activeTab === 'bookmarks' ? (
          <div style={{
            background: '#FFFFFF',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1F2937' }}>
              전체 북마크 ({BOOKMARKS.length})
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {BOOKMARKS.map((bookmark) => (
                <div
                  key={bookmark.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: '#1F2937' }}>
                      {bookmark.name}
                    </h3>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#667eea',
                        fontSize: '12px',
                        textDecoration: 'none',
                        wordBreak: 'break-all',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '4px'
                      }}
                    >
                      {bookmark.url}
                    </a>
                    <p style={{
                      fontSize: '11px',
                      color: visitHistory[bookmark.id] ? '#10B981' : '#9CA3AF',
                      margin: 0
                    }}>
                      🕒 {formatLastVisited(bookmark.id)}
                    </p>
                  </div>

                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleVisit(bookmark.id)}
                    style={{
                      padding: '8px',
                      background: '#10B981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    방문
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            background: '#FFFFFF',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1F2937' }}>
                웹사이트 콘텐츠 조사·작성·썸네일 제작·업로드 요청
              </h2>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                아래 질문에 답변을 입력하면 자동으로 프롬프트가 생성됩니다.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* 1. 사이트 및 작업 정보 */}
              <div style={{ borderBottom: '2px solid #F3F4F6', paddingBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1F2937' }}>
                  1. 사이트 및 작업 정보
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <SelectField
                    label="사이트 주소"
                    value={formData.siteUrl}
                    onChange={(v) => updateFormData('siteUrl', v)}
                    options={[
                      '선택하세요',
                      'https://www.maplehub.co.kr',
                      'https://www.메이플급처.com',
                      'https://maplesayo.com',
                      'https://www.maplestoryitem.com',
                      'https://mapleitem.co.kr/',
                      'https://www.maplediscord.com',
                      'https://maplesam.co.kr/'
                    ]}
                  />
                  <InputField label="관리자 페이지 주소" value={formData.adminUrl} onChange={(v) => updateFormData('adminUrl', v)} />
                  <InputField label="게시판/카테고리" value={formData.category} onChange={(v) => updateFormData('category', v)} />
                  <InputField label="코드 위치 (파일 경로)" value={formData.codeLocation} onChange={(v) => updateFormData('codeLocation', v)} placeholder="예: /app/notice/page.tsx" />
                  <SelectField
                    label="사이트 성격"
                    value={formData.siteType}
                    onChange={(v) => updateFormData('siteType', v)}
                    options={['메이플스토리 정보 제공', '아이템 매입 안내', '커뮤니티']}
                  />
                  <SelectField
                    label="주요 독자"
                    value={formData.targetAudience}
                    onChange={(v) => updateFormData('targetAudience', v)}
                    options={['메이플스토리 초보자', '복귀 유저', '기존 유저']}
                  />
                  <InputField label="작성할 게시물 수" value={formData.postCount} onChange={(v) => updateFormData('postCount', v)} />
                  <SelectField
                    label="작업 범위"
                    value={formData.workScope}
                    onChange={(v) => updateFormData('workScope', v)}
                    options={['글 작성만', '글과 썸네일 제작', '관리자 페이지 등록까지']}
                  />
                  <SelectField
                    label="게시 방식"
                    value={formData.publishMethod}
                    onChange={(v) => updateFormData('publishMethod', v)}
                    options={['A. 최종 게시 전 확인받기', 'B. 검토 후 바로 게시']}
                  />
                </div>
              </div>

              {/* 2. 글 주제와 목적 */}
              <div style={{ borderBottom: '2px solid #F3F4F6', paddingBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1F2937' }}>
                  2. 글 주제와 목적
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <SelectField
                    label="글 유형"
                    value={formData.contentType}
                    onChange={(v) => updateFormData('contentType', v)}
                    options={['일반 정보', '이벤트·패치', '홍보·참여 안내']}
                  />
                  <InputField label="이번 글의 구체적인 주제" value={formData.specificTopic} onChange={(v) => updateFormData('specificTopic', v)} placeholder="직접 입력 / 최신 정보를 조사해 선정" />
                  <InputField label="글의 목적" value={formData.purpose} onChange={(v) => updateFormData('purpose', v)} placeholder="정보 전달 / 검색 유입 / 사이트 이용 안내 / 문의 유도 등" />
                  <InputField label="독자가 글을 읽고 얻어야 할 정보" value={formData.readerGain} onChange={(v) => updateFormData('readerGain', v)} />
                  <SelectField
                    label="독자에게 유도할 행동"
                    value={formData.readerAction}
                    onChange={(v) => updateFormData('readerAction', v)}
                    options={['없음', '관련 글 보기', '디스코드 참여', '문의']}
                  />
                </div>
              </div>

              {/* 3. 반드시 포함할 내용 */}
              <div style={{ borderBottom: '2px solid #F3F4F6', paddingBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1F2937' }}>
                  3. 반드시 포함할 내용
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <InputField label="필수 내용 1" value={formData.mustInclude1} onChange={(v) => updateFormData('mustInclude1', v)} />
                  <InputField label="필수 내용 2" value={formData.mustInclude2} onChange={(v) => updateFormData('mustInclude2', v)} />
                  <InputField label="필수 내용 3" value={formData.mustInclude3} onChange={(v) => updateFormData('mustInclude3', v)} />
                  <InputField label="반드시 사용할 문구" value={formData.requiredPhrase} onChange={(v) => updateFormData('requiredPhrase', v)} />
                  <InputField label="안내할 서비스나 기능" value={formData.serviceInfo} onChange={(v) => updateFormData('serviceInfo', v)} />
                  <InputField label="삽입할 링크" value={formData.links} onChange={(v) => updateFormData('links', v)} />
                  <InputField label="문의 방법" value={formData.contactMethod} onChange={(v) => updateFormData('contactMethod', v)} />
                </div>
              </div>

              {/* 4. 제외할 내용 */}
              <div style={{ borderBottom: '2px solid #F3F4F6', paddingBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1F2937' }}>
                  4. 제외할 내용
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <InputField label="제외할 내용 1" value={formData.exclude1} onChange={(v) => updateFormData('exclude1', v)} />
                  <InputField label="제외할 내용 2" value={formData.exclude2} onChange={(v) => updateFormData('exclude2', v)} />
                  <InputField label="제외할 내용 3" value={formData.exclude3} onChange={(v) => updateFormData('exclude3', v)} />
                  <InputField label="언급하지 않을 업체·사이트·서비스" value={formData.excludeCompany} onChange={(v) => updateFormData('excludeCompany', v)} />
                  <InputField label="제외할 가격·수치·비율" value={formData.excludeNumbers} onChange={(v) => updateFormData('excludeNumbers', v)} />
                  <InputField label="사용하지 않을 단어·표현" value={formData.excludeWords} onChange={(v) => updateFormData('excludeWords', v)} />
                </div>
              </div>

              {/* 5. 문체·분량·키워드 */}
              <div style={{ borderBottom: '2px solid #F3F4F6', paddingBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1F2937' }}>
                  5. 문체·분량·키워드
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <SelectField
                    label="말투"
                    value={formData.tone}
                    onChange={(v) => updateFormData('tone', v)}
                    options={['친근한 존댓말', '담백한 정보 전달', '공식 안내문']}
                  />
                  <InputField label="분량 (예: 1,500~2,000)" value={formData.wordCount} onChange={(v) => updateFormData('wordCount', v)} />
                  <SelectField
                    label="이모지"
                    value={formData.emoji}
                    onChange={(v) => updateFormData('emoji', v)}
                    options={['사용하지 않음', '필요한 곳에 소량 사용']}
                  />
                  <InputField label="핵심 키워드" value={formData.coreKeyword} onChange={(v) => updateFormData('coreKeyword', v)} placeholder="직접 입력 / 주제에 맞게 선정" />
                  <InputField label="보조 키워드" value={formData.subKeyword} onChange={(v) => updateFormData('subKeyword', v)} placeholder="직접 입력 / 주제에 맞게 선정" />
                  <InputField label="태그 개수" value={formData.tagCount} onChange={(v) => updateFormData('tagCount', v)} />
                </div>
              </div>

              {/* 6. 썸네일 제작 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: 0 }}>
                    6. 썸네일 제작
                  </h3>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: formData.thumbnailEnabled ? '#10B981' : '#6B7280' }}>
                      {formData.thumbnailEnabled ? 'ON' : 'OFF'}
                    </span>
                    <div
                      onClick={() => updateFormData('thumbnailEnabled', !formData.thumbnailEnabled)}
                      style={{
                        width: '48px',
                        height: '24px',
                        borderRadius: '12px',
                        background: formData.thumbnailEnabled ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#D1D5DB',
                        position: 'relative',
                        transition: 'background 0.3s',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: '2px',
                        left: formData.thumbnailEnabled ? '26px' : '2px',
                        transition: 'left 0.3s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }} />
                    </div>
                  </label>
                </div>
                <div style={{ display: 'grid', gap: '12px', opacity: formData.thumbnailEnabled ? 1 : 0.5, pointerEvents: formData.thumbnailEnabled ? 'auto' : 'none' }}>
                  <InputField
                    label="썸네일 이미지 경로"
                    value={formData.thumbnailPath}
                    onChange={(v) => updateFormData('thumbnailPath', v)}
                    placeholder="예: /images/thumbnail.png 또는 https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* 복사 버튼 */}
              <div style={{
                position: 'sticky',
                bottom: '20px',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '20px',
                borderTop: '2px solid #F3F4F6'
              }}>
                <button
                  onClick={handleCopyPrompt}
                  style={{
                    padding: '14px 32px',
                    background: copied ? '#10B981' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  {copied ? '✓ 복사 완료!' : '📋 프롬프트 복사하기'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
            ← 홈으로 돌아가기
          </a>
        </div>
      </main>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function InputField({ label, value, onChange, placeholder }: InputFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: '10px 12px',
          border: '1px solid #E5E7EB',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#111827',
          fontWeight: '500',
          outline: 'none',
          transition: 'border-color 0.2s'
        }}
        onFocus={(e) => e.target.style.borderColor = '#667eea'}
        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '10px 12px',
          border: '1px solid #E5E7EB',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#111827',
          fontWeight: '500',
          outline: 'none',
          transition: 'border-color 0.2s',
          cursor: 'pointer',
          background: 'white'
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
        onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
