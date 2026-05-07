import prisma from "@/lib/db";

const DAILY_FREE_LIMIT = 3;

export async function checkUsageLimit(
  sessionToken: string
): Promise<{ allowed: boolean; readingsRemaining: number }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Find or create usage record for today
  let usageLimit = await prisma.usageLimit.findFirst({
    where: {
      sessionToken,
      periodStart: today,
      periodEnd: tomorrow,
    },
  });

  if (!usageLimit) {
    usageLimit = await prisma.usageLimit.create({
      data: {
        sessionToken,
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
