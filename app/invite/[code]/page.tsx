'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InvitePage() {
  const { code } = useParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/register?invite=${code}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [code, router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'radial-gradient(ellipse at center, rgba(139,26,26,0.15) 0%, transparent 70%)' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(61,43,20,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(61,43,20,0.2) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%', position: 'relative', zIndex: 10 }}>
        <div style={{ fontSize: '80px', marginBottom: '24px', animation: 'float 2s ease-in-out infinite' }}>🦞</div>
        <h1 style={{ fontFamily: "'Ma Shan Zheng', cursive", fontSize: '48px', marginBottom: '8px', letterSpacing: '6px' }} className="gold-text">小龙虾大战</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '32px', lineHeight: 1.8 }}>
          你的好友邀请你加入战场！<br />
          注册即可获得 <span style={{ color: 'var(--gold)', fontWeight: 700 }}>500 积分</span> + <span style={{ color: 'var(--red-bright)', fontWeight: 700 }}>限定皮肤</span>！
        </p>

        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>邀请码</div>
          <div style={{ fontFamily: 'monospace', fontSize: '22px', color: 'var(--gold)', letterSpacing: '4px', fontWeight: 700 }}>{code}</div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '48px', fontWeight: 900, color: 'var(--red-bright)', fontFamily: 'monospace' }}>{countdown}</span>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>秒后自动跳转注册...</div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn-primary" style={{ fontSize: '16px', padding: '14px 36px' }} onClick={() => router.push(`/register?invite=${code}`)}>
            立即注册 🦞
          </button>
          <Link href="/login"><button className="btn-secondary">已有账号</button></Link>
        </div>
      </div>
    </div>
  );
}

