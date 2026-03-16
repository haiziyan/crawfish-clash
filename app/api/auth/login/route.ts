import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: '请填写邮箱和密码' }, { status: 400 });
    }

    // 查询用户
    const { data: user, error } = await supabase
      .from('users')
      .select('id, nickname, email, password, score, invite_code, title')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        score: user.score,
        inviteCode: user.invite_code,
        title: user.title,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
