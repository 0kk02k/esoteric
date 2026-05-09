const DAILY_FREE_LIMIT = 999;

export async function checkUsageLimit(
  _identifier: { userId?: string; sessionToken?: string }
): Promise<{ allowed: boolean; readingsRemaining: number }> {
  return { allowed: true, readingsRemaining: DAILY_FREE_LIMIT };
}
