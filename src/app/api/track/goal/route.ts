import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { Counter } from '@/models/Counter';
import { Goal } from '@/models/Goal';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const {
      counterId,
      sessionId,
      goalName,
      goalValue,
      metadata
    } = await request.json();

    if (!counterId || !sessionId || !goalName) {
      return NextResponse.json(
        { error: 'counterId, sessionId и goalName обязательны' },
        { status: 400 }
      );
    }

    const counter = await Counter.findOne({
      counterId,
      isActive: true
    });

    if (!counter) {
      return NextResponse.json(
        { error: 'Счетчик не найден' },
        { status: 404 }
      );
    }

    const goal = new Goal({
      counterId,
      sessionId,
      goalName: goalName.trim(),
      goalValue: goalValue ? Number(goalValue) : undefined,
      metadata: metadata || {},
      timestamp: new Date()
    });

    await goal.save();

    return NextResponse.json({
      success: true,
      goalId: goal._id,
      timestamp: goal.timestamp
    });

  } catch (error) {
    console.error('Ошибка трекинга цели:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
