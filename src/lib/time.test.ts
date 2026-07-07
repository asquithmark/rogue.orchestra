import { describe, expect, it } from "vitest";
import { formatTime } from "./time";

describe("formatTime", () => {
  it("formats seconds as compact minutes and seconds", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(75)).toBe("1:15");
    expect(formatTime(311.49)).toBe("5:11");
  });

  it("handles invalid media times as zero", () => {
    expect(formatTime(Number.NaN)).toBe("0:00");
    expect(formatTime(Number.POSITIVE_INFINITY)).toBe("0:00");
  });
});
