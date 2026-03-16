'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Player {
  id: string;
  name: string;
  x: number;
  y: number;
  size: number;
  hp: number;
  maxHp: number;
  score: number;
  color: string;
  angle: number;
  isMe?: boolean;
}

interface Food {
  id: string;
  x: number;
  y: number;
  type: 'normal' | 'spicy' | 'steam';
}

const COLORS = ['#E74C3C','#E67E22','#F1C40F','#2ECC71','#3498DB','#9B59B6','#1ABC9C','#E91E63'];
const MAP_W = 2400;
const MAP_H = 2400;
const ARENA_R = 1100;

function randInt(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }

function generateFoods(count: number): Food[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * ARENA_R * 0.9;
    return {
      id: `f${i}`,
      x: MAP_W / 2 + Math.cos(angle) * r,
      y: MAP_H / 2 + Math.sin(angle) * r,
      type: Math.random() < 0.1 ? 'spicy' : Math.random() < 0.15 ? 'steam' : 'normal',
    };
  });
}

function generateBots(count: number): Player[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * ARENA_R * 0.7;
    return {
      id: `bot${i}`,
      name: ['红甲王','小霸虾','虾神','钳子侠','沸腾怪','麻辣王'][i % 6],
      x: MAP_W / 2 + Math.cos(angle) * r,
      y: MAP_H / 2 + Math.sin(angle) * r,
      size: randInt(20, 45),
      hp: 100, maxHp: 100,
      score: randInt(10, 200),
      color: COLORS[(i + 1) % COLORS.length],
      angle: Math.random() * Math.PI * 2,
      isMe: false,
    };
  });
}

