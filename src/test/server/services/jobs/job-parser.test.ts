import { describe, it, expect } from "vitest";
import { JobParser } from "@/server/services/jobs/job-parser";

describe("JobParser", () => {
  describe("extractUpworkIdFromUrl", () => {
    it("should extract standard job hashes", () => {
      const url = "https://www.upwork.com/jobs/~01abc123def456";
      expect(JobParser.extractUpworkIdFromUrl(url)).toBe("~01abc123def456");
    });

    it("should extract job hashes with query params", () => {
      const url = "https://www.upwork.com/jobs/~01abc123def456?source=search";
      expect(JobParser.extractUpworkIdFromUrl(url)).toBe("~01abc123def456");
    });

    it("should throw error if hash cannot be found", () => {
      const url = "https://www.upwork.com/jobs/invalid-url";
      expect(() => JobParser.extractUpworkIdFromUrl(url)).toThrowError();
    });
  });

  describe("formatBudgetInfo", () => {
    it("should prioritize fixed budget", () => {
      const res = JobParser.formatBudgetInfo(500, null);
      expect(res).toEqual({ type: "fixed", amount: 500 });
    });

    it("should fallback to hourly if no fixed budget", () => {
      const res = JobParser.formatBudgetInfo(null, "$20.00 - $40.00");
      expect(res).toEqual({ type: "hourly", range: "$20.00 - $40.00" });
    });

    it("should return unknown if neither is provided", () => {
      const res = JobParser.formatBudgetInfo(null, null);
      expect(res).toEqual({ type: "unknown" });
    });
  });
});
