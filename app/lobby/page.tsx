'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MOCK_ROOMS = [
  { id: 'room-1', name: '新手村', players: 3, max: 10, status: '等待中', ping: 28 },
  { id: 'room-2', name: '高手对决', players: 8, max: 10, status: '进行中', ping: 35 },
  { id: 'room-3', name: '乱斗模式', players: 5, max: 16, status: '等待中', ping: 22 },
  { id: 'room-4', name: '王者之战', players: 10, max: 10, status: '已满', ping: 41 },
  { id: 'room-5', name: '休闲小局', players: 2, max: 8, status: '等待中', ping: 19 },
];

const MOCK_TOP = [
  { rank: 1, name: '虾王霸霸', score: 28840, title: '小龙虾之王' },
  { rank: 2, name: '红甲战神', score: 21200, title: '虾将' },
  { rank: 3, name: '沸腾小龙', score: 18900, title: '虾将' },
  { rank: 4, name: '夜市霸主', score: 15600, title: '霸王虾' },
  { rank: 5, name: '十三香侠', score: 12300, title: '霸王虾' },
];

export default function LobbyPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ nickname: string; score: number; title: string } | null>(null);
  const [tab, setTab] = useState<'rooms' | 'rank'>('rooms');
  const [matchmaking, setMatchmaking] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
  }, []);

  const handleQuickMatch = () => {
    setMatchmaking(true);
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); router.push('/game/room-1'); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const getRoomStatusColor = (status: string) => {
    if (status === '等待中') return '#4CAF50';
    if (status === '进行中') return 'var(--gold)';
    return 'var(--text-muted)';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(61,43,20,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(61,43,20,0.2) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        padding: '0 32px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(13,10,8,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--dark-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/"><span style={{ fontSize: '24px' }} className="claw-shake">🦞</span></Link>
          <span style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: '20px', letterSpacing: '3px' }} className="gold-text">游戏大厅</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>🦞 {user.nickname}</span>
              <Link href="/profile"><button className="btn-secondary" style={{ padding: '6px 16px', fontSize: '13px' }}>主页</button></Link>
            </>
          ) : (
            <>
              <Link href="/login"><button className="btn-secondary" style={{ padding: '6px 16px', fontSize: '13px' }}>登录</button></Link>
              <Link href="/register"><button className="btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>注册</button></Link>
            </>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', position: 'relative', zIndex: 10 }}>
        {/* 快速匹配 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139,26,26,0.3), rgba(26,17,8,0.8))',
          border: '1px solid rgba(192,57,43,0.4)',
          borderRadius: '12px', padding: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '20px', marginBottom: '32px',
        }}>
          <div>
            <h2 style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: '28px', letterSpacing: '3px', marginBottom: '8px' }}>快速匹配</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>系统自动为你匹配同段位对手，一键开战！</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            {matchmaking ? (
              <div>
                <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--gold)', fontFamily: 'monospace' }}>{countdown}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>即将进入战场...</div>
              </div>
            ) : (
              <button className="btn-primary glow-pulse" style={{ fontSize: '18px', padding: '14px 48px', letterSpacing: '3px' }} onClick={handleQuickMatch}>
                立即匹配 🦞
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
          {/* 左侧：房间列表 */}
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              {(['rooms', 'rank'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: '8px 24px', borderRadius: '4px', cursor: 'pointer',
                  border: `1px solid ${tab === t ? 'var(--gold)' : 'var(--dark-border)'}`,
                  background: tab === t ? 'rgba(243,156,18,0.1)' : 'transparent',
                  color: tab === t ? 'var(--gold)' : 'var(--text-muted)',
                  fontFamily: "'Noto Serif SC', serif", fontSize: '14px',
                  transition: 'all 0.2s',
                }}>
                  {t === 'rooms' ? '🏠 房间列表' : '🏆 实时榜单'}
                </button>
              ))}
            </div>

            {tab === 'rooms' && (
              <div>
                {MOCK_ROOMS.map(room => (
                  <div key={room.id} style={{
                    background: 'var(--dark-card)', border: '1px solid var(--dark-border)',
                    borderRadius: '8px', padding: '20px 24px', marginBottom: '12px',
                    display: 'flex', alignItems: 'center', gap: '20px',
                    transition: 'border-color 0.2s', cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--dark-border)')}
                  onClick={() => room.status !== '已满' && router.push(`/game/${room.id}`)}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{room.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>延迟 {room.ping}ms</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{room.players}/{room.max}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>人数</div>
                    </div>
                    <div style={{ width: '80px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: 600,
                        color: getRoomStatusColor(room.status),
                        border: `1px solid ${getRoomStatusColor(room.status)}40`,
                        background: `${getRoomStatusColor(room.status)}10`,
                      }}>{room.status}</span>
                    </div>
                    <button
                      className={room.status === '已满' ? 'btn-secondary' : 'btn-primary'}
                      style={{ padding: '8px 20px', fontSize: '13px', opacity: room.status === '已满' ? 0.5 : 1 }}
                      disabled={room.status === '已满'}
                    >
                      {room.status === '已满' ? '已满' : '加入'}
                    </button>
                  </div>
                ))}
                <button className="btn-secondary" style={{ width: '100%', marginTop: '8px' }}
                  onClick={() => router.push('/game/new')}>
                  + 创建新房间
                </button>
              </div>
            )}

            {tab === 'rank' && (
              <div>
                {MOCK_TOP.map(p => (
                  <div key={p.rank} style={{
                    background: p.rank === 1 ? 'rgba(241,196,15,0.06)' : 'var(--dark-card)',
                    border: `1px solid ${p.rank === 1 ? 'rgba(241,196,15,0.3)' : 'var(--dark-border)'}`,
                    borderRadius: '8px', padding: '16px 24px', marginBottom: '10px',
                    display: 'flex', alignItems: 'center', gap: '16px',
                  }}>
                    <span style={{ fontSize: '24px', width: '32px', textAlign: 'center' }}>
                      {p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : p.rank === 3 ? '🥉' : `#${p.rank}`}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: p.rank === 1 ? 'var(--gold-light)' : 'var(--text-primary)' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.title}</div>
                    </div>
                    <div style={{ color: 'var(--gold)', fontWeight: 700 }}>{p.score.toLocaleString()} 分</div>
                  </div>
                ))}
                <Link href="/leaderboard" style={{ display: 'block', textAlign: 'center', marginTop: '16px', color: 'var(--gold)', textDecoration: 'none', fontSize: '14px' }}>查看完整排行榜 →</Link>
              </div>
            )}
          </div>

          {/* 右侧：个人信息 + 邀请 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {user ? (
              <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>🦞</div>
                  <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--gold)' }}>{user.nickname}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>{user.title || '小虾米'}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--gold)' }}>{(user.score || 0).toLocaleString()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>总积分</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--red-bright)' }}>0</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>今日胜利</div>
                  </div>
                </div>
                <Link href="/profile"><button className="btn-secondary" style={{ width: '100%', fontSize: '13px' }}>查看主页</button></Link>
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🦞</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>登录后查看你的战绩</p>
                <Link href="/login"><button className="btn-primary" style={{ width: '100%', marginBottom: '10px', fontSize: '14px' }}>登录</button></Link>
                <Link href="/register"><button className="btn-secondary" style={{ width: '100%', fontSize: '14px' }}>注册</button></Link>
              </div>
            )}

            <div className="card">
              <h3 style={{ color: 'var(--gold)', fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>🎁 邀请好友</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7, marginBottom: '16px' }}>邀请好友注册并完成首局，双方各得 500 积分 + 限定皮肤！</p>
              <div style={{
                background: 'rgba(243,156,18,0.08)', border: '1px solid rgba(243,156,18,0.2)',
                borderRadius: '6px', padding: '10px 14px', marginBottom: '12px',
                fontFamily: 'monospace', fontSize: '15px', color: 'var(--gold)',
                textAlign: 'center', letterSpacing: '2px',
              }}>
                {user ? 'XIAXIA' + (user.nickname?.slice(0,3).toUpperCase() || 'XXX') : '登录后查看'}
              </div>
              <button className="btn-primary" style={{ width: '100%', fontSize: '13px' }}
                onClick={() => { if (user) { navigator.clipboard.writeText(`https://6.appall.top/invite/XIAXIA${user.nickname?.slice(0,3).toUpperCase()}`); alert('邀请链接已复制！'); } else { router.push('/login'); } }}>
                复制邀请链接
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
