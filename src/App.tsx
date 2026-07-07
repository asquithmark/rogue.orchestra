import { Ellipsis, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { CreditText } from "./components/CreditText";
import { Sheet } from "./components/Sheet";
import { tracks } from "./data/tracks";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { assetPath, cssAssetPath } from "./lib/assets";
import { getProgressPercent } from "./lib/player";
import { formatTime } from "./lib/time";
import { useState } from "react";

const aboutCopy = "a 16-track album of original compositions, remakes, and quiet references.";

function App() {
  const {
    audioRef,
    currentIndex,
    currentTrack,
    currentTime,
    duration,
    isPlaying,
    next,
    playTrack,
    previous,
    seekToPercent,
    togglePlay
  } = useAudioPlayer();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const progress = getProgressPercent(currentTime, duration || parseDuration(currentTrack.durationLabel));
  const remaining = Math.max((duration || parseDuration(currentTrack.durationLabel)) - currentTime, 0);
  const backgroundImage = cssAssetPath("assets/images/rogue-background.png");

  return (
    <main className="app-shell" style={{ "--background-image": `url("${backgroundImage}")` } as React.CSSProperties}>
      <div className="desktop-glow" aria-hidden="true" />
      <section className="player-frame" aria-label="the rogue orchestra music player">
        <div className="ambient-stage">
          <div className="ambient-image" aria-hidden="true" />
          <div className="ambient-vignette" aria-hidden="true" />
        </div>

        <header className="topbar">
          <p>the rogue orchestra</p>
          <button
            aria-label="open album menu"
            className="glass-icon-button"
            type="button"
            onClick={() => setIsMenuOpen(true)}
          >
            <Ellipsis aria-hidden="true" size={22} strokeWidth={1.9} />
          </button>
        </header>

        <div className="track-copy">
          <p className="track-number">{String(currentTrack.number).padStart(2, "0")} / 16</p>
          <h1>{currentTrack.title}</h1>
        </div>

        <div className="progress-area">
          <label className="sr-only" htmlFor="seek">
            seek through {currentTrack.title}
          </label>
          <input
            id="seek"
            aria-label={`seek through ${currentTrack.title}`}
            className="seek"
            max="100"
            min="0"
            step="0.1"
            type="range"
            value={progress}
            onChange={(event) => seekToPercent(Number(event.currentTarget.value))}
            style={{ "--progress": `${progress}%` } as React.CSSProperties}
          />
          <div className="time-row" aria-hidden="true">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(remaining)}</span>
          </div>
        </div>

        <div className="controls" aria-label="playback controls">
          <button className="transport-button side" type="button" onClick={previous} aria-label="previous track">
            <SkipBack aria-hidden="true" size={34} fill="currentColor" strokeWidth={1.5} />
          </button>
          <button className="transport-button play" type="button" onClick={togglePlay} aria-label={isPlaying ? "pause" : "play"}>
            {isPlaying ? (
              <Pause aria-hidden="true" size={34} fill="currentColor" strokeWidth={2} />
            ) : (
              <Play aria-hidden="true" size={36} fill="currentColor" strokeWidth={1.7} />
            )}
          </button>
          <button className="transport-button side" type="button" onClick={next} aria-label="next track">
            <SkipForward aria-hidden="true" size={34} fill="currentColor" strokeWidth={1.5} />
          </button>
        </div>

        <button className="credits-tab" type="button" onClick={() => setIsCreditsOpen(true)} aria-label="credits">
          <span aria-hidden="true" />
          credits
        </button>

        <audio ref={audioRef} preload="metadata">
          <source src={assetPath(currentTrack.audioSrc.replace("./", ""))} />
        </audio>

        <Sheet
          isOpen={isCreditsOpen}
          label="track credits"
          onClose={() => setIsCreditsOpen(false)}
          title="credits"
        >
          <div className="credits-content">
            <p className="sheet-kicker">
              {String(currentTrack.number).padStart(2, "0")} / {currentTrack.title}
            </p>
            <p>
              <CreditText segments={currentTrack.credit} />
            </p>
          </div>
        </Sheet>

        <Sheet isOpen={isMenuOpen} label="album menu" onClose={() => setIsMenuOpen(false)} title="album">
          <p className="about-copy">{aboutCopy}</p>
          <ol className="tracklist">
            {tracks.map((track, index) => (
              <li key={track.number}>
                <button
                  className={index === currentIndex ? "active" : ""}
                  type="button"
                  onClick={() => {
                    playTrack(index);
                    setIsMenuOpen(false);
                  }}
                >
                  <span>{String(track.number).padStart(2, "0")}</span>
                  <strong>{track.title}</strong>
                  <em>{track.durationLabel}</em>
                </button>
              </li>
            ))}
          </ol>
        </Sheet>
      </section>
    </main>
  );
}

function parseDuration(durationLabel: string): number {
  const [minutes, seconds] = durationLabel.split(":").map(Number);
  return minutes * 60 + seconds;
}

export default App;
