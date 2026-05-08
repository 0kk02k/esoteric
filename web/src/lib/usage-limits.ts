import prisma from "@/lib/db";

const DAILY_FREE_LIMIT = 3;

export async function checkUsageLimit(
  identifier: { userId?: string; sessionToken?: string }
): Promise<{ allowed: boolean; readingsRemaining: number }> {
  const { userId, sessionToken } = identifier;
  
  if (!userId && !sessionToken) {
    return { allowed: true, readingsRemaining: DAILY_FREE_LIMIT };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Find or create usage record for today
  // Priority: userId, then sessionToken (only if no userId)
  const where = userId 
    ? { userId, periodStart: today, periodEnd: tomorrow } 
    : { sessionToken: sessionToken!, userId: null, periodStart: today, periodEnd: tomorrow };

  let usageLimit = await prisma.usageLimit.findFirst({
    where,
  });

  if (!usageLimit) {
    usageLimit = await prisma.usageLimit.create({
      data: {
        userId,
        sessionToken: userId ? null : (sessionToken ?? null),
        periodStart: today,
        periodEnd: tomorrow,
        readingsCount: 0,
        followupsCount: 0,
        maxReadings: DAILY_FREE_LIMIT,
      },
    });
  }

  const readingsRemaining = Math.max(
    0,
    usageLimit.maxReadings - usageLimit.readingsCount
  );

  return {
    allowed: usageLimit.readingsCount < usageLimit.maxReadings,
    readingsRemaining,
  };
}
