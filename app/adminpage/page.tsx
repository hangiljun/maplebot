'use client';

import { useEffect, useState } from 'react';

type ChoiceKey = 'site' | 'category' | 'audience' | 'scope' | 'publish' | 'type' | 'topic' | 'purpose' | 'action' | 'tone' | 'length' | 'tags';
type Choices = Record<ChoiceKey, string>;
type Extras = { adminUrl: string; include: string; exclude: string; link: string; referenceUrl: string; keyword: string; notes: string; thumbnailText: string; thumbnailSource: string };
type ThumbnailMode = '제작 안 함' | '새 썸네일 제작' | '기존 이미지 사용';
type ThumbnailSettings = { mode: ThumbnailMode; size: string; sizeCustom: string; style: string; styleCustom: string };

const CUSTOM = '직접 작성';
const sites = [
  'https://www.maplehub.co.kr',
  'https://www.메이플급처.com',
  'https://maplesayo.com',
  'https://www.maplestoryitem.com',
  'https://mapleitem.co.kr/',
  'https://www.maplediscord.com',
  'https://maplesam.co.kr/',
];
const bookmarks = [
  { name: '메이플 허브', url: sites[0] },
  { name: '한글메이플 급처', url: sites[1] },
  { name: '메이플 사요', url: sites[2] },
  { name: '메이플스토리 아이템', url: sites[3] },
  { name: '메이플 아이템', url: sites[4] },
  { name: '메이플디스코드', url: sites[5] },
  { name: '메이플샘', url: sites[6] },
];

const initialChoices: Choices = {
  site: '', category: '사이트에 맞게 선택', audience: '메이플스토리 이용자',
  scope: '글 작성만', publish: '초안 저장 후 확인받기', type: '일반 정보',
  topic: '최신 정보를 조사해 주제 선정', purpose: '정확한 정보 전달', action: '없음',
  tone: '친근한 존댓말', length: '보통 (1,500~2,000자)', tags: '관련 태그 5개 이내',
};
const initialExtras: Extras = { adminUrl: '', include: '', exclude: '', link: '', referenceUrl: '', keyword: '', notes: '', thumbnailText: '', thumbnailSource: '' };

const options: Record<ChoiceKey, string[]> = {
  site: sites,
  category: ['사이트에 맞게 선택', '공지사항', '이벤트', '업데이트', '가이드', '블로그'],
  audience: ['메이플스토리 이용자', '초보자', '복귀 유저', '기존 유저', '아이템 거래 이용자'],
  scope: ['글 작성만', '관리자 페이지에 초안 등록까지', '관리자 페이지에 공개 게시까지'],
  publish: ['초안 저장 후 확인받기', '검토 후 바로 게시'],
  type: ['일반 정보', '이벤트·패치', '가이드·공략', '홍보·참여 안내'],
  topic: ['최신 정보를 조사해 주제 선정', '진행 중인 이벤트', '최근 업데이트·패치', '초보자·복귀 유저 가이드', '아이템·메소 관련 정보'],
  purpose: ['정확한 정보 전달', '검색 유입', '사이트 이용 안내', '이벤트 참여 안내', '문의 유도'],
  action: ['없음', '관련 글 보기', '사이트 기능 이용', '디스코드 참여', '문의하기'],
  tone: ['친근한 존댓말', '담백한 정보 전달', '공식 안내문'],
  length: ['간단히 (800~1,200자)', '보통 (1,500~2,000자)', '자세히 (2,500~3,500자)'],
  tags: ['태그 없이', '관련 태그 5개 이내', '관련 태그 10개 이내'],
};
const labels: Record<ChoiceKey, string> = {
  site: '사이트', category: '게시판 / 카테고리', audience: '주요 독자', scope: '작업 범위',
  publish: '게시 방식', type: '글 유형', topic: '주제', purpose: '글의 목적',
  action: '독자에게 유도할 행동', tone: '말투', length: '분량', tags: '태그',
};

