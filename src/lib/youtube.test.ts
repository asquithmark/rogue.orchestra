import { describe, expect, it } from "vitest";
import { getYouTubeEmbedUrl } from "./youtube";

describe("getYouTubeEmbedUrl", () => {
  it("converts short YouTube URLs to no-cookie embeds", () => {
    expect(getYouTubeEmbedUrl("https://youtu.be/-Bxpm0EmOMU")).toBe(
      "https://www.youtube-nocookie.com/embed/-Bxpm0EmOMU?autoplay=1&rel=0&modestbranding=1"
    );
  });

  it("converts watch URLs to no-cookie embeds", () => {
    expect(getYouTubeEmbedUrl("https://www.youtube.com/watch?v=8x-M7AkTvrQ")).toBe(
      "https://www.youtube-nocookie.com/embed/8x-M7AkTvrQ?autoplay=1&rel=0&modestbranding=1"
    );
  });

  it("ignores non-YouTube URLs", () => {
    expect(getYouTubeEmbedUrl("https://example.com/video")).toBeNull();
  });
});
