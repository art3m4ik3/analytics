import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import { Counter } from '@/models/Counter';
import { PageView } from '@/models/PageView';
import { getClientIP, generateSessionId, getCountryFromIP } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const {
      counterId,
      url,
      referrer,
      sessionId: providedSessionId
    } = await request.json();

    if (!counterId || !url) {
      return NextResponse.json(
        { error: 'counterId и url обязательны' },
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
    }    const sessionId = providedSessionId || generateSessionId();
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const ip = getClientIP(request);
    const country = await getCountryFromIP(ip);

    const pageView = new PageView({
      counterId,
      sessionId,
      url: url.trim(),
      referrer: referrer?.trim(),
      userAgent,
      ip,
      country,
      timestamp: new Date()
    });

    await pageView.save();

    return NextResponse.json({
      success: true,
      sessionId,
      timestamp: pageView.timestamp
    });
  } catch {
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
