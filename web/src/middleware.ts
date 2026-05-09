import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const LIMIT = 30; // requests
const WINDOW = 60 * 1000; // 1 minute in ms

export function middleware(request: NextRequest) {
  // Only rate limit API routes
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Get IP address
  const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "anonymous";
  const now = Date.now();

  let rateLimit = rateLimitMap.get(ip);

  if (!rateLimit || now - rateLimit.lastReset > WINDOW) {
    rateLimit = { count: 0, lastReset: now };
  }

  rateLimit.count++;
  rateLimitMap.set(ip, rateLimit);

  const remaining = Math.max(0, LIMIT - rateLimit.count);
  const reset = rateLimit.lastReset + WINDOW;

  const response = rateLimit.count > LIMIT
    ? NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      )
    : NextResponse.next();

  // Set rate limit headers
  response.headers.set("X-RateLimit-Limit", LIMIT.toString());
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set("X-RateLimit-Reset", reset.toString());

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
