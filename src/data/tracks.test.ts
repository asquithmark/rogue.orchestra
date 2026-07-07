import { describe, expect, it } from "vitest";
import { tracks } from "./tracks";

const visibleText = JSON.stringify(tracks);

describe("track manifest", () => {
  it("contains exactly the numbered 01-16 album tracks in order", () => {
    expect(tracks).toHaveLength(16);
    expect(tracks.map((track) => track.number)).toEqual(Array.from({ length: 16 }, (_, index) => index + 1));
    expect(tracks[0].title).toBe("please don’t wake me up");
    expect(tracks[15].title).toBe("eat, pray, love");
  });

  it("uses lowercase public song titles and does not expose the personal artist name", () => {
    for (const track of tracks) {
      expect(track.title).toBe(track.title.toLocaleLowerCase());
    }
    expect(visibleText).not.toMatch(/Mark Asquith/i);
  });

  it("has web-safe audio source names and duration text for every track", () => {
    for (const track of tracks) {
      expect(track.audioSrc).toMatch(/^\.\/assets\/audio\/\d{2}-[a-z0-9-]+\.(mp3|m4a)$/);
      expect(track.durationLabel).toMatch(/^\d+:\d{2}$/);
    }
  });

  it("keeps credits available with clickable source links where attribution needs them", () => {
    const linkedTracks = tracks.filter((track) => track.credit.some((segment) => segment.href));
    expect(linkedTracks.length).toBeGreaterThan(8);
    expect(tracks[3].creditText).toContain("Kehlani feat. Jill Scott & Young Miko's \"Sucia\"");
    expect(tracks[4].creditText).toContain("Jamie Woon's \"Heavy Going...\"");
    expect(tracks[6].creditText).toContain("Janelle Monáe's \"Don't Judge Me\"");
    expect(tracks[9].creditText).toContain("MEUTE's \"You & Me (Flume Remix)\"");
  });
});
