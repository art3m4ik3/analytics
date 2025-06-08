import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import { Counter } from "@/models/Counter";
import { createToken, verifyToken } from "@/lib/jwt";
import { generateCounterId, isValidDomain } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, domain } = await request.json();
    const authHeader = request.headers.get("authorization");

    if (!name || !domain) {
      return NextResponse.json(
        { error: "Название и домен обязательны" },
        { status: 400 },
      );
    }

    if (!isValidDomain(domain)) {
      return NextResponse.json(
        { error: "Некорректный домен" },
        { status: 400 },
      );
    }
    let userId = generateCounterId();
    let existingToken = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.substring(7);
        const payload = (await verifyToken(token)) as { userId?: string };
        if (payload && payload.userId) {
          userId = payload.userId;
          existingToken = token;
        }
      } catch {
        console.log("Invalid token, creating new user");
      }
    }

    const counterId = generateCounterId();

    const counter = new Counter({
      counterId,
      name: name.trim(),
      domain: domain.trim().toLowerCase(),
      userId,
      isActive: true,
    });
    await counter.save();

    const token =
      existingToken ||
      (await createToken({
        userId,
        counterId,
      }));

    return NextResponse.json({
      success: true,
      counterId,
      token,
      counter: {
        id: counter.counterId,
        name: counter.name,
        domain: counter.domain,
        createdAt: counter.createdAt,
        isActive: counter.isActive,
      },
    });
  } catch (error) {
    console.error("Ошибка создания счетчика:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
