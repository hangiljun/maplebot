'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowLeft, ArrowRight, Bookmark, Check, CheckCheck, ChevronRight, Copy, FileText, FolderOpen, Image as ImageIcon, LogOut, Plus, RotateCcw, Search, Settings2, Sparkles, X } from 'lucide-react';
import { bookmarks, CUSTOM, initialChoices, initialExtras, labels, makePrompt, options, type ChoiceKey, type Choices, type Extras, type ThumbnailSettings } from './model';
import './studio.css';

type Draft = { choices: Choices; custom: Choices; extras: Extras; thumbnail: ThumbnailSettings; preset: string };
type Saved = { id: string; name: string; date: string; draft: Draft };
const STORAGE = 'maplebot-content-studio-v1';
const LIBRARY = `${STORAGE}-library`;
const PRESETS = [
  { id: 'guide', icon: '↗', title: '따라 하는 가이드', desc: '초보·복귀 유저가 바로 실행할 수 있는 글', type: '가이드·공략', topic: '초보자·복귀 유저 가이드', purpose: '정확한 정보 전달', audience: '초보자', category: '가이드', sample: '복귀 유저를 위한 첫 일주일 성장 순서', include: '시작 전 준비물, 단계별 진행 순서, 자주 하는 실수, 마지막 체크리스트' },
  { id: 'event', icon: '✳', title: '이벤트 안내', desc: '기간과 참여 방법, 보상을 한 번에 정리', type: '이벤트 안내', topic: '진행 중인 이벤트', purpose: '이벤트 참여 안내', audience: '메이플스토리 이용자', category: '이벤트', sample: '현재 진행 중인 이벤트의 참여 방법과 보상 정리', include: '참여 조건, 시작·종료 시각, 참여 방법, 주요 보상, 보상 수령 기한' },
  { id: 'patch', icon: '≋', title: '업데이트 해설', desc: '달라진 점과 유저가 확인할 일을 설명', type: '업데이트·패치', topic: '최근 업데이트·패치', purpose: '정확한 정보 전달', audience: '기존 유저', category: '업데이트', sample: '최근 정식 서버 업데이트에서 달라진 점과 확인할 사항', include: '적용일, 주요 변경점, 변경 전후 비교, 이용자에게 미치는 영향, 확인할 사항' },
  { id: 'search', icon: '⌕', title: '검색형 정보 글', desc: '궁금한 질문에 명확한 답을 주는 글', type: '일반 정보', topic: '최신 정보를 조사해 주제 선정', purpose: '검색 유입', audience: '메이플스토리 이용자', category: '블로그', sample: '메이플 유니온과 링크 스킬, 무엇부터 준비할까?', include: '질문에 대한 짧은 답, 비교 기준, 상황별 선택 방법, 자주 묻는 질문 3개' },
  { id: 'service', icon: '◎', title: '사이트 이용 안내', desc: '실제 기능을 소개하고 이용 방법을 안내', type: '홍보·참여 안내', topic: '최신 정보를 조사해 주제 선정', purpose: '사이트 이용 안내', audience: '메이플스토리 이용자', category: '가이드', sample: '처음 방문한 이용자를 위한 사이트 핵심 기능 사용법', include: '사이트에서 확인한 실제 기능, 이용 순서, 이용 조건, 문의 방법' },
  { id: 'blank', icon: '+', title: '직접 기획하기', desc: '정해진 형식 없이 나만의 주제로 시작', type: '일반 정보', topic: '최신 정보를 조사해 주제 선정', purpose: '정확한 정보 전달', audience: '메이플스토리 이용자', category: '사이트에 맞게 선택', sample: '', include: '' },
];
const STEPS = ['어떤 글을 쓸까요?', '주제와 근거 정하기', '표현과 이미지 설정', '완성된 요청 확인'];
const blankCustom = Object.fromEntries(Object.keys(initialChoices).map(key => [key, ''])) as Choices;
function freshDraft(): Draft {
  return { choices: { ...initialChoices, type: '가이드·공략', category: '가이드', audience: '초보자', topic: CUSTOM }, custom: { ...blankCustom }, extras: { ...initialExtras }, thumbnail: { mode: '제작 안 함', size: '가로형 1280×720', sizeCustom: '', style: '사이트 분위기에 맞게', styleCustom: '' }, preset: 'guide' };
}
function isDraft(value: unknown): value is Draft {
  if (!value || typeof value !== 'object') return false;
  const d = value as Draft;
  return !!d.choices && !!d.custom && !!d.extras && !!d.thumbnail && PRESETS.some(p => p.id === d.preset)
    && Object.keys(initialChoices).every(k => typeof d.choices[k as ChoiceKey] === 'string' && typeof d.custom[k as ChoiceKey] === 'string')
    && Object.keys(initialExtras).every(k => typeof d.extras[k as keyof Extras] === 'string')
    && ['제작 안 함', '새 썸네일 제작', '기존 이미지 사용'].includes(d.thumbnail.mode)
    && ['size', 'sizeCustom', 'style', 'styleCustom'].every(k => typeof d.thumbnail[k as keyof ThumbnailSettings] === 'string')
    && options.scope.includes(d.choices.scope);
}
function valueOf(d: Draft, key: ChoiceKey) { return (d.choices[key] === CUSTOM ? d.custom[key] : d.choices[key]).trim(); }
function validUrl(value: string) { try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; } }
function issuesFor(d: Draft) {
  const issues: { text: string; step: number }[] = [];
  if (!validUrl(valueOf(d, 'site'))) issues.push({ text: '게시할 사이트를 선택하거나 올바른 http(s) 주소를 입력하세요.', step: 0 });
  for (const key of Object.keys(d.choices) as ChoiceKey[]) {
    if (key !== 'site' && key !== 'publish' && !valueOf(d, key)) issues.push({ text: `${labels[key]}을 입력하세요.`, step: ['category','audience','type','purpose'].includes(key) ? 0 : ['topic','action'].includes(key) ? 1 : 2 });
  }
  if (d.choices.scope !== '글 작성만' && d.extras.adminUrl.trim() && !validUrl(d.extras.adminUrl.trim())) issues.push({ text: '관리자 페이지 주소를 http(s) 주소로 입력하세요.', step: 3 });
  if (d.thumbnail.mode === '기존 이미지 사용' && !d.extras.thumbnailSource.trim()) issues.push({ text: '사용할 이미지 경로나 주소를 입력하세요.', step: 2 });
  if (d.thumbnail.mode === '새 썸네일 제작' && ((d.thumbnail.size === CUSTOM && !d.thumbnail.sizeCustom.trim()) || (d.thumbnail.style === CUSTOM && !d.thumbnail.styleCustom.trim()))) issues.push({ text: '썸네일 크기와 디자인을 입력하세요.', step: 2 });
  return issues;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [draft, setDraft] = useState<Draft>(freshDraft);
  const [ready, setReady] = useState(false);
  const [saveState, setSaveState] = useState('');
  const [saved, setSaved] = useState<Saved[]>([]);
  const [view, setView] = useState<'editor' | 'library' | 'sites'>('editor');
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState('');
  const [raw, setRaw] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [visits, setVisits] = useState<Record<string, string>>({});
  const [templateName, setTemplateName] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!authenticated) return;
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE) || 'null');
      if (isDraft(current)) { setDraft(current); setSaveState('이전 작업을 불러왔어요'); }
      const collection: unknown = JSON.parse(localStorage.getItem(LIBRARY) || '[]');
      if (Array.isArray(collection)) setSaved(collection.filter((item): item is Saved => !!item && typeof item.id === 'string' && typeof item.name === 'string' && typeof item.date === 'string' && isDraft(item.draft)).slice(0, 8));
    } catch { setSaveState('브라우저 저장소를 읽을 수 없어요'); }
    setReady(true);
    fetch('/api/bookmark-visits').then(r => r.ok ? r.json() : {}).then(data => {
      if (data && typeof data === 'object') setVisits(Object.fromEntries(Object.entries(data).filter(([, value]) => typeof value === 'string')) as Record<string, string>);
    }).catch(() => {});
  }, [authenticated]);

  useEffect(() => {
    if (!ready || !authenticated) return;
    setSaveState('저장 중…');
    const timer = window.setTimeout(() => {
      try { localStorage.setItem(STORAGE, JSON.stringify(draft)); setSaveState('이 브라우저에 자동 저장됨'); }
      catch { setSaveState('자동 저장 불가 · 요청문을 다운로드하세요'); }
    }, 450);
    return () => window.clearTimeout(timer);
  }, [draft, ready, authenticated]);

  useEffect(() => { setNotice(''); }, [draft]);
  const chosen = PRESETS.find(p => p.id === draft.preset)!;
  const issues = issuesFor(draft);
  const prompt = makePrompt(draft.choices, draft.custom, draft.extras, draft.thumbnail);
  const siteName = bookmarks.find(b => b.url === valueOf(draft, 'site'))?.name || valueOf(draft, 'site') || '사이트 미선택';
  const change = (key: ChoiceKey, value: string, custom = false) => setDraft(d => ({ ...d, [custom ? 'custom' : 'choices']: { ...d[custom ? 'custom' : 'choices'], [key]: value } }));
  const extra = (key: keyof Extras, value: string) => setDraft(d => ({ ...d, extras: { ...d.extras, [key]: value } }));
  const thumb = (key: keyof ThumbnailSettings, value: string) => setDraft(d => ({ ...d, thumbnail: { ...d.thumbnail, [key]: value } }));
  function navigate(next: number) { setStep(next); setView('editor'); setNotice(''); requestAnimationFrame(() => heading.current?.focus()); }
  function preset(id: string) {
    const p = PRESETS.find(item => item.id === id)!;
    setDraft(d => ({ ...d, preset: id, choices: { ...d.choices, type: p.type, purpose: p.purpose, audience: p.audience, category: p.category, topic: d.choices.topic === CUSTOM ? CUSTOM : p.topic } }));
  }
  function field(key: ChoiceKey) {
    return <div className="cs-field" key={key}><label htmlFor={`cs-${key}`}>{labels[key]}</label><select id={`cs-${key}`} value={draft.choices[key]} onChange={e => change(key, e.target.value)}>{key === 'site' && <option value="">사이트를 선택하세요</option>}{options[key].map(o => <option key={o} value={o}>{key === 'site' ? bookmarks.find(b => b.url === o)?.name || o : o}</option>)}<option>{CUSTOM}</option></select>{draft.choices[key] === CUSTOM && <input aria-label={`${labels[key]} 직접 작성`} value={draft.custom[key]} onChange={e => change(key, e.target.value, true)} placeholder={key === 'site' ? 'https://example.com' : `${labels[key]} 입력`} />}</div>;
  }
  function textField(key: keyof Extras, label: string, placeholder: string, multiline = false) {
    return <div className="cs-field"><label htmlFor={`cs-${key}`}>{label}<span>선택</span></label>{multiline ? <textarea id={`cs-${key}`} value={draft.extras[key]} onChange={e => extra(key, e.target.value)} placeholder={placeholder} rows={3} /> : <input id={`cs-${key}`} value={draft.extras[key]} onChange={e => extra(key, e.target.value)} placeholder={placeholder} />}</div>;
  }
  async function copy() {
    if (issues.length) { setNotice(issues[0].text); return; }
    try { await navigator.clipboard.writeText(prompt); setNotice('복사했어요. 사용하는 AI 대화창에 붙여넣으세요.'); }
    catch { setRaw(true); setNotice('클립보드에 접근할 수 없어요. 요청문을 직접 선택해 복사하거나 다운로드하세요.'); }
  }
  function download() {
    if (issues.length) { setNotice(issues[0].text); return; }
    const url = URL.createObjectURL(new Blob([prompt], { type: 'text/markdown;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `메이플봇-${draft.preset}-요청문.md`; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('요청문 파일을 다운로드했어요.');
  }
  function saveTemplate() {
    if (issues.length) { setNotice(issues[0].text); return; }
    if (saved.length >= 8) { setNotice('최대 8개까지 저장할 수 있어요. 보관함에서 기존 요청을 정리해 주세요.'); return; }
    const next = [{ id: crypto.randomUUID(), name: templateName.trim() || `${siteName} · ${valueOf(draft, 'topic')}`, date: new Date().toISOString(), draft: structuredClone(draft) }, ...saved];
    try { localStorage.setItem(LIBRARY, JSON.stringify(next)); setSaved(next); setNotice('보관함에 저장했어요. 다음 작업에서 다시 불러올 수 있어요.'); }
    catch { setNotice('저장 공간을 사용할 수 없어요. 요청문을 다운로드해 주세요.'); }
  }
  function visit(index: number) {
    setVisits(v => ({ ...v, [String(index + 1)]: new Date().toISOString() }));
    fetch('/api/bookmark-visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookmarkId: String(index + 1) }) }).catch(() => {});
  }

  return <div className="content-studio">
    {!authenticated ? <section className="cs-login"><div className="cs-brandmark"><FileText size={25} /></div><p className="cs-overline">MAPLEBOT / CONTENT STUDIO</p><h1>좋은 글은<br />명확한 요청에서.</h1><p>사이트에 맞는 글을 기획하고,<br />AI에게 전달할 요청을 한곳에서 만드세요.</p><form onSubmit={e => { e.preventDefault(); if (password === 'rlfwns55') { setAuthenticated(true); setPassword(''); setLoginError(''); } else setLoginError('비밀번호가 올바르지 않습니다.'); }}><label htmlFor="cs-password">관리자 비밀번호</label><input id="cs-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /><button className="cs-primary" type="submit">작업실 열기 <ArrowRight size={17} /></button>{loginError && <p className="cs-error" role="alert">{loginError}</p>}</form><span className="cs-small">메이플봇 관리자 전용</span></section> : <div className="cs-shell">
      <aside className="cs-sidebar"><a className="cs-wordmark" href="/adminpage"><span className="cs-brandmark"><FileText size={19} /></span><span>콘텐츠 작업실<small>MAPLEBOT STUDIO</small></span></a><p className="cs-navlabel">WORKSPACE</p><nav aria-label="작업실 메뉴"><button className={view === 'editor' ? 'active' : ''} onClick={() => setView('editor')}><Settings2 size={17} />요청문 만들기</button><button className={view === 'library' ? 'active' : ''} onClick={() => setView('library')}><FolderOpen size={17} />내 보관함 <span className="cs-count">{saved.length}</span></button><button className={view === 'sites' ? 'active' : ''} onClick={() => setView('sites')}><Bookmark size={17} />사이트 바로가기</button></nav><div className="cs-sidebar-note"><span>작업의 시작을 가볍게</span><p>글의 방향은 직접 정하고,<br />구체적인 작성 지시는<br />작업실에 맡기세요.</p><div className="cs-note-lines"><i /><i /><i /></div></div><button className="cs-logout" onClick={() => { setAuthenticated(false); setReady(false); }}><LogOut size={15} />작업실 잠그기</button></aside>
      <div className="cs-workspace"><header className="cs-topbar"><span>관리자 <ChevronRight size={13} /> {view === 'editor' ? '요청문 만들기' : view === 'library' ? '내 보관함' : '사이트 바로가기'}</span><span className="cs-save-state"><i />{saveState || '작업 준비 중'}</span></header>
        {view === 'editor' ? <><div className="cs-page-heading"><div><p className="cs-overline">BRIEF FIRST, WRITE BETTER</p><h1>무엇을 쓸지부터, 선명하게.</h1><p>몇 가지 선택으로 완성하는 나만의 AI 글 작성 요청.</p></div><button className="cs-button" onClick={() => setResetOpen(true)}><Plus size={16} />새 작업</button></div>
          <nav className="cs-steps" aria-label="요청문 작성 단계">{STEPS.map((title, i) => <button key={title} aria-current={step === i ? 'step' : undefined} onClick={() => navigate(i)} className={step === i ? 'active' : ''}><span>{i + 1}</span><strong>{title}</strong>{i < 3 && <ChevronRight size={15} />}</button>)}</nav>
          <div className="cs-editor-grid"><section className="cs-editor"><div className="cs-section-heading"><span className="cs-overline">STEP 0{step + 1}</span><h2 ref={heading} tabIndex={-1}>{STEPS[step]}</h2><p>{['먼저 글의 용도와 게시할 사이트를 정하세요.', '구체적인 주제와 믿을 수 있는 자료가 글의 품질을 결정해요.', '독자가 읽기 편한 말투와 필요한 결과물을 정하세요.', '작업 범위를 확인한 뒤, 요청문을 AI에게 전달하세요.'][step]}</p></div>
            {step === 0 && <><div className="cs-presets">{PRESETS.map(p => <button key={p.id} aria-pressed={draft.preset === p.id} className={`cs-preset ${draft.preset === p.id ? 'selected' : ''}`} onClick={() => preset(p.id)}><span className="cs-preset-icon">{p.icon}</span><span><strong>{p.title}</strong><small>{p.desc}</small></span>{draft.preset === p.id && <Check size={16} />}</button>)}</div><div className="cs-separator" /><div className="cs-fields">{field('site')}{field('category')}{field('audience')}{field('purpose')}</div><details className="cs-details"><summary>글 유형 직접 조정</summary>{field('type')}</details></>}
            {step === 1 && <><div className="cs-field"><label>주제 선정 방식</label><div className="cs-segment"><button aria-pressed={draft.choices.topic === CUSTOM} className={draft.choices.topic === CUSTOM ? 'active' : ''} onClick={() => change('topic', CUSTOM)}>주제를 직접 입력</button><button aria-pressed={draft.choices.topic !== CUSTOM} className={draft.choices.topic !== CUSTOM ? 'active' : ''} onClick={() => change('topic', chosen.topic)}>AI가 조사해서 선정</button></div></div>{draft.choices.topic === CUSTOM ? <div className="cs-field"><label htmlFor="cs-topic">이번 글의 주제 <em>필수</em></label><textarea id="cs-topic" value={draft.custom.topic} onChange={e => change('topic', e.target.value, true)} placeholder={chosen.sample || '누구에게 어떤 내용을 알려주고 싶나요?'} rows={3} />{chosen.sample && <button className="cs-example" onClick={() => change('topic', chosen.sample, true)}><Sparkles size={14} />예시 넣기: {chosen.sample}</button>}</div> : <div className="cs-callout"><Search size={19} /><p><strong>{chosen.topic}</strong>공식 자료와 기존 게시물을 확인해 중복되지 않는 주제를 선정하도록 요청해요. 이 화면에서 실시간 조사를 실행하지는 않아요.</p></div>}
              <div className="cs-separator" />{textField('include', '꼭 담을 내용', chosen.include || '핵심 질문, 강조할 정보, 다뤄야 할 항목', true)}{chosen.include && <button className="cs-text-button" onClick={() => extra('include', [draft.extras.include, chosen.include].filter(Boolean).join('\n'))}>+ {chosen.title} 구성 예시 추가</button>}{textField('referenceUrl', '참고할 자료', '공식 공지 주소나 참고 URL을 한 줄씩 입력', true)}{textField('keyword', '핵심 검색어', '예: 메이플 복귀, 성장 순서')}
              <details className="cs-details"><summary>제외할 내용과 링크 설정</summary>{textField('exclude', '제외할 내용', '다루지 않을 주제, 피할 표현', true)}{field('action')}{textField('link', '본문에 넣을 링크', '주소와 연결할 문구를 함께 입력')}</details></>}
            {step === 2 && <><div className="cs-fields">{field('tone')}{field('length')}{field('tags')}</div><div className="cs-separator" /><h3 className="cs-subheading"><ImageIcon size={19} />썸네일</h3><div className="cs-field"><label htmlFor="cs-image-mode">이미지 준비 방식</label><select id="cs-image-mode" value={draft.thumbnail.mode} onChange={e => thumb('mode', e.target.value)}>{['제작 안 함', '새 썸네일 제작', '기존 이미지 사용'].map(x => <option key={x}>{x}</option>)}</select></div>{draft.thumbnail.mode === '새 썸네일 제작' && <><div className="cs-fields">{(['size','style'] as const).map(key => <div className="cs-field" key={key}><label htmlFor={`cs-thumb-${key}`}>{key === 'size' ? '이미지 크기' : '디자인 분위기'}</label><select id={`cs-thumb-${key}`} value={draft.thumbnail[key]} onChange={e => thumb(key, e.target.value)}>{(key === 'size' ? ['가로형 1280×720','정사각형 1080×1080','사이트 권장 크기에 맞게', CUSTOM] : ['사이트 분위기에 맞게','간결한 정보형','밝고 활기찬 스타일','게임 공지형',CUSTOM]).map(x => <option key={x}>{x}</option>)}</select>{draft.thumbnail[key] === CUSTOM && <input aria-label={key === 'size' ? '크기 직접 작성' : '디자인 직접 작성'} value={draft.thumbnail[`${key}Custom`]} onChange={e => thumb(`${key}Custom`, e.target.value)} />}</div>)}</div>{textField('thumbnailText', '이미지 문구', '비워두면 글에 맞는 짧은 문구를 AI가 선정')}</>}{draft.thumbnail.mode === '기존 이미지 사용' && <div className="cs-field"><label htmlFor="cs-thumbnail-source">이미지 파일 경로 또는 URL <em>필수</em></label><input id="cs-thumbnail-source" value={draft.extras.thumbnailSource} onChange={e => extra('thumbnailSource', e.target.value)} placeholder="AI가 접근할 수 있는 이미지 주소나 첨부 파일명" /></div>}<p className="cs-helper">이미지 제작 지시가 요청문에 포함됩니다. 실제 제작은 요청을 전달받은 AI가 수행해요.</p><div className="cs-separator" />{textField('notes', '나만의 작성 지침', '예: 도입부는 3문장 이내로, 비교 정보는 표로 정리해 주세요.', true)}</>}
            {step === 3 && <><div className="cs-field"><label htmlFor="cs-scope">AI에게 맡길 작업 범위</label><select id="cs-scope" value={draft.choices.scope} onChange={e => change('scope', e.target.value)}>{options.scope.map(x => <option key={x}>{x}</option>)}</select></div>{draft.choices.scope !== '글 작성만' && textField('adminUrl', '관리자 페이지 주소', 'https://example.com/admin')}<div className="cs-callout"><CheckCheck size={20} /><p><strong>{draft.choices.scope === '글 작성만' ? '완성된 글만 전달받습니다.' : draft.choices.scope === '관리자 페이지에 초안 등록까지' ? '초안으로 저장하고 공개하지 않습니다.' : '검토 후 공개 게시까지 요청합니다.'}</strong>{draft.choices.scope === '글 작성만' ? '사이트에 글을 등록하거나 공개하는 작업은 요청하지 않아요.' : '요청을 받은 AI에 사이트 접근 권한과 필요한 도구가 있어야 실행할 수 있어요.'}</p></div>
              {issues.length > 0 ? <div className="cs-validation"><h3>아직 확인할 항목이 있어요</h3>{issues.map((issue, index) => <button key={index} onClick={() => navigate(issue.step)}>{issue.text}<ArrowRight size={15} /></button>)}</div> : <div className="cs-ready"><Check size={18} /><span>필수 입력이 완료됐어요. 요청문을 전달할 준비가 됐습니다.</span></div>}
              <div className="cs-output-heading"><h3>AI에게 보낼 요청문</h3><span>{prompt.length.toLocaleString()}자</span></div><textarea className="cs-prompt" aria-label="완성된 AI 요청문" readOnly value={prompt} rows={16} /><div className="cs-actions"><button className="cs-primary" onClick={copy} disabled={issues.length > 0}><Copy size={16} />요청문 복사</button><button className="cs-button" onClick={download} disabled={issues.length > 0}><ArrowDownToLine size={16} />파일로 받기</button></div><div className="cs-template-save"><label htmlFor="cs-template-name">다음에도 사용할 요청인가요?</label><div><input id="cs-template-name" value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="보관할 이름 (선택)" maxLength={80} /><button className="cs-button" onClick={saveTemplate} disabled={issues.length > 0}><Bookmark size={16} />보관</button></div><p className="cs-helper">현재 브라우저에 최대 8개 저장됩니다. 비밀번호나 개인정보는 입력하지 마세요.</p></div></>}
            <div className="cs-step-footer"><button className="cs-text-button" onClick={() => navigate(step - 1)} disabled={step === 0}><ArrowLeft size={15} />이전 단계</button>{step < 3 ? <button className="cs-primary" onClick={() => navigate(step + 1)}>다음 단계 <ArrowRight size={16} /></button> : <span className="cs-small">복사한 요청을 AI 대화창에 붙여넣으세요.</span>}</div>
          </section><aside className="cs-summary"><div className="cs-summary-top"><span className="cs-overline">LIVE BRIEF</span><span className="cs-live-dot" /></div><h2>이번 글의 설계도</h2><p className="cs-summary-intro">선택한 내용이 요청문에<br />실시간으로 반영돼요.</p><div className="cs-brief-paper"><div className="cs-paper-top"><FileText size={19} /><span>{chosen.title}</span></div><h3>{valueOf(draft, 'topic') || '아직 정하지 않은 주제'}</h3><dl><div><dt>게시할 곳</dt><dd>{siteName}</dd></div><div><dt>읽는 사람</dt><dd>{valueOf(draft, 'audience')}</dd></div><div><dt>말투</dt><dd>{valueOf(draft, 'tone')}</dd></div><div><dt>분량</dt><dd>{valueOf(draft, 'length')}</dd></div><div><dt>이미지</dt><dd>{draft.thumbnail.mode}</dd></div><div><dt>작업 범위</dt><dd>{valueOf(draft, 'scope')}</dd></div></dl></div><div className="cs-deliverables"><h3>요청에 포함되는 결과물</h3>{['제목 후보 3개와 최종 제목', '핵심 요약 · 소제목이 있는 본문', '검색 설명문 · 선택한 태그', '공식 출처 · 확인하지 못한 사항'].map(x => <p key={x}><Check size={14} />{x}</p>)}{draft.thumbnail.mode !== '제작 안 함' && <p><Check size={14} />썸네일 파일과 제작·등록 상태</p>}</div><button className="cs-preview-toggle" onClick={() => setRaw(v => !v)} aria-expanded={raw}><FileText size={15} />{raw ? '요청문 접기' : '요청문 미리 보기'}<ChevronRight size={15} /></button>{raw && <textarea className="cs-mini-prompt" aria-label="실시간 요청문 미리보기" readOnly value={prompt} rows={12} />}<p className="cs-summary-foot">이 작업실은 요청문을 만듭니다.<br />글 작성과 게시가 자동 실행되지는 않아요.</p></aside></div>
        </> : view === 'library' ? <><div className="cs-page-heading"><div><p className="cs-overline">YOUR COLLECTION</p><h1>다음 글도, 여기서 시작.</h1><p>저장한 요청을 불러와 주제만 바꿔 사용하세요.</p></div><button className="cs-button" onClick={() => setView('editor')}><ArrowLeft size={16} />작업으로 돌아가기</button></div>{saved.length === 0 ? <div className="cs-empty"><FolderOpen size={38} /><h2>자주 쓰는 요청을 모아두세요.</h2><p>마지막 단계에서 ‘보관’을 누르면 여기에 저장됩니다.</p><button className="cs-primary" onClick={() => navigate(0)}>첫 요청 만들기 <ArrowRight size={16} /></button></div> : <div className="cs-library">{saved.map(item => <article key={item.id}><span className="cs-overline">{new Date(item.date).toLocaleDateString('ko-KR')}</span><h2>{item.name}</h2><p>{valueOf(item.draft, 'topic')}</p><div><button className="cs-button" onClick={() => { setDraft(structuredClone(item.draft)); setTemplateName(item.name); navigate(0); setNotice('저장한 요청을 불러왔어요.'); }}>불러오기 <ArrowRight size={15} /></button><button className="cs-text-button" onClick={() => { const next = saved.filter(s => s.id !== item.id); try { localStorage.setItem(LIBRARY, JSON.stringify(next)); setSaved(next); setNotice('보관함에서 제거했어요. 현재 작업은 유지됩니다.'); } catch { setNotice('보관함을 수정할 수 없어요.'); } }}>보관 해제</button></div></article>)}</div>}</> : <><div className="cs-page-heading"><div><p className="cs-overline">CONNECTED WORKSPACE</p><h1>글을 보낼 곳.</h1><p>사이트의 기존 글을 살펴보고 다음 콘텐츠를 기획하세요.</p></div></div><div className="cs-library">{bookmarks.map((bookmark, index) => <article key={bookmark.url}><span className="cs-site-icon">{bookmark.name.slice(0,1)}</span><h2>{bookmark.name}</h2><p className="cs-url">{bookmark.url}</p><small>{visits[String(index + 1)] ? `최근 방문 ${new Date(visits[String(index + 1)]).toLocaleDateString('ko-KR')}` : '아직 방문 기록이 없어요'}</small><div><a className="cs-button" href={bookmark.url} target="_blank" rel="noopener noreferrer" onClick={() => visit(index)}>사이트 열기 ↗</a><button className="cs-text-button" onClick={() => { change('site', bookmark.url); navigate(0); }}>이 사이트로 작성</button></div></article>)}</div></>}
        {notice && <div className="cs-notice" role="status"><span>{notice}</span><button aria-label="알림 닫기" onClick={() => setNotice('')}><X size={17} /></button></div>}
        <footer className="cs-workspace-footer"><span>MAPLEBOT CONTENT STUDIO</span><span>생각을 정리하고, 작성은 더 정확하게.</span></footer>
      </div>
      {resetOpen && <div className="cs-modal-backdrop"><section className="cs-modal" role="dialog" aria-modal="true" aria-labelledby="cs-reset-title" onKeyDown={e => { if (e.key === 'Escape') setResetOpen(false); if (e.key === 'Tab') { const buttons = e.currentTarget.querySelectorAll('button'); if (e.shiftKey && document.activeElement === buttons[0]) { e.preventDefault(); buttons[1].focus(); } else if (!e.shiftKey && document.activeElement === buttons[1]) { e.preventDefault(); buttons[0].focus(); } } }}><RotateCcw size={26} /><h2 id="cs-reset-title">새로운 글을 시작할까요?</h2><p>현재 입력이 초기화됩니다. 보관함에 저장한 요청은 그대로 남아요.</p><div className="cs-actions"><button autoFocus className="cs-button" onClick={() => setResetOpen(false)}>계속 작성</button><button className="cs-primary" onClick={() => { setDraft(freshDraft()); setTemplateName(''); setResetOpen(false); navigate(0); }}>새로 시작</button></div></section></div>}
    </div>}
  </div>;
}
