'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

function BubbleBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: `${(i * 8.5) % 100}%`,
            width: `${8 + (i % 4) * 6}px`,
            height: `${8 + (i % 4) * 6}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(231,76,60,0.4), rgba(139,26,26,0.1))',
            border: '1px solid rgba(231,76,60,0.3)',
            animation: `bubble ${4 + (i % 5)}s ${i * 0.7}s ease-in infinite`,
          }}
        />
      ))}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(61,43,20,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(61,43,20,0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(192,57,43,0.08) 0%, transparent 70%)',
      }} />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="card" style={{ textAlign: 'center', flex: '1', minWidth: '200px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ color: 'var(--gold)', fontSize: '18px', fontWeight: 700, marginBottom: '10px', letterSpacing: '1px' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7' }}>{desc}</p>
    </div>
  );
}

export default function HomePage() {
  const [onlineCount] = useState(Math.floor(Math.random() * 500) + 128);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100);
  }, []);

  return (
    <>
      <BubbleBackground />

      {/* 导航栏 */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 40px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(13,10,8,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--dark-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }} className="claw-shake">🦞</span>
          <span style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: '22px', fontWeight: 700, letterSpacing: '3px' }} className="gold-text">小龙虾大战</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            <span style={{ color: '#4CAF50', marginRight: '6px' }}>●</span>
            {onlineCount} 人在线
          </span>
          <Link href="/login"><button className="btn-secondary" style={{ padding: '8px 20px', fontSize: '14px' }}>登录</button></Link>
          <Link href="/register"><button className="btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>注册</button></Link>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 10, paddingTop: '64px' }}>

        {/* Hero */}
        <section style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '40px 20px', position: 'relative',
        }}>
          <div className="game-badge badge-hot" style={{ marginBottom: '24px' }}>🔥 最火爆的多人对战游戏</div>

          <h1 ref={titleRef} style={{
            fontFamily: "'Ma Shan Zheng', cursive",
            fontSize: 'clamp(56px, 10vw, 120px)',
            lineHeight: 1.1, marginBottom: '8px', letterSpacing: '8px',
          }}>
            <span className="gold-text">小龙虾</span>
          </h1>
          <h2 style={{
            fontFamily: "'ZCOOL XiaoWei', serif",
            fontSize: 'clamp(28px, 5vw, 56px)',
            color: 'var(--text-primary)',
            letterSpacing: '12px', marginBottom: '32px',
          }}>大 战</h2>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                fontSize: '56px',
                display: 'block',
                animation: `float ${2.5 + i * 0.5}s ${i * 0.3}s ease-in-out infinite`,
                filter: `hue-rotate(${i * 20}deg)`,
              }}>🦞</span>
            ))}
          </div>

          <p style={{
            color: 'var(--text-secondary)', fontSize: '18px',
            maxWidth: '520px', lineHeight: 1.8, marginBottom: '48px', letterSpacing: '1px',
          }}>
            控制你的小龙虾，横扫全场！<br />
            吃食物成长，击败敌人称霸虾池，登上王者榜单！
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/register">
              <button className="btn-primary" style={{ fontSize: '18px', padding: '16px 48px', letterSpacing: '4px' }}>
                立即开战 🦞
              </button>
            </Link>
            <Link href="/lobby">
              <button className="btn-secondary" style={{ fontSize: '18px', padding: '16px 40px' }}>
                进入大厅
              </button>
            </Link>
          </div>

          <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)' }}>
            <div style={{
              width: '24px', height: '40px',
              border: '2px solid var(--dark-border)',
              borderRadius: '12px',
              display: 'flex', justifyContent: 'center', paddingTop: '6px',
            }}>
              <div style={{
                width: '4px', height: '8px',
                background: 'var(--gold)', borderRadius: '2px',
                animation: 'float 1.5s ease-in-out infinite',
              }} />
            </div>
          </div>
        </section>

        {/* 特色 */}
        <section style={{ padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{
            textAlign: 'center', fontFamily: "'ZCOOL XiaoWei', serif",
            fontSize: '36px', marginBottom: '16px', letterSpacing: '4px',
          }} className="gold-text">游戏特色</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '48px', letterSpacing: '1px' }}>四大核心玩法，乐趣无穷</p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <FeatureCard icon="⚔️" title="实时对战" desc="与来自全国的玩家同场竞技，低延迟实时对战，每一局都刺激无比" />
            <FeatureCard icon="🌶️" title="成长进化" desc="吃遍虾饵不断成长，体型越大战斗力越强，从小虾米逆袭为霸王虾" />
            <FeatureCard icon="💥" title="技能系统" desc="冲刺夹击、防御硬壳、喷水攻击，三大技能组合出无限战术可能" />
            <FeatureCard icon="🏆" title="段位排行" desc="从小虾米到小龙虾之王，积累积分提升段位，登上全服排行榜" />
          </div>
        </section>

        {/* 游戏规则 */}
        <section style={{ padding: '80px 40px', background: 'linear-gradient(180deg, transparent, rgba(26,17,8,0.8), transparent)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{
              textAlign: 'center', fontFamily: "'ZCOOL XiaoWei', serif",
              fontSize: '36px', marginBottom: '48px', letterSpacing: '4px',
            }}>游戏规则 <span style={{ fontSize: '28px' }}>📜</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {[
                { num: '01', title: '移动与成长', text: '用鼠标控制龙虾移动，吃到虾饵可以增加体重和体型，体型越大碰撞伤害越高。' },
                { num: '02', title: '战斗规则', text: '较大的龙虾撞击较小的会造成伤害，HP归零即被淘汰，可吞噬对方获得大量成长。' },
                { num: '03', title: '技能使用', text: 'Q冲刺夹击、W防御硬壳、E喷水攻击，每个技能都有冷却时间，合理使用才能获胜。' },
                { num: '04', title: '积分结算', text: '单局5分钟，吃食物、击败敌人、存活时间都会产生积分，结算时积分最高者获胜。' },
              ].map(rule => (
                <div key={rule.num} className="card" style={{ borderLeft: '3px solid var(--red-main)' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: 'rgba(192,57,43,0.3)', marginBottom: '8px', fontFamily: 'monospace' }}>{rule.num}</div>
                  <h3 style={{ color: 'var(--gold)', fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{rule.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7' }}>{rule.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 段位系统 */}
        <section style={{ padding: '80px 40px', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'ZCOOL XiaoWei', serif",
            fontSize: '36px', marginBottom: '16px', letterSpacing: '4px',
          }} className="gold-text">段位系统</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>不断积累积分，晋升专属称号</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { title: '小虾米', color: '#7A6048', emoji: '🦐', min: '0' },
              { title: '猛虾', color: '#C4A882', emoji: '🦞', min: '500' },
              { title: '霸王虾', color: 'var(--gold)', emoji: '🦞', min: '2000' },
              { title: '虾将', color: 'var(--red-bright)', emoji: '🦞', min: '5000' },
              { title: '小龙虾之王', color: 'var(--gold-light)', emoji: '👑', min: '10000' },
            ].map(rank => (
              <div key={rank.title} style={{
                padding: '16px 20px', textAlign: 'center',
                background: 'var(--dark-card)',
                border: `1px solid ${rank.color}40`,
                borderRadius: '8px', minWidth: '110px',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{rank.emoji}</div>
                <div style={{ color: rank.color, fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{rank.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{rank.min}+ 分</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{
          padding: '100px 40px', textAlign: 'center',
          background: 'linear-gradient(180deg, transparent, rgba(139,26,26,0.15), transparent)',
        }}>
          <h2 style={{
            fontFamily: "'ZCOOL XiaoWei', serif",
            fontSize: '42px', marginBottom: '16px', letterSpacing: '4px',
          }}>准备好了吗？</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '40px' }}>加入战场，成为最强小龙虾！</p>
          <Link href="/register">
            <button className="btn-primary glow-pulse" style={{ fontSize: '20px', padding: '18px 60px', letterSpacing: '4px' }}>
              免费注册，立即开战！
            </button>
          </Link>
        </section>

        {/* 邀请区 */}
        <section style={{ padding: '60px 40px', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div className="card">
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎁</div>
            <h3 style={{ color: 'var(--gold)', fontSize: '22px', fontWeight: 700, marginBottom: '12px', letterSpacing: '2px' }}>邀请好友，共同开战！</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
              注册后获得专属邀请码，每成功邀请1位好友<br />
              双方各获得「虾将」限定皮肤 + 500积分奖励！
            </p>
            <Link href="/register">
              <button className="btn-primary">注册领取邀请码</button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: '40px',
          borderTop: '1px solid var(--dark-border)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '14px',
        }}>
          <div style={{ marginBottom: '16px' }}>
            <span className="claw-shake" style={{ fontSize: '24px', display: 'inline-block' }}>🦞</span>
          </div>
          <p>© 2026 小龙虾大战 · Crawfish Clash · 沸腾虾池，称霸全场</p>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
            <Link href="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>注册</Link>
            <Link href="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>登录</Link>
            <Link href="/lobby" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>游戏大厅</Link>
            <Link href="/leaderboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>排行榜</Link>
          </div>
        </footer>
      </main>
    </>
  );
}
