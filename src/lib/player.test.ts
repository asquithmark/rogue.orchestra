import { describe, expect, it } from "vitest";
import { clamp, getNextTrackIndex, getPreviousTrackIndex, getProgressPercent } from "./player";

describe("player helpers", () => {
  it("advances through the album and stops at the final track", () => {
    expect(getNextTrackIndex(0, 16)).toBe(1);
    expect(getNextTrackIndex(14, 16)).toBe(15);
    expect(getNextTrackIndex(15, 16)).toBe(15);
  });

  it("moves backward through the album and stops at the opening track", () => {
    expect(getPreviousTrackIndex(15)).toBe(14);
    expect(getPreviousTrackIndex(1)).toBe(0);
    expect(getPreviousTrackIndex(0)).toBe(0);
  });

  it("clamps seek/progress values into safe ranges", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(12, 0, 10)).toBe(10);
    expect(getProgressPercent(30, 120)).toBe(25);
    expect(getProgressPercent(30, 0)).toBe(0);
  });
});
