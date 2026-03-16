import { NextRequest, NextResponse } from 'next/server';

// 共享内存存储（简单演示，生产用数据库）
const DEMO_USER = {
  id: 'demo-1',
  nickname: '演示玩家',
  email: 'demo@crawfish.com',
  password: '123456',
  score: 1200,
  inviteCode: 'XIAXIADEMO',
  title: '猛虾',
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: '请填写邮箱和密码' }, { status: 400 });
    }

    // 演示：允许 demo 账号或任意注册账号登录
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const { password: _, ...user } = DEMO_USER;
      return NextResponse.json({ user });
    }

    // 实际项目中在此查询数据库
    return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

