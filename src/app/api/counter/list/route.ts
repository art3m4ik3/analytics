import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { Counter } from '@/models/Counter';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Токен не предоставлен' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: 'Недействительный токен' },
        { status: 401 }
      );
    }

    const counters = await Counter.find({
      userId: payload.userId
    }).select('-_id -__v').sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      counters: counters.map(counter => ({
        id: counter.counterId,
        name: counter.name,
        domain: counter.domain,
        createdAt: counter.createdAt,
        isActive: counter.isActive
      }))
    });

  } catch (error) {
    console.error('Ошибка получения счетчиков:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