function ChoiceField({ label, id, value, customValue, onChoice, onCustom }: {
  label: string; id: ChoiceKey; value: string; customValue: string;
  onChoice: (value: string) => void; onCustom: (value: string) => void;
}) {
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    <select id={id} value={value} onChange={event => onChoice(event.target.value)}>
      {id === 'site' && <option value="">사이트를 선택하세요</option>}
      {options[id].map(option => <option key={option} value={option}>{id === 'site' ? `${bookmarks.find(bookmark => bookmark.url === option)?.name} · ${option}` : option}</option>)}
      <option value={CUSTOM}>{CUSTOM}</option>
    </select>
    {value === CUSTOM && <input aria-label={`${label} 직접 작성`} value={customValue} onChange={event => onCustom(event.target.value)} placeholder={`${label}을 입력하세요`} />}
  </div>;
}

function ThumbnailSelect({ id, label, value, customValue, options, onChoice, onCustom }: {
  id: string; label: string; value: string; customValue: string; options: string[];
  onChoice: (value: string) => void; onCustom: (value: string) => void;
}) {
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    <select id={id} value={value} onChange={event => onChoice(event.target.value)}>
      {options.map(option => <option key={option}>{option}</option>)}
      <option value={CUSTOM}>{CUSTOM}</option>
    </select>
    {value === CUSTOM && <input aria-label={`${label} 직접 작성`} value={customValue} onChange={event => onCustom(event.target.value)} placeholder={`${label}을 입력하세요`} />}
  </div>;
}

