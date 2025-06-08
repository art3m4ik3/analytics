import { v4 as uuidv4 } from "uuid";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateCounterId(): string {
  return uuidv4().replace(/-/g, "").substring(0, 16);
}

export function generateSessionId(): string {
  return uuidv4().replace(/-/g, "").substring(0, 12);
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}

export function isValidDomain(domain: string): boolean {
  const domainRegex =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
  return domainRegex.test(domain);
}

export function parseUserAgent(userAgent: string) {
  const browserRegex = /(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/i;
  const osRegex = /(Windows|Mac|Linux|Android|iOS)/i;

  const browserMatch = userAgent.match(browserRegex);
  const osMatch = userAgent.match(osRegex);

  return {
    browser: browserMatch ? browserMatch[1] : "Unknown",
    os: osMatch ? osMatch[1] : "Unknown",
  };
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("ru-RU").format(num);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export async function getCountryFromIP(ip: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(`http://ip-api.com/json/${ip}?lang=ru`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data.country || "Неизвестно";
    }
  } catch {
    return "Неизвестно";
  }

  return "Неизвестно";
}
