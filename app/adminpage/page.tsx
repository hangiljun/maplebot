'use client';

import { useState, useEffect } from 'react';

interface Bookmark {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      const stored = localStorage.getItem('adminBookmarks');
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
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

  const handleAddBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) {
      setError('사이트 이름과 URL을 모두 입력해주세요.');
      return;
    }

    const bookmark: Bookmark = {
      id: Date.now().toString(),
      name: newName.trim(),
      url: newUrl.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...bookmarks, bookmark];
    setBookmarks(updated);
    localStorage.setItem('adminBookmarks', JSON.stringify(updated));

    setNewName('');
    setNewUrl('');
    setError('');
  };

  const handleDelete = (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('adminBookmarks', JSON.stringify(updated));
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
      padding: '40px 20px'
    }}>
      <main style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1F2937' }}>
            📚 즐겨찾기 관리
          </h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            style={{
              padding: '10px 20px',
              background: '#EF4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            로그아웃
          </button>
        </div>

        <div style={{
          background: '#FFFFFF',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#1F2937' }}>
            새 북마크 추가
          </h2>

          <form onSubmit={handleAddBookmark}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                사이트 이름
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="예: Google"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                웹 주소 (URL)
              </label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>

            {error && (
              <p style={{ color: '#EF4444', fontSize: '14px', marginBottom: '16px' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              추가
            </button>
          </form>
        </div>

        <div style={{
          background: '#FFFFFF',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#1F2937' }}>
            저장된 북마크 ({bookmarks.length})
          </h2>

          {bookmarks.length === 0 ? (
            <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '40px 20px' }}>
              저장된 북마크가 없습니다.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#1F2937' }}>
                      {bookmark.name}
                    </h3>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#667eea',
                        fontSize: '14px',
                        textDecoration: 'none',
                        wordBreak: 'break-all'
                      }}
                    >
                      {bookmark.url}
                    </a>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '8px 16px',
                        background: '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      방문
                    </a>
                    <button
                      onClick={() => handleDelete(bookmark.id)}
                      style={{
                        padding: '8px 16px',
                        background: '#EF4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <a href="/" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
            ← 홈으로 돌아가기
          </a>
        </div>
      </main>
    </div>
  );
}
