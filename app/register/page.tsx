'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nickname: '', email: '', password: '', confirm: '', inviteCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('两次密码不一致'); return; }
    if (form.password.length < 6) { setError('密码至少6位'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: form.nickname, email: form.email, password: form.password, inviteCode: form.inviteCode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || '注册失败'); return; }
      localStorage.setItem('user', JSON.stringify(data.user));
      setStep(2);
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{
          background: 'var(--dark-card)', border: '1px solid var(--dark-border)',
          borderRadius: '12px', padding: '48px 40px', textAlign: 'center', maxWidth: '440px', width: '100%',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--red-main), var(--gold))' }} />
          <div style={{ fontSize: '72px', marginBottom: '24px', animation: 'float 2s ease-in-out infinite' }}>🦞</div>
          <h2 style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: '28px', color: 'var(--gold)', marginBottom: '16px', letterSpacing: '3px' }}>注册成功！</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.8 }}>欢迎加入小龙虾大战！</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>你的专属邀请码已生成，快去邀请好友一起开战吧！</p>
          <button className="btn-primary" style={{ width: '100%', marginBottom: '12px' }} onClick={() => router.push('/lobby')}>
            进入游戏大厅 🦞
          </button>
          <button className="btn-secondary" style={{ width: '100%' }} onClick={() => router.push('/profile')}>
            查看我的主页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      background: 'radial-gradient(ellipse at center, rgba(139,26,26,0.1) 0%, transparent 70%)',
    }}>
      {/* 背景网格 */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(61,43,20,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(61,43,20,0.2) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link href="/">
            <span style={{ fontSize: '36px', display: 'inline-block' }} className="claw-shake">🦞</span>
          </Link>
          <h1 style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: '22px', letterSpacing: '4px', marginTop: '6px' }} className="gold-text">小龙虾大战</h1>
        </div>

        <div style={{
          background: 'var(--dark-card)', border: '1px solid var(--dark-border)',
          borderRadius: '12px', padding: 'clamp(20px, 5vw, 40px)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--red-main), var(--gold))' }} />
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', letterSpacing: '2px' }}>创建账号</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>加入战场，成为最强小龙虾</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px', letterSpacing: '1px' }}>游戏昵称 *</label>
              <input className="input-field" name="nickname" value={form.nickname} onChange={handleChange} placeholder="给你的小龙虾起个名字" required maxLength={16} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px', letterSpacing: '1px' }}>邮箱 *</label>
              <input className="input-field" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px', letterSpacing: '1px' }}>密码 *</label>
              <input className="input-field" name="password" type="password" value={form.password} onChange={handleChange} placeholder="至少6位" required />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px', letterSpacing: '1px' }}>确认密码 *</label>
              <input className="input-field" name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="再输一遍密码" required />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px', letterSpacing: '1px' }}>
                邀请码 <span style={{ color: 'var(--text-muted)' }}>(选填，填写可获得奖励)</span>
              </label>
              <input className="input-field" name="inviteCode" value={form.inviteCode} onChange={handleChange} placeholder="输入好友邀请码" />
            </div>

            {error && (
              <div style={{
                background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)',
                borderRadius: '6px', padding: '12px 16px', marginBottom: '20px',
                color: 'var(--red-bright)', fontSize: '14px',
              }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '16px' }} disabled={loading}>
              {loading ? '注册中...' : '立即注册，开始战斗！'}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            已有账号？{' '}
            <Link href="/login" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>立即登录</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