function makePrompt(choices: Choices, custom: Record<ChoiceKey, string>, extras: Extras, thumbnail: ThumbnailSettings) {
  const get = (key: ChoiceKey) => (choices[key] === CUSTOM ? custom[key].trim() : choices[key]);
  const site = get('site');
  const scope = get('scope');
  const contentType = get('type');
  const topic = get('topic');
  const eventRelated = contentType.includes('이벤트') || topic.includes('이벤트');
  const uploads = scope.includes('관리자 페이지') || scope.includes('등록') || scope.includes('게시');
  const publish = scope.includes('공개 게시') ? '검토 후 바로 게시' : get('publish');
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
  lines.push('', '## 작성 기준',
    '- 작업하는 날의 한국 시간을 기준으로 공식 자료의 최신 수정 내용까지 확인하세요.',
    '- 공식 자료의 내용과 사이트의 기존 게시물을 대조하고, 출처의 제목과 원문 링크를 글 끝에 남기세요.',
    '- 공지 게시일과 실제 적용일을 구분하세요.',
    '- 테스트월드 정보를 정식 서버에 확정된 내용처럼 쓰지 마세요.',
    '- 확인되지 않은 수치·후기·보장 표현을 만들지 마세요.',
    '- 선택한 사이트의 기능이나 혜택은 실제 페이지에서 확인한 것만 소개하세요.',
    '- 제목, 핵심 요약, 소제목이 있는 본문, 필요한 출처 순서로 작성하세요.',
    '- 정보가 부족하면 분량을 채우기 위해 같은 내용을 반복하지 마세요.',
  );
  if (eventRelated) lines.push('- 이벤트 글에는 참여 대상, 참여 기간, 참여 방법, 주요 보상, 주의 사항을 확인해 넣고 참여 기간과 보상 수령 기간을 구분하세요.');
  if (contentType.includes('가이드') && eventRelated) lines.push('- 이번 글은 이벤트 소식 나열보다 독자가 따라 할 수 있는 참여 가이드에 초점을 맞추세요.');
  if (get('action') === '사이트 기능 이용') lines.push('- 사이트 기능 이용 안내는 글의 주제와 직접 관련된 실제 기능이 확인된 경우에만 넣으세요.');
  if (get('topic') === '최신 정보를 조사해 주제 선정') lines.push('- 현재 시점의 공식 자료와 기존 글을 확인해 중복되지 않는 주제를 고르세요.');
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
  if (uploads) lines.push('', '## 관리자 페이지 등록',
    '- 로그인 상태와 권한을 확인하고, 제목·본문·카테고리·태그를 입력하세요.',
    '- 기존 글과 내용이 중복되는지 확인하고 미리보기에서 표시 상태를 점검하세요.',
    publish === '검토 후 바로 게시'
      ? '- 검토가 끝나고 문제가 없으면 공개 게시한 뒤 실제 게시물 주소를 알려주세요.'
      : '- 초안으로 저장하고 글과 미리보기 주소를 보여준 뒤 최종 게시 여부를 확인받으세요.',
  );
  lines.push('', '## 완료 보고',
    '- 작성한 글 제목, 사용한 주요 출처, 확인하지 못한 내용을 간단히 알려주세요.',
    ...(thumbnail.mode === '제작 안 함' ? [] : ['- 썸네일 파일 경로와 실제 등록 여부를 알려주세요.']),
    uploads ? '- 초안 또는 게시 상태와 해당 주소를 알려주세요.' : '- 완성한 글을 제시하세요.',
    '- 실제로 수행하지 않은 단계는 완료했다고 말하지 마세요.');
  return lines.join('\n');
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<'prompt' | 'bookmarks'>('prompt');
  const [visits, setVisits] = useState<Record<string, string>>({});
  const [choices, setChoices] = useState<Choices>(initialChoices);
  const [custom, setCustom] = useState<Record<ChoiceKey, string>>({ site: '', category: '', audience: '', scope: '', publish: '', type: '', topic: '', purpose: '', action: '', tone: '', length: '', tags: '' });
  const [extras, setExtras] = useState<Extras>(initialExtras);
  const [thumbnail, setThumbnail] = useState<ThumbnailSettings>({ mode: '제작 안 함', size: '가로형 1280×720', sizeCustom: '', style: '사이트 분위기에 맞게', styleCustom: '' });
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');

  useEffect(() => {
    if (!authenticated) return;
    fetch('/api/bookmark-visits').then(response => response.json()).then(data => setVisits(data)).catch(() => {});
  }, [authenticated]);

  const updateChoice = (key: ChoiceKey, value: string) => setChoices(previous => ({ ...previous, [key]: value }));
  const updateCustom = (key: ChoiceKey, value: string) => setCustom(previous => ({ ...previous, [key]: value }));
  const updateExtra = (key: keyof Extras, value: string) => setExtras(previous => ({ ...previous, [key]: value }));
  const updateThumbnail = <K extends keyof ThumbnailSettings>(key: K, value: ThumbnailSettings[K]) => setThumbnail(previous => ({ ...previous, [key]: value }));
  const prompt = makePrompt(choices, custom, extras, thumbnail);
  const selectedScope = choices.scope === CUSTOM ? custom.scope.trim() : choices.scope;
  const uploads = selectedScope.includes('관리자 페이지') || selectedScope.includes('등록') || selectedScope.includes('게시');

  async function copyPrompt() {
    if (!choices.site || (choices.site === CUSTOM && !custom.site.trim())) {
      setCopyError('사이트를 먼저 선택하거나 주소를 입력하세요.');
      return;
    }
    const missingCustom = (Object.keys(choices) as ChoiceKey[]).find(key => choices[key] === CUSTOM && !custom[key].trim() && (key !== 'publish' || uploads));
    if (missingCustom) {
      setCopyError(`${labels[missingCustom]}의 직접 작성 내용을 입력하세요.`);
      return;
    }
    if (thumbnail.mode === '새 썸네일 제작' && ((thumbnail.size === CUSTOM && !thumbnail.sizeCustom.trim()) || (thumbnail.style === CUSTOM && !thumbnail.styleCustom.trim()))) {
      setCopyError('썸네일 크기와 디자인 분위기의 직접 작성 내용을 입력하세요.');
      return;
    }
    if (thumbnail.mode === '기존 이미지 사용' && !extras.thumbnailSource.trim()) {
      setCopyError('사용할 이미지의 파일 경로나 URL을 입력하세요.');
      return;
    }
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setCopyError('');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError('복사할 수 없습니다. 아래 미리보기에서 직접 복사해 주세요.');
    }
  }

  function visit(index: number) {
    setVisits(previous => ({ ...previous, [String(index + 1)]: new Date().toISOString() }));
    fetch('/api/bookmark-visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookmarkId: String(index + 1) }) }).catch(() => {});
  }

  return <div className="page">
    <style>{`
      .page{min-height:100vh;background:#f5f7fc;color:#18213c;font-family:Arial,'Malgun Gothic',sans-serif;padding:96px 20px 64px}
      .wrap{max-width:1120px;margin:auto}.top{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:24px}
      h1{font-size:30px;letter-spacing:-.04em;margin:0 0 8px}h2{font-size:19px;letter-spacing:-.03em;margin:0 0 5px}h3{font-size:16px;margin:0 0 15px}
      p{margin:0;color:#63708b;line-height:1.6}.eyebrow{color:#6154bc;font-weight:800;font-size:12px;letter-spacing:.1em;margin-bottom:7px}
      .tabs{display:flex;gap:8px;margin-bottom:20px}.tabs button,.copy{border:0;border-radius:10px;padding:11px 16px;font-weight:700;cursor:pointer}
      .tabs button{background:#e9ecf5;color:#53607b}.tabs button.active{background:#5947bb;color:white}
      .grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(300px,.85fr);gap:20px;align-items:start}
      .card{background:white;border:1px solid #e5e9f3;border-radius:16px;box-shadow:0 8px 28px rgba(33,39,87,.05);padding:24px}
      .section{padding:22px 0;border-bottom:1px solid #e9ecf3}.section:last-child{border:0;padding-bottom:0}.section:first-child{padding-top:0}
      .fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.field{display:flex;flex-direction:column;gap:7px;min-width:0}.field.wide{grid-column:1/-1}
      label{font-size:13px;font-weight:700;color:#35415d}input,select,textarea{width:100%;border:1px solid #dce2ed;border-radius:9px;background:#fff;padding:11px 12px;font:inherit;font-size:14px;color:#1c2946;box-sizing:border-box}
      textarea{resize:vertical;min-height:76px}input:focus-visible,select:focus-visible,textarea:focus-visible,button:focus-visible,a:focus-visible{outline:3px solid #a499ed;outline-offset:2px}
      .hint{font-size:12px;color:#77839a;margin-top:4px}.preview{position:sticky;top:20px}.preview pre{white-space:pre-wrap;word-break:break-word;font:13px/1.65 Consolas,'Malgun Gothic',monospace;background:#f7f8fd;border:1px solid #e8eaf5;border-radius:10px;padding:16px;max-height:65vh;overflow:auto;color:#273250}
      .copy{background:#5947bb;color:white;width:100%;font-size:15px}.copy:hover{background:#4734a7}.error{color:#b4233a;font-size:13px;margin-top:9px}
      .bookmarks{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}.bookmark{display:flex;flex-direction:column;gap:10px}.bookmark a{color:#5947bb;font-weight:700;text-decoration:none}.bookmark small{color:#6c7890}
      .login{max-width:390px;margin:12vh auto}.login input{margin:20px 0 12px}.home{display:inline-block;margin-top:20px;color:#5947bb;text-decoration:none;font-weight:700}
      @media(max-width:800px){.grid{grid-template-columns:1fr}.preview{position:static}.preview pre{max-height:420px}}@media(max-width:520px){.page{padding:78px 14px 45px}.card{padding:18px}.fields{grid-template-columns:1fr}.top{display:block}h1{font-size:25px}}
    `}</style>
    {!authenticated ? <div className="card login">
      <div className="eyebrow">MAPLEBOT ADMIN</div><h1>관리자 페이지</h1><p>비밀번호를 입력하세요.</p>
      <form onSubmit={event => { event.preventDefault(); if (password === 'rlfwns55') { setAuthenticated(true); setLoginError(''); } else setLoginError('비밀번호가 올바르지 않습니다.'); }}>
        <input type="password" aria-label="비밀번호" value={password} onChange={event => setPassword(event.target.value)} />
        <button className="copy" type="submit">로그인</button>{loginError && <div className="error" role="alert">{loginError}</div>}
      </form>
    </div> : <main className="wrap">
      <header className="top"><div><div className="eyebrow">MAPLEBOT ADMIN</div><h1>콘텐츠 작업 요청 만들기</h1><p>사이트와 글의 방향을 고른 뒤, 완성된 요청을 복사해 AI에게 보내세요.</p></div></header>
      <nav className="tabs" aria-label="관리자 메뉴"><button className={tab === 'prompt' ? 'active' : ''} onClick={() => setTab('prompt')}>프롬프트 제작</button><button className={tab === 'bookmarks' ? 'active' : ''} onClick={() => setTab('bookmarks')}>즐겨찾기</button></nav>
      {tab === 'bookmarks' ? <div className="bookmarks">{bookmarks.map((bookmark, index) => <div className="card bookmark" key={bookmark.url}><h2>{bookmark.name}</h2><small>{visits[String(index + 1)] ? `마지막 방문 ${new Date(visits[String(index + 1)]).toLocaleString('ko-KR')}` : '방문 기록 없음'}</small><a href={bookmark.url} target="_blank" rel="noopener noreferrer" onClick={() => visit(index)}>사이트 방문 ↗</a></div>)}</div> : <div className="grid">
        <div className="card">
          <section className="section"><h3>1. 사이트와 작업</h3><div className="fields">
            {(['site','scope','category','audience'] as ChoiceKey[]).map(key => <ChoiceField key={key} id={key} label={labels[key]} value={choices[key]} customValue={custom[key]} onChoice={value => updateChoice(key,value)} onCustom={value => updateCustom(key,value)} />)}
            {uploads && <><div className="field"><label htmlFor="adminUrl">관리자 페이지 주소</label><input id="adminUrl" value={extras.adminUrl} onChange={event => updateExtra('adminUrl',event.target.value)} placeholder="알고 있다면 입력" /></div>{choices.scope === CUSTOM && <ChoiceField id="publish" label="게시 방식" value={choices.publish} customValue={custom.publish} onChoice={value => updateChoice('publish',value)} onCustom={value => updateCustom('publish',value)} />}</>}
          </div></section>
          <section className="section"><h3>2. 글의 방향</h3><div className="fields">{(['type','topic','purpose','action'] as ChoiceKey[]).map(key => <ChoiceField key={key} id={key} label={labels[key]} value={choices[key]} customValue={custom[key]} onChoice={value => updateChoice(key,value)} onCustom={value => updateCustom(key,value)} />)}</div></section>
          <section className="section"><h3>3. 작성 스타일</h3><div className="fields">{(['tone','length','tags'] as ChoiceKey[]).map(key => <ChoiceField key={key} id={key} label={labels[key]} value={choices[key]} customValue={custom[key]} onChoice={value => updateChoice(key,value)} onCustom={value => updateCustom(key,value)} />)}<div className="field"><label htmlFor="keyword">핵심 키워드</label><input id="keyword" value={extras.keyword} onChange={event => updateExtra('keyword',event.target.value)} placeholder="없으면 AI가 주제에 맞게 선정" /></div></div></section>
          <section className="section"><h3>4. 썸네일</h3><p className="hint">필요할 때만 선택하세요. 이 화면은 제작 요청을 만들며 이미지 자체는 AI에게 요청한 뒤 생성됩니다.</p><div className="fields" style={{marginTop:14}}>
            <div className="field wide"><label htmlFor="thumbnailMode">썸네일 방식</label><select id="thumbnailMode" value={thumbnail.mode} onChange={event => updateThumbnail('mode', event.target.value as ThumbnailMode)}><option>제작 안 함</option><option>새 썸네일 제작</option><option>기존 이미지 사용</option></select></div>
            {thumbnail.mode === '새 썸네일 제작' && <>
              <ThumbnailSelect id="thumbnailSize" label="이미지 크기" value={thumbnail.size} customValue={thumbnail.sizeCustom} options={['가로형 1280×720', '정사각형 1080×1080', '사이트 권장 크기에 맞게']} onChoice={value => updateThumbnail('size', value)} onCustom={value => updateThumbnail('sizeCustom', value)} />
              <ThumbnailSelect id="thumbnailStyle" label="디자인 분위기" value={thumbnail.style} customValue={thumbnail.styleCustom} options={['사이트 분위기에 맞게', '간결한 정보형', '밝고 활기찬 스타일', '게임 공지형']} onChoice={value => updateThumbnail('style', value)} onCustom={value => updateThumbnail('styleCustom', value)} />
              <div className="field wide"><label htmlFor="thumbnailText">이미지에 넣을 문구</label><input id="thumbnailText" value={extras.thumbnailText} onChange={event => updateExtra('thumbnailText', event.target.value)} placeholder="비워두면 글에 맞는 짧은 문구를 AI가 선정" /></div>
            </>}
            {thumbnail.mode === '기존 이미지 사용' && <div className="field wide"><label htmlFor="thumbnailSource">이미지 파일 경로 또는 URL</label><input id="thumbnailSource" value={extras.thumbnailSource} onChange={event => updateExtra('thumbnailSource', event.target.value)} placeholder="AI가 접근할 수 있는 파일 경로 또는 이미지 주소" /></div>}
            {thumbnail.mode !== '제작 안 함' && <p className="hint field wide">{uploads ? '선택한 사이트에서 이미지 업로드가 가능하면 글과 함께 등록하도록 요청합니다. 불가능하면 파일과 사유를 보고하게 됩니다.' : '현재 작업 범위는 글 작성만입니다. 썸네일 파일은 만들거나 확인하되 사이트에는 등록하지 않습니다.'}</p>}
          </div></section>
          <section className="section"><h3>5. 추가 요청</h3><p className="hint">선택지에 없는 내용만 적어 주세요. 빈 항목은 요청문에서 빠집니다.</p><div className="fields" style={{marginTop:14}}><div className="field wide"><label htmlFor="include">반드시 포함할 내용</label><textarea id="include" value={extras.include} onChange={event => updateExtra('include',event.target.value)} /></div><div className="field wide"><label htmlFor="exclude">제외할 내용</label><textarea id="exclude" value={extras.exclude} onChange={event => updateExtra('exclude',event.target.value)} /></div><div className="field wide"><label htmlFor="referenceUrl">추가 참고 자료 URL</label><input id="referenceUrl" value={extras.referenceUrl} onChange={event => updateExtra('referenceUrl',event.target.value)} placeholder="공식 공지나 직접 확인할 자료가 있다면 입력" /></div><div className="field wide"><label htmlFor="link">본문에 넣을 링크</label><input id="link" value={extras.link} onChange={event => updateExtra('link',event.target.value)} /></div><div className="field wide"><label htmlFor="notes">추가 요청</label><textarea id="notes" value={extras.notes} onChange={event => updateExtra('notes',event.target.value)} /></div></div></section>
        </div>
        <aside className="card preview"><h2>AI에게 보낼 요청</h2><p>선택을 바꾸면 내용이 바로 갱신됩니다.</p><pre>{prompt}</pre><button className="copy" type="button" onClick={copyPrompt}>{copied ? '복사 완료' : '프롬프트 복사하기'}</button>{copyError && <div className="error" role="alert">{copyError}</div>}</aside>
      </div>}
      <a className="home" href="/">← 홈으로 돌아가기</a>
    </main>}
  </div>;
}

