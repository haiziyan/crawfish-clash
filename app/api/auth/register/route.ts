import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// 简单内存存储（生产环境请替换为数据库）
const users: Record<string, { id: string; nickname: string; email: string; password: string; score: number; inviteCode: string; invitedBy?: string }> = {};

export async function POST(req: NextRequest) {
  try {
    const { nickname, email, password, inviteCode } = await req.json();

    if (!nickname || !email || !password) {
      return NextResponse.json({ error: '请填写所有必填字段' }, { status: 400 });
    }
    if (nickname.length < 2 || nickname.length > 16) {
      return NextResponse.json({ error: '昵称长度需在2-16字之间' }, { status: 400 });
    }
    const existing = Object.values(users).find(u => u.email === email);
    if (existing) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 400 });
    }

    const id = uuidv4();
    const myInviteCode = 'XIAXIA' + nickname.slice(0, 3).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
    let bonusScore = 0;

    // 处理邀请码奖励
    if (inviteCode) {
      const inviter = Object.values(users).find(u => u.inviteCode === inviteCode);
      if (inviter) {
        inviter.score += 500;
        bonusScore = 500;
      }
    }

    users[id] = { id, nickname, email, password, score: bonusScore, inviteCode: myInviteCode, invitedBy: inviteCode };

    return NextResponse.json({
      user: { id, nickname, email, score: bonusScore, inviteCode: myInviteCode, title: '小虾米' },
    });
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

