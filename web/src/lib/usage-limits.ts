import prisma from "./db";

const FREE_LIMITS = {
  maxReadings: 3,
  maxFollowups: 1,
};

const PLUS_LIMITS = {
  maxReadings: 20,
  maxFollowups: 5,
};

export type LimitType = "reading" | "followup";

export type UsageLimitResult = {
  allowed: boolean;
  readingsRemaining: number;
  followupsRemaining: number;
  resetAt: Date;
  plan: string;
};

export async function checkUsageLimit(
  identifier: { userId?: string; sessionToken?: string },
  type: LimitType = "reading"
): Promise<UsageLimitResult> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  // 1. Determine Plan
  let plan = "FREE";
  if (identifier.userId) {
    const sub = await prisma.subscription.findFirst({
      where: {
        userId: identifier.userId,
        status: "active",
        OR: [
          { endDate: null },
          { endDate: { gte: now } },
        ],
      },
    });
    if (sub) plan = sub.plan;
  }

  const currentLimits = plan === "PLUS" ? PLUS_LIMITS : FREE_LIMITS;

  const where = {
    OR: [
      identifier.userId ? { userId: identifier.userId } : {},
      identifier.sessionToken ? { sessionToken: identifier.sessionToken } : {},
    ].filter(cond => Object.keys(cond).length > 0),
    periodStart: { lte: now },
    periodEnd: { gte: now },
  };

  // 2. Find or Create UsageLimit record
  let limit = await prisma.usageLimit.findFirst({ where });

  if (!limit) {
    limit = await prisma.usageLimit.create({
      data: {
        userId: identifier.userId,
        sessionToken: identifier.sessionToken,
        periodStart: startOfDay,
        periodEnd: endOfDay,
        maxReadings: currentLimits.maxReadings,
        maxFollowups: currentLimits.maxFollowups,
      },
    });
  } else if (limit.maxReadings !== currentLimits.maxReadings || limit.maxFollowups !== currentLimits.maxFollowups) {
    // Update limits if plan changed during the day
    limit = await prisma.usageLimit.update({
      where: { id: limit.id },
      data: {
        maxReadings: currentLimits.maxReadings,
        maxFollowups: currentLimits.maxFollowups,
      },
    });
  }

  const readingsRemaining = Math.max(0, limit.maxReadings - limit.readingsCount);
  const followupsRemaining = Math.max(0, limit.maxFollowups - limit.followupsCount);

  const allowed = type === "reading" ? readingsRemaining > 0 : followupsRemaining > 0;

  return {
    allowed,
    readingsRemaining,
    followupsRemaining,
    resetAt: endOfDay,
    plan,
  };
}

export async function incrementUsageCount(
  identifier: { userId?: string; sessionToken?: string },
  type: LimitType = "reading"
): Promise<void> {
  const now = new Date();
  const isReading = type === "reading";
  
  await prisma.usageLimit.updateMany({
    where: {
      OR: [
        identifier.userId ? { userId: identifier.userId } : {},
        identifier.sessionToken ? { sessionToken: identifier.sessionToken } : {},
      ].filter(cond => Object.keys(cond).length > 0),
      periodStart: { lte: now },
      periodEnd: { gte: now },
    },
    data: {
      [isReading ? "readingsCount" : "followupsCount"]: {
        increment: 1,
      },
    },
  });
}
