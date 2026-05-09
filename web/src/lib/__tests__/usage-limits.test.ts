import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkUsageLimit, incrementUsageCount } from "../usage-limits";
import prisma from "../db";

// Mock prisma
vi.mock("../db", () => ({
  default: {
    subscription: {
      findFirst: vi.fn(),
    },
    usageLimit: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

describe("Usage Limits", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("checkUsageLimit", () => {
    it("should return FREE limits for anonymous users", async (done) => {
      const mockLimit = {
        id: "1",
        readingsCount: 0,
        followupsCount: 0,
        maxReadings: 3,
        maxFollowups: 1,
      };

      (prisma.usageLimit.findFirst as any).mockResolvedValue(mockLimit);
      (prisma.subscription.findFirst as any).mockResolvedValue(null);

      const result = await checkUsageLimit({ sessionToken: "test-session" });

      expect(result.allowed).toBe(true);
      expect(result.readingsRemaining).toBe(3);
      expect(result.plan).toBe("FREE");
    });

    it("should return PLUS limits for users with active subscription", async (done) => {
      const mockSub = { plan: "PLUS", status: "active" };
      const mockLimit = {
        id: "1",
        readingsCount: 0,
        followupsCount: 0,
        maxReadings: 20,
        maxFollowups: 5,
      };

      (prisma.subscription.findFirst as any).mockResolvedValue(mockSub);
      (prisma.usageLimit.findFirst as any).mockResolvedValue(mockLimit);

      const result = await checkUsageLimit({ userId: "user-1" });

      expect(result.allowed).toBe(true);
      expect(result.readingsRemaining).toBe(20);
      expect(result.plan).toBe("PLUS");
    });

    it("should return allowed: false when limit is reached", async (done) => {
      const mockLimit = {
        id: "1",
        readingsCount: 3,
        followupsCount: 1,
        maxReadings: 3,
        maxFollowups: 1,
      };

      (prisma.usageLimit.findFirst as any).mockResolvedValue(mockLimit);
      (prisma.subscription.findFirst as any).mockResolvedValue(null);

      const result = await checkUsageLimit({ sessionToken: "test-session" });

      expect(result.allowed).toBe(false);
      expect(result.readingsRemaining).toBe(0);
    });
  });

  describe("incrementUsageCount", () => {
    it("should call updateMany to increment the count", async () => {
      await incrementUsageCount({ userId: "user-1" }, "reading");

      expect(prisma.usageLimit.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { readingsCount: { increment: 1 } }
        })
      );
    });

    it("should increment followupsCount when type is followup", async () => {
      await incrementUsageCount({ userId: "user-1" }, "followup");

      expect(prisma.usageLimit.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { followupsCount: { increment: 1 } }
        })
      );
    });
  });
});
