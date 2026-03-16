'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const TITLES = [
  { name: '小虾米', min: 0, color: '#7A6048', emoji: '🦐' },
  { name: '猛虾', min: 500, color: '#C4A882', emoji: '🦞' },
  { name: '霸王虾', min: 2000, color: 'var(--gold)', emoji: '🦞' },
  { name: '虾将', min: 5000, color: 'var(--red-bright)', emoji: '🦞' },
  { name: '小龙虾之王', min: 10000, color: 'var(--gold-light)', emoji: '👑' },
];

function getTitle(score: number) {
  return [...TITLES].reverse().find(t => score >= t.min) || TITLES[0];
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ nickname: string; email: string; score: number; inviteCode: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (!u.inviteCode) u.inviteCode = 'XIAXIA' + (u.nickname?.slice(0,3).toUpperCase() || 'XXX');
        if (!u.score) u.score = 0;
        setUser(u);
      } catch {}
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const copyInvite = () => {
    if (!user) return;
    navigator.clipboard.writeText(`https://crawfish-clash.vercel.app/invite/${user.inviteCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-muted)' }}>加载中...</div>
    </div>
  );

  const title = getTitle(user.score);
  const nextTitle = TITLES.find(t => t.min > user.score);
  const progress = nextTitle ? ((user.score - (getTitle(user.score).min)) / (nextTitle.min - getTitle(user.score).min)) * 100 : 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(61,43,20,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(61,43,20,0.2) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(13,10,8,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--dark-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/"><span style={{ fontSize: '24px' }} className="claw-shake">🦞</span></Link>
          <span style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: '20px', letterSpacing: '3px' }} className="gold-text">我的主页</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/lobby"><button className="btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>进入大厅</button></Link>
          <button className="btn-secondary" style={{ padding: '6px 16px', fontSize: '13px' }} onClick={handleLogout}>退出登录</button>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 10 }}>
        {/* 用户卡片 */}
        <div style={{ background: 'linear-gradient(135deg, rgba(139,26,26,0.2), var(--dark-card))', border: '1px solid rgba(192,57,43,0.3)', borderRadius: '16px', padding: '40px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(192,57,43,0.2)', border: '3px solid var(--red-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>🦞</div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, fontSize: '24px' }}>{title.emoji}</div>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{user.nickname}</h2>
            <div style={{ color: title.color, fontWeight: 600, fontSize: '16px', marginBottom: '16px' }}>{title.name}</div>
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>段位进度</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{nextTitle ? `距${nextTitle.name} ${nextTitle.min - user.score}分` : '已达最高段位'}</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, progress)}%`, background: `linear-gradient(90deg, var(--red-main), var(--gold))`, borderRadius: '4px', transition: 'width 0.5s' }} />
            </div>
          </div>
        </div>

        {/* 统计数据 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: '总积分', value: user.score.toLocaleString(), color: 'var(--gold)', icon: '🏅' },
            { label: '总场次', value: '0', color: 'var(--text-primary)', icon: '🎮' },
            { label: '胜利次数', value: '0', color: '#4CAF50', icon: '🏆' },
            { label: '邀请人数', value: '0', color: 'var(--red-bright)', icon: '🎁' },
          ].map(stat => (
            <div key={stat.label} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 邀请码 */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ color: 'var(--gold)', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>🎁 我的邀请码</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px', lineHeight: 1.7 }}>分享你的邀请码，好友注册并完成首局后，双方各获得 500 积分 + 限定皮肤！</p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, background: 'rgba(243,156,18,0.08)', border: '1px solid rgba(243,156,18,0.2)', borderRadius: '6px', padding: '12px 16px', fontFamily: 'monospace', fontSize: '16px', color: 'var(--gold)', letterSpacing: '3px', minWidth: '200px' }}>
              {user.inviteCode}
            </div>
            <button className="btn-primary" onClick={copyInvite} style={{ whiteSpace: 'nowrap' }}>
              {copied ? '✅ 已复制！' : '复制邀请链接'}
            </button>
          </div>
          <div style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '13px', wordBreak: 'break-all' }}>
            https://crawfish-clash.vercel.app/invite/{user.inviteCode}
          </div>
        </div>

        {/* 快捷操作 */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/lobby"><button className="btn-primary" style={{ flex: 1, minWidth: '160px' }}>🦞 进入游戏大厅</button></Link>
          <Link href="/leaderboard"><button className="btn-secondary" style={{ flex: 1, minWidth: '160px' }}>🏆 查看排行榜</button></Link>
        </div>
      </div>
    </div>
  );
}

