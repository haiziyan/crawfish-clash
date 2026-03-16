import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function generateInviteCode(nickname: string): string {
  return 'XIAXIA' + nickname.slice(0, 3).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const { nickname, email, password, inviteCode } = await req.json();

    if (!nickname || !email || !password) {
      return NextResponse.json({ error: '请填写所有必填字段' }, { status: 400 });
    }
    if (nickname.length < 2 || nickname.length > 16) {
      return NextResponse.json({ error: '昵称长度需在2-16字之间' }, { status: 400 });
    }

    // 检查邮箱是否已注册
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 400 });
    }

    const myInviteCode = generateInviteCode(nickname);
    let bonusScore = 0;
    let inviterId: string | null = null;

    // 处理邀请码奖励
    if (inviteCode) {
      const { data: inviter } = await supabase
        .from('users')
        .select('id, score')
        .eq('invite_code', inviteCode)
        .single();

      if (inviter) {
        inviterId = inviter.id;
        bonusScore = 500;
        // 给邀请人加积分
        await supabase
          .from('users')
          .update({ score: inviter.score + 500 })
          .eq('id', inviter.id);
      }
    }

    // 插入新用户
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        nickname,
        email,
        password,
        score: bonusScore,
        invite_code: myInviteCode,
        invited_by: inviterId,
        title: '小虾米',
      })
      .select('id, nickname, email, score, invite_code, title')
      .single();

    if (insertError || !newUser) {
      console.error(insertError);
      return NextResponse.json({ error: '注册失败，请重试' }, { status: 500 });
    }

    return NextResponse.json({
      user: {
        id: newUser.id,
        nickname: newUser.nickname,
        email: newUser.email,
        score: newUser.score,
        inviteCode: newUser.invite_code,
        title: newUser.title,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
