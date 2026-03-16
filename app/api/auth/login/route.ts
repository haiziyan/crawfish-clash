import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: '请填写邮箱和密码' }, { status: 400 });
    }

    const supabase = getSupabase();

    // 使用 maybeSingle() 避免无匹配时抛出错误
    const { data: user, error } = await supabase
      .from('users')
      .select('id, nickname, email, password, score, invite_code, title')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('[login] db error:', error);
      return NextResponse.json({ error: '服务器错误', detail: error.message }, { status: 500 });
    }

    if (!user) {
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
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[login]', msg);
    return NextResponse.json({ error: '服务器错误', detail: msg }, { status: 500 });
  }
}