export default function GamePage() {
  const { roomId } = useParams();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    player: {
      id: 'me', name: '我', x: MAP_W / 2, y: MAP_H / 2,
      size: 24, hp: 100, maxHp: 100, score: 0,
      color: COLORS[0], angle: 0, isMe: true,
    } as Player,
    bots: generateBots(6),
    foods: generateFoods(80),
    mouseX: 0, mouseY: 0,
    skills: { q: 0, w: 0, e: 0 },
    gameOver: false,
    timeLeft: 300,
  });
  const [hud, setHud] = useState({ hp: 100, score: 0, timeLeft: 300, players: 7, rank: 1 });
  const [gameOver, setGameOver] = useState(false);
  const [skills, setSkills] = useState({ q: 0, w: 0, e: 0 });
  const animRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);

    const onMouseMove = (e: MouseEvent) => {
      stateRef.current.mouseX = e.clientX;
      stateRef.current.mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const now = Date.now();
      if (e.key === 'q' || e.key === 'Q') {
        if (now - s.skills.q > 3000) {
          s.skills.q = now;
          s.player.size = Math.max(s.player.size * 0.95, 20);
          const dx = Math.cos(s.player.angle) * 80;
          const dy = Math.sin(s.player.angle) * 80;
          s.player.x = Math.max(50, Math.min(MAP_W - 50, s.player.x + dx));
          s.player.y = Math.max(50, Math.min(MAP_H - 50, s.player.y + dy));
          setSkills({ ...s.skills });
        }
      }
      if (e.key === 'e' || e.key === 'E') {
        if (now - s.skills.e > 5000) {
          s.skills.e = now;
          setSkills({ ...s.skills });
        }
      }
      if (e.key === 'w' || e.key === 'W') {
        if (now - s.skills.w > 4000) {
          s.skills.w = now;
          setSkills({ ...s.skills });
        }
      }
    };
    window.addEventListener('keydown', onKey);

    timerRef.current = setInterval(() => {
      stateRef.current.timeLeft -= 1;
      if (stateRef.current.timeLeft <= 0) {
        stateRef.current.gameOver = true;
        setGameOver(true);
      }
    }, 1000);

    let lastTime = 0;
    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      const s = stateRef.current;
      if (s.gameOver) return;

      // Move player toward mouse
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const dx = s.mouseX - cx;
      const dy = s.mouseY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 10) {
        const speed = Math.max(80, 180 - s.player.size * 1.5);
        s.player.angle = Math.atan2(dy, dx);
        s.player.x += (dx / dist) * speed * dt;
        s.player.y += (dy / dist) * speed * dt;
        s.player.x = Math.max(50, Math.min(MAP_W - 50, s.player.x));
        s.player.y = Math.max(50, Math.min(MAP_H - 50, s.player.y));
      }

      // Boundary damage
      const cx2 = MAP_W / 2, cy2 = MAP_H / 2;
      const distFromCenter = Math.sqrt((s.player.x - cx2) ** 2 + (s.player.y - cy2) ** 2);
      if (distFromCenter > ARENA_R) s.player.hp -= dt * 15;

      // Eat food
      s.foods = s.foods.filter(f => {
        const d = Math.sqrt((f.x - s.player.x) ** 2 + (f.y - s.player.y) ** 2);
        if (d < s.player.size + 8) {
          s.player.score += f.type === 'spicy' ? 5 : f.type === 'steam' ? 3 : 1;
          s.player.size += f.type === 'spicy' ? 0.8 : 0.4;
          return false;
        }
        return true;
      });
      if (s.foods.length < 40) s.foods.push(...generateFoods(10));

      // Move bots
      s.bots.forEach(bot => {
        bot.angle += (Math.random() - 0.5) * 0.1;
        const spd = 60 + Math.random() * 40;
        bot.x += Math.cos(bot.angle) * spd * dt;
        bot.y += Math.sin(bot.angle) * spd * dt;
        const bd = Math.sqrt((bot.x - cx2) ** 2 + (bot.y - cy2) ** 2);
        if (bd > ARENA_R * 0.95) {
          bot.angle += Math.PI * 0.5;
        }
        bot.x = Math.max(50, Math.min(MAP_W - 50, bot.x));
        bot.y = Math.max(50, Math.min(MAP_H - 50, bot.y));
        // Bot eat food
        s.foods = s.foods.filter(f => {
          const d = Math.sqrt((f.x - bot.x) ** 2 + (f.y - bot.y) ** 2);
          if (d < bot.size + 8) { bot.score += 1; bot.size += 0.2; return false; }
          return true;
        });
      });

      // Collision player vs bots
      s.bots = s.bots.filter(bot => {
        const d = Math.sqrt((bot.x - s.player.x) ** 2 + (bot.y - s.player.y) ** 2);
        if (d < s.player.size + bot.size) {
          if (s.player.size > bot.size * 1.1) {
            s.player.score += bot.score + 20;
            s.player.size += bot.size * 0.3;
            return false;
          } else if (bot.size > s.player.size * 1.1) {
            s.player.hp -= dt * 30;
          }
        }
        return true;
      });

      if (s.player.hp <= 0) { s.gameOver = true; setGameOver(true); return; }

      // Compute rank
      const allScores = [s.player.score, ...s.bots.map(b => b.score)].sort((a, b) => b - a);
      const rank = allScores.indexOf(s.player.score) + 1;

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0D0A08';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const camX = canvas.width / 2 - s.player.x;
      const camY = canvas.height / 2 - s.player.y;

      ctx.save();
      ctx.translate(camX, camY);

      // Draw grid
      ctx.strokeStyle = 'rgba(61,43,20,0.4)';
      ctx.lineWidth = 1;
      const gs = 80;
      for (let gx = 0; gx < MAP_W; gx += gs) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, MAP_H); ctx.stroke(); }
      for (let gy = 0; gy < MAP_H; gy += gs) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(MAP_W, gy); ctx.stroke(); }

      // Arena circle
      ctx.beginPath();
      ctx.arc(MAP_W / 2, MAP_H / 2, ARENA_R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(231,76,60,0.6)';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = 'rgba(231,76,60,0.03)';
      ctx.fill();

      // Danger zone
      ctx.beginPath();
      ctx.arc(MAP_W / 2, MAP_H / 2, ARENA_R + 20, 0, Math.PI * 2);
      ctx.arc(MAP_W / 2, MAP_H / 2, ARENA_R, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(231,76,60,0.15)';
      ctx.fill('evenodd');

      // Draw foods
      s.foods.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.type === 'normal' ? 5 : 8, 0, Math.PI * 2);
        ctx.fillStyle = f.type === 'spicy' ? '#FF6B35' : f.type === 'steam' ? '#74B9FF' : '#A8E063';
        ctx.fill();
        if (f.type !== 'normal') {
          ctx.beginPath();
          ctx.arc(f.x, f.y, 12, 0, Math.PI * 2);
          ctx.strokeStyle = f.type === 'spicy' ? 'rgba(255,107,53,0.4)' : 'rgba(116,185,255,0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw bots
      s.bots.forEach(bot => {
        // Body
        ctx.beginPath();
        ctx.arc(bot.x, bot.y, bot.size, 0, Math.PI * 2);
        ctx.fillStyle = bot.color + '33';
        ctx.fill();
        ctx.strokeStyle = bot.color;
        ctx.lineWidth = 3;
        ctx.stroke();
        // Emoji text
        ctx.save();
        ctx.translate(bot.x, bot.y);
        ctx.rotate(bot.angle);
        ctx.font = `${bot.size * 1.4}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🦞', 0, 0);
        ctx.restore();
        // Name
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = '12px Noto Serif SC, serif';
        ctx.textAlign = 'center';
        ctx.fillText(bot.name, bot.x, bot.y - bot.size - 8);
        // HP bar
        const bw = bot.size * 2;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(bot.x - bw / 2, bot.y - bot.size - 24, bw, 5);
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(bot.x - bw / 2, bot.y - bot.size - 24, bw * (bot.hp / bot.maxHp), 5);
      });

      // Draw player
      const p = s.player;
      // Glow
      const grd = ctx.createRadialGradient(p.x, p.y, p.size * 0.5, p.x, p.y, p.size * 2);
      grd.addColorStop(0, 'rgba(231,76,60,0.3)');
      grd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      // Body
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(231,76,60,0.2)';
      ctx.fill();
      ctx.strokeStyle = '#E74C3C';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Emoji
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.font = `${p.size * 1.5}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🦞', 0, 0);
      ctx.restore();
      // Name
      ctx.fillStyle = '#F1C40F';
      ctx.font = 'bold 13px Noto Serif SC, serif';
      ctx.textAlign = 'center';
      ctx.fillText('我', p.x, p.y - p.size - 8);

      ctx.restore();

      setHud({ hp: Math.max(0, Math.round(p.hp)), score: p.score, timeLeft: s.timeLeft, players: s.bots.length + 1, rank });
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKey);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const getSkillCd = (key: 'q' | 'w' | 'e', maxCd: number) => {
    const elapsed = Date.now() - skills[key];
    return elapsed >= maxCd ? 0 : Math.ceil((maxCd - elapsed) / 1000);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0D0A08', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />

      {/* HUD */}
      <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 50,
        display: 'flex', gap: '24px', alignItems: 'center',
        background: 'rgba(13,10,8,0.85)', backdropFilter: 'blur(8px)',
        border: '1px solid var(--dark-border)', borderRadius: '40px', padding: '10px 28px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>剩余时间</div>
        </div>
        <div style={{ width: '1px', height: '32px', background: 'var(--dark-border)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--red-bright)' }}>#{hud.rank}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>排名</div>
        </div>
        <div style={{ width: '1px', height: '32px', background: 'var(--dark-border)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--gold)' }}>{hud.score}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>积分</div>
        </div>
        <div style={{ width: '1px', height: '32px', background: 'var(--dark-border)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#4CAF50' }}>{hud.players}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>存活</div>
        </div>
      </div>

      {/* HP Bar */}
      <div style={{ position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)', zIndex: 50, width: '280px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>❤️ HP</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{hud.hp}/100</span>
        </div>
        <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${hud.hp}%`, background: hud.hp > 50 ? '#4CAF50' : hud.hp > 25 ? 'var(--gold)' : 'var(--red-bright)', borderRadius: '5px', transition: 'width 0.2s' }} />
        </div>
      </div>

      {/* Skills */}
      <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 50, display: 'flex', gap: '12px' }}>
        {([['Q', '冲刺', 3000, 'q'], ['W', '防御', 4000, 'w'], ['E', '喷水', 5000, 'e']] as [string, string, number, 'q'|'w'|'e'][]).map(([key, name, cd, k]) => {
          const cdLeft = getSkillCd(k, cd);
          return (
            <div key={key} style={{
              width: '64px', height: '64px', borderRadius: '8px',
              background: cdLeft > 0 ? 'rgba(0,0,0,0.6)' : 'rgba(192,57,43,0.3)',
              border: `2px solid ${cdLeft > 0 ? 'var(--dark-border)' : 'var(--red-main)'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              {cdLeft > 0 && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: 'white', fontFamily: 'monospace' }}>{cdLeft}</span>
                </div>
              )}
              <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--gold)' }}>{key}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{name}</div>
            </div>
          );
        })}
      </div>

      {/* 退出按钮 */}
      <button onClick={() => router.push('/lobby')} style={{
        position: 'fixed', top: 16, right: 16, zIndex: 50,
        background: 'rgba(13,10,8,0.85)', border: '1px solid var(--dark-border)',
        borderRadius: '8px', padding: '8px 16px', color: 'var(--text-muted)',
        fontFamily: "'Noto Serif SC', serif", cursor: 'pointer', fontSize: '13px',
      }}>退出</button>

      {/* 游戏提示 */}
      <div style={{ position: 'fixed', top: 80, left: 16, zIndex: 50,
        background: 'rgba(13,10,8,0.7)', border: '1px solid var(--dark-border)',
        borderRadius: '8px', padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)',
        lineHeight: 2,
      }}>
        <div>🖱️ 鼠标控制移动</div>
        <div>Q 冲刺夹击</div>
        <div>W 防御硬壳</div>
        <div>E 喷水攻击</div>
      </div>

      {/* 游戏结束弹窗 */}
      {gameOver && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--dark-card)', border: '1px solid var(--dark-border)',
            borderRadius: '16px', padding: '48px 40px', textAlign: 'center', minWidth: '360px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--red-main), var(--gold))' }} />
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>{hud.rank === 1 ? '🏆' : '🦞'}</div>
            <h2 style={{ fontFamily: "'ZCOOL XiaoWei', serif", fontSize: '32px', letterSpacing: '4px', marginBottom: '8px' }} className="gold-text">
              {hud.rank === 1 ? '虾王！' : '战斗结束'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
              最终排名 #{hud.rank} · 得分 {hud.score} 分
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => window.location.reload()}>再战一局 🦞</button>
              <button className="btn-secondary" onClick={() => router.push('/lobby')}>返回大厅</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
