'use client';

import { useState, useEffect } from 'react';

interface Bookmark {
  id: string;
  name: string;
  url: string;
  lastVisited?: string;
}

// 여기에 북마크를 추가/수정/삭제하세요
const BOOKMARKS: Omit<Bookmark, 'lastVisited'>[] = [
  { id: '1', name: '메이플 허브', url: 'https://www.maplehub.co.kr' },
  { id: '2', name: '한글메이플 급처', url: 'https://www.메이플급처.com' },
  { id: '3', name: '메이플 사요', url: 'https://maplesayo.com' },
  { id: '4', name: '메이플스토리 아이템', url: 'https://www.maplestoryitem.com' },
  { id: '5', name: '메이플 아이템', url: 'https://mapleitem.co.kr/' },
  { id: '6', name: '메이플디스코드', url: 'https://www.maplediscord.com' },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [visitHistory, setVisitHistory] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

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
              📚 즐겨찾기
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
              북마크 추가/삭제는 코드를 직접 수정하세요
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

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
            ← 홈으로 돌아가기
          </a>
        </div>
      </main>
    </div>
  );
}
