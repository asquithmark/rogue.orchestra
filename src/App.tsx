import { ListMusic, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { CreditText } from "./components/CreditText";
import { Sheet } from "./components/Sheet";
import type { CreditSegment } from "./data/tracks";
import { tracks } from "./data/tracks";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { assetPath, cssAssetPath } from "./lib/assets";
import { getProgressPercent } from "./lib/player";
import { formatTime } from "./lib/time";
import { getYouTubeEmbedUrl } from "./lib/youtube";
import { useEffect, useState } from "react";

const aboutCopy = "a 16-track album of original compositions, remakes, and quiet references.";

type CreditVideo = {
  embedUrl: string;
  title: string;
};

const trackVisuals = [
  { accent: "rgba(255, 227, 184, 0.34)", glow: "rgba(255, 221, 180, 0.26)", x: "52%", y: "18%", size: "162px", radius: "999px", hue: "0deg", smoke: "58% 26%" },
  { accent: "rgba(159, 210, 255, 0.32)", glow: "rgba(121, 180, 255, 0.22)", x: "36%", y: "20%", size: "148px", radius: "42% 58% 46% 54%", hue: "12deg", smoke: "42% 22%" },
  { accent: "rgba(196, 255, 226, 0.26)", glow: "rgba(127, 235, 190, 0.2)", x: "64%", y: "16%", size: "176px", radius: "34% 66% 58% 42%", hue: "-16deg", smoke: "65% 24%" },
  { accent: "rgba(255, 182, 206, 0.27)", glow: "rgba(255, 155, 190, 0.19)", x: "48%", y: "24%", size: "138px", radius: "48% 52% 38% 62%", hue: "22deg", smoke: "50% 29%" },
  { accent: "rgba(205, 192, 255, 0.28)", glow: "rgba(173, 150, 255, 0.2)", x: "61%", y: "21%", size: "152px", radius: "28% 72% 44% 56%", hue: "36deg", smoke: "68% 20%" },
  { accent: "rgba(255, 241, 204, 0.3)", glow: "rgba(255, 240, 206, 0.22)", x: "42%", y: "15%", size: "186px", radius: "999px", hue: "-8deg", smoke: "40% 24%" },
  { accent: "rgba(147, 232, 255, 0.26)", glow: "rgba(110, 210, 245, 0.18)", x: "58%", y: "14%", size: "146px", radius: "62% 38% 50% 50%", hue: "-28deg", smoke: "55% 18%" },
  { accent: "rgba(255, 206, 157, 0.28)", glow: "rgba(255, 185, 125, 0.19)", x: "46%", y: "19%", size: "168px", radius: "36% 64% 60% 40%", hue: "8deg", smoke: "46% 24%" },
  { accent: "rgba(180, 250, 212, 0.26)", glow: "rgba(128, 225, 183, 0.2)", x: "66%", y: "19%", size: "156px", radius: "999px", hue: "-22deg", smoke: "70% 25%" },
  { accent: "rgba(255, 218, 238, 0.26)", glow: "rgba(255, 172, 220, 0.18)", x: "39%", y: "17%", size: "144px", radius: "44% 56% 30% 70%", hue: "44deg", smoke: "38% 20%" },
  { accent: "rgba(189, 226, 255, 0.3)", glow: "rgba(146, 200, 255, 0.22)", x: "55%", y: "22%", size: "182px", radius: "52% 48% 65% 35%", hue: "18deg", smoke: "58% 28%" },
  { accent: "rgba(234, 255, 197, 0.24)", glow: "rgba(211, 255, 151, 0.17)", x: "49%", y: "13%", size: "136px", radius: "24% 76% 54% 46%", hue: "-36deg", smoke: "51% 17%" },
  { accent: "rgba(255, 199, 164, 0.3)", glow: "rgba(255, 160, 118, 0.19)", x: "62%", y: "25%", size: "158px", radius: "999px", hue: "28deg", smoke: "62% 30%" },
  { accent: "rgba(161, 255, 244, 0.25)", glow: "rgba(115, 232, 224, 0.18)", x: "35%", y: "23%", size: "172px", radius: "60% 40% 36% 64%", hue: "-48deg", smoke: "33% 27%" },
  { accent: "rgba(242, 216, 255, 0.27)", glow: "rgba(215, 165, 255, 0.18)", x: "53%", y: "15%", size: "150px", radius: "38% 62% 62% 38%", hue: "52deg", smoke: "52% 18%" },
  { accent: "rgba(255, 246, 214, 0.31)", glow: "rgba(255, 232, 184, 0.23)", x: "47%", y: "20%", size: "194px", radius: "999px", hue: "-4deg", smoke: "48% 24%" }
];

function App() {
  const {
    audioRef,
    currentIndex,
    currentTrack,
    currentTime,
    duration,
    isPlaying,
    next,
    pause,
    playTrack,
    previous,
    seekToPercent,
    togglePlay
  } = useAudioPlayer();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [activeCreditVideo, setActiveCreditVideo] = useState<CreditVideo | null>(null);
  const progress = getProgressPercent(currentTime, duration || parseDuration(currentTrack.durationLabel));
  const remaining = Math.max((duration || parseDuration(currentTrack.durationLabel)) - currentTime, 0);
  const backgroundImage = cssAssetPath("assets/images/rogue-background.png");
  const visual = trackVisuals[currentIndex % trackVisuals.length];

  useEffect(() => {
    setActiveCreditVideo(null);
  }, [currentIndex]);

  const handleCreditLinkClick = (segment: CreditSegment) => {
    const embedUrl = getYouTubeEmbedUrl(segment.href);

    if (!embedUrl) {
      return false;
    }

    pause();
    setActiveCreditVideo({ embedUrl, title: segment.text });
    return true;
  };

  return (
    <main
      className="app-shell"
      style={
        {
          "--background-image": `url("${backgroundImage}")`,
          "--track-accent": visual.accent,
          "--track-glow": visual.glow,
          "--shape-x": visual.x,
          "--shape-y": visual.y,
          "--shape-size": visual.size,
          "--shape-radius": visual.radius,
          "--hue-shift": visual.hue,
          "--smoke-focus": visual.smoke
        } as React.CSSProperties
      }
    >
      <div className="desktop-glow" aria-hidden="true" />
      <section className="player-frame" aria-label="the rogue orchestra music player">
        <div className="ambient-stage">
          <div className="ambient-image" aria-hidden="true" />
          <div className="ambient-shape" aria-hidden="true" />
          <div className="ambient-smoke" aria-hidden="true" />
          <div className="ambient-vignette" aria-hidden="true" />
        </div>

        <header className="topbar">
          <p>the rogue orchestra</p>
          <button
            aria-label="open track list"
            className="glass-icon-button"
            type="button"
            onClick={() => setIsMenuOpen(true)}
          >
            <ListMusic aria-hidden="true" size={22} strokeWidth={1.8} />
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

        <audio ref={audioRef} preload="metadata" src={assetPath(currentTrack.audioSrc.replace("./", ""))} />

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
              <CreditText segments={currentTrack.credit} onLinkClick={handleCreditLinkClick} />
            </p>
            {activeCreditVideo ? (
              <div className="credit-video-panel" aria-label="credit video preview">
                <div className="credit-video-header">
                  <p>{activeCreditVideo.title}</p>
                  <button type="button" className="glass-icon-button compact" onClick={() => setActiveCreditVideo(null)} aria-label="close video preview">
                    <X aria-hidden="true" size={16} strokeWidth={1.8} />
                  </button>
                </div>
                <div className="credit-video-frame">
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    src={activeCreditVideo.embedUrl}
                    title={`reference video: ${activeCreditVideo.title}`}
                  />
                </div>
              </div>
            ) : null}
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
