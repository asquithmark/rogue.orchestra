import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("App", () => {
  it("renders the minimal public player without the personal artist name", () => {
    render(<App />);

    expect(screen.getByText("the rogue orchestra")).toBeInTheDocument();
    expect(screen.getByText("please don’t wake me up")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /credits/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open track list/i })).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/Mark Asquith/i);
  });

  it("opens current-track credits with clickable attribution links", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /credits/i }));

    const dialog = screen.getByRole("dialog", { name: /track credits/i });
    expect(within(dialog).getByText(/Claude Debussy/i)).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /Clair De Lune/i })).toHaveAttribute(
      "href",
      "https://youtu.be/-Bxpm0EmOMU"
    );
  });

  it("opens YouTube credit links inside the credits sheet", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /credits/i }));

    const dialog = screen.getByRole("dialog", { name: /track credits/i });
    fireEvent.click(within(dialog).getByRole("link", { name: /Clair De Lune/i }));

    expect(within(dialog).getByLabelText("credit video preview")).toBeInTheDocument();
    expect(within(dialog).getByTitle(/reference video/i)).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/-Bxpm0EmOMU?autoplay=1&rel=0&modestbranding=1"
    );
  });

  it("requests playback again after skipping to the next track", async () => {
    const playSpy = vi.spyOn(window.HTMLMediaElement.prototype, "play").mockResolvedValue();

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "play" }));
    expect(playSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "next track" }));

    await waitFor(() => {
      expect(screen.getByText("la ultima quedada del verano")).toBeInTheDocument();
      expect(playSpy).toHaveBeenCalledTimes(2);
    });
  });

  it("sets lock-screen media metadata for the current track", () => {
    class TestMediaMetadata {
      album?: string;
      artist?: string;
      artwork?: MediaImage[];
      title?: string;

      constructor(metadata: MediaMetadataInit) {
        Object.assign(this, metadata);
      }
    }

    const mediaSession = {
      metadata: null as MediaMetadata | null,
      playbackState: "none" as MediaSessionPlaybackState,
      setActionHandler: vi.fn()
    };

    vi.stubGlobal("MediaMetadata", TestMediaMetadata);
    Object.defineProperty(window.navigator, "mediaSession", {
      configurable: true,
      value: mediaSession
    });

    render(<App />);

    expect(mediaSession.metadata?.title).toBe("please don’t wake me up");
    expect(mediaSession.metadata?.artist).toBe("the rogue orchestra");
    expect(mediaSession.metadata?.album).toBe("the rogue orchestra");
    expect(mediaSession.metadata?.artwork?.[0]?.src).toContain("assets/images/rogue-background.png");
  });

  it("uses lock-screen previous and next track actions instead of ten-second seek actions", () => {
    class TestMediaMetadata {
      constructor(metadata: MediaMetadataInit) {
        Object.assign(this, metadata);
      }
    }

    const mediaSession = {
      metadata: null as MediaMetadata | null,
      playbackState: "none" as MediaSessionPlaybackState,
      setActionHandler: vi.fn()
    };

    vi.stubGlobal("MediaMetadata", TestMediaMetadata);
    Object.defineProperty(window.navigator, "mediaSession", {
      configurable: true,
      value: mediaSession
    });

    render(<App />);

    expect(mediaSession.setActionHandler).toHaveBeenCalledWith("previoustrack", expect.any(Function));
    expect(mediaSession.setActionHandler).toHaveBeenCalledWith("nexttrack", expect.any(Function));
    expect(mediaSession.setActionHandler).not.toHaveBeenCalledWith("seekbackward", expect.any(Function));
    expect(mediaSession.setActionHandler).not.toHaveBeenCalledWith("seekforward", expect.any(Function));
  });

  it("opens a minimal album menu with all 16 tracks and the about note", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /open track list/i }));

    const dialog = screen.getByRole("dialog", { name: /album menu/i });
    expect(within(dialog).getByText("a 16-track album of original compositions, remakes, and quiet references.")).toBeInTheDocument();
    expect(within(dialog).getAllByRole("button")).toHaveLength(17);
    expect(within(dialog).getByText("eat, pray, love")).toBeInTheDocument();
  });
});
