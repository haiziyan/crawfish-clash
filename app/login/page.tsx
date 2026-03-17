'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || '登录失败'); return; }
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/lobby');
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      background: 'radial-gradient(ellipse at center, rgba(139,26,26,0.1) 0%, transparent 70%)',
    }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(61,43,20,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(61,43,20,0.2) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link href="/">
            <span style={{ fontSize: '36px', display: 'inline-block' }} className="claw-shake">🦞</span>
          </Link>
          <h1 style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: '22px', letterSpacing: '4px', marginTop: '6px' }} className="gold-text">小龙虾大战</h1>
        </div>

        <div style={{
          background: 'var(--dark-card)', border: '1px solid var(--dark-border)',
          borderRadius: '12px', padding: 'clamp(24px, 6vw, 40px)', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--gold), var(--red-main))' }} />
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', letterSpacing: '2px' }}>欢迎回来</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>虾池还在等你，快来开战！</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px', letterSpacing: '1px' }}>邮箱</label>
              <input className="input-field" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
            </div>
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px', letterSpacing: '1px' }}>密码</label>
              <input className="input-field" name="password" type="password" value={form.password} onChange={handleChange} placeholder="输入密码" required />
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
              {loading ? '登录中...' : '登录，进入战场！'}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            还没有账号？{' '}
            <Link href="/register" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>免费注册</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

