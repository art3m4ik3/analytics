import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import { Counter } from "@/models/Counter";
import { PageView } from "@/models/PageView";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const { searchParams } = new URL(request.url);
    const counterId = searchParams.get("counterId");
    const period = searchParams.get("period") || "7d";

    if (!token) {
      return NextResponse.json(
        { error: "Токен не предоставлен" },
        { status: 401 },
      );
    }
    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: "Недействительный токен" },
        { status: 401 },
      );
    }

    if (!counterId) {
      return NextResponse.json(
        { error: "counterId обязателен" },
        { status: 400 },
      );
    }
    const counter = await Counter.findOne({
      counterId,
      userId: payload.userId,
    });

    if (!counter) {
      return NextResponse.json({ error: "Счетчик не найден" }, { status: 404 });
    }

    let days = 7;
    switch (period) {
      case "1d":
        days = 1;
        break;
      case "7d":
        days = 7;
        break;
      case "30d":
        days = 30;
        break;
      case "90d":
        days = 90;
        break;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const [
      pageViews,
      uniqueVisitors,
      topPages,
      topReferrers,
      sessionStats,
      countries,
    ] = await Promise.all([
      PageView.countDocuments({
        counterId,
        timestamp: { $gte: startDate },
      }),

      PageView.distinct("sessionId", {
        counterId,
        timestamp: { $gte: startDate },
      }),

      PageView.aggregate([
        {
          $match: {
            counterId,
            timestamp: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$url",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ]),

      PageView.aggregate([
        {
          $match: {
            counterId,
            timestamp: { $gte: startDate },
            referrer: { $exists: true, $nin: [null, ""] },
          },
        },
        {
          $group: {
            _id: "$referrer",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ]),
      PageView.aggregate([
        {
          $match: {
            counterId,
            timestamp: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$sessionId",
            pageViews: { $sum: 1 },
            firstView: { $min: "$timestamp" },
            lastView: { $max: "$timestamp" },
          },
        },
        {
          $addFields: {
            duration: {
              $divide: [{ $subtract: ["$lastView", "$firstView"] }, 1000],
            },
          },
        },
      ]),

      PageView.aggregate([
        {
          $match: {
            counterId,
            timestamp: { $gte: startDate },
            country: { $exists: true, $nin: [null, ""] },
          },
        },
        {
          $group: {
            _id: "$country",
            visits: { $sum: 1 },
          },
        },
        {
          $sort: { visits: -1 },
        },
        {
          $limit: 10,
        },
      ]),
    ]);

    const dailyStats = await PageView.aggregate([
      {
        $match: {
          counterId,
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$timestamp",
            },
          },
          pageViews: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$sessionId" },
        },
      },
      {
        $project: {
          date: "$_id",
          pageViews: 1,
          uniqueVisitors: { $size: "$uniqueVisitors" },
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);
    const bouncedSessions = sessionStats.filter(
      (session) => session.pageViews === 1,
    ).length;
    const bounceRate =
      uniqueVisitors.length > 0
        ? Math.round((bouncedSessions / uniqueVisitors.length) * 100)
        : 0;

    const totalSessionDuration = sessionStats.reduce(
      (sum, session) => sum + (session.duration || 0),
      0,
    );
    const avgSessionDuration =
      sessionStats.length > 0
        ? Math.round(totalSessionDuration / sessionStats.length)
        : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalPageviews: pageViews,
        uniqueVisitors: uniqueVisitors.length,
        avgSessionDuration,
        bounceRate,
        topPages: topPages.map((page) => ({
          path: page._id,
          views: page.count,
        })),
        referrers: topReferrers.map((ref) => ({
          source: ref._id || "Прямой заход",
          visits: ref.count,
        })),
        dailyStats: dailyStats.map((stat) => ({
          date: stat.date,
          pageviews: stat.pageViews,
          visitors: stat.uniqueVisitors,
        })),
        countries: countries.map((country) => ({
          country: country._id,
          visits: country.visits,
        })),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
