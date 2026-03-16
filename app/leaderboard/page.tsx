'use client';

import { useState } from 'react';
import Link from 'next/link';

const LEADERBOARD = [
  { rank: 1, name: '虾王霸霸', score: 28840, wins: 142, title: '小龙虾之王', games: 198 },
  { rank: 2, name: '红甲战神', score: 21200, wins: 98, title: '虾将', games: 155 },
  { rank: 3, name: '沸腾小龙', score: 18900, wins: 87, title: '虾将', games: 143 },
  { rank: 4, name: '夜市霸主', score: 15600, wins: 71, title: '霸王虾', games: 120 },
  { rank: 5, name: '十三香侠', score: 12300, wins: 58, title: '霸王虾', games: 102 },
  { rank: 6, name: '麻辣虾神', score: 9800, wins: 43, title: '猛虾', games: 89 },
  { rank: 7, name: '清蒸霸主', score: 7600, wins: 35, title: '猛虾', games: 76 },
  { rank: 8, name: '蒜蓉小将', score: 5200, wins: 24, title: '猛虾', games: 61 },
  { rank: 9, name: '小龙新手', score: 2100, wins: 8, title: '小虾米', games: 32 },
  { rank: 10, name: '初出茅庐', score: 800, wins: 3, title: '小虾米', games: 18 },
];

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'score' | 'wins'>('score');

  const sorted = [...LEADERBOARD].sort((a, b) => tab === 'score' ? b.score - a.score : b.wins - a.wins)
    .map((p, i) => ({ ...p, rank: i + 1 }));

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
          <span style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: '20px', letterSpacing: '3px' }} className="gold-text">排行榜</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/lobby"><button className="btn-secondary" style={{ padding: '6px 16px', fontSize: '13px' }}>游戏大厅</button></Link>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 10 }}>
        {/* 前三名 */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '16px', marginBottom: '48px' }}>
          {[sorted[1], sorted[0], sorted[2]].map((p, idx) => {
            const isFirst = idx === 1;
            const heights = ['140px', '180px', '120px'];
            const medals = ['🥈', '🥇', '🥉'];
            const colors = ['var(--text-secondary)', 'var(--gold-light)', '#CD7F32'];
            return (
              <div key={p.rank} style={{
                flex: isFirst ? '0 0 200px' : '0 0 160px',
                textAlign: 'center',
              }}>
                <div style={{
                  background: isFirst ? 'rgba(241,196,15,0.1)' : 'var(--dark-card)',
                  border: `2px solid ${isFirst ? 'var(--gold)' : 'var(--dark-border)'}`,
                  borderRadius: '12px 12px 0 0',
                  height: heights[idx],
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '16px',
                  boxShadow: isFirst ? '0 0 30px rgba(241,196,15,0.2)' : 'none',
                }}>
                  <div style={{ fontSize: isFirst ? '48px' : '36px', marginBottom: '8px' }}>🦞</div>
                  <div style={{ color: colors[idx], fontWeight: 700, fontSize: isFirst ? '16px' : '14px' }}>{p.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>{p.title}</div>
                  <div style={{ color: colors[idx], fontWeight: 700, fontSize: isFirst ? '20px' : '16px', marginTop: '8px' }}>{(tab === 'score' ? p.score : p.wins).toLocaleString()}</div>
                </div>
                <div style={{
                  background: isFirst ? 'var(--gold)' : colors[idx],
                  height: '40px', borderRadius: '0 0 8px 8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px',
                }}>{medals[idx]}</div>
              </div>
            );
          })}
        </div>

        {/* Tab */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          {(['score', 'wins'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 24px', borderRadius: '4px', cursor: 'pointer',
              border: `1px solid ${tab === t ? 'var(--gold)' : 'var(--dark-border)'}`,
              background: tab === t ? 'rgba(243,156,18,0.1)' : 'transparent',
              color: tab === t ? 'var(--gold)' : 'var(--text-muted)',
              fontFamily: "'Noto Serif SC', serif", fontSize: '14px',
            }}>{t === 'score' ? '🏅 积分榜' : '⚔️ 胜利榜'}</button>
          ))}
        </div>

        {/* 榜单列表 */}
        <div>
          {sorted.map(p => (
            <div key={p.rank} style={{
              background: p.rank <= 3 ? 'rgba(241,196,15,0.04)' : 'var(--dark-card)',
              border: `1px solid ${p.rank <= 3 ? 'rgba(241,196,15,0.2)' : 'var(--dark-border)'}`,
              borderRadius: '8px', padding: '16px 24px', marginBottom: '8px',
              display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <span style={{ width: '32px', textAlign: 'center', fontSize: p.rank <= 3 ? '22px' : '16px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {p.rank <= 3 ? ['🥇','🥈','🥉'][p.rank-1] : `#${p.rank}`}
              </span>
              <span style={{ fontSize: '28px' }}>🦞</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: p.rank === 1 ? 'var(--gold-light)' : 'var(--text-primary)' }}>{p.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{p.title} · {p.games} 场</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--gold)' }}>{(tab === 'score' ? p.score : p.wins).toLocaleString()}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{tab === 'score' ? '积分' : '胜利'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

