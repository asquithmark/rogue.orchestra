import { useCallback, useEffect, useRef, useState } from "react";
import { tracks } from "../data/tracks";
import { absoluteAssetUrl } from "../lib/assets";
import { getNextTrackIndex, getPreviousTrackIndex } from "../lib/player";

const artworkUrl = () => absoluteAssetUrl("assets/images/rogue-background.png");

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldResumeRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = tracks[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const syncTime = () => setCurrentTime(audio.currentTime || 0);
    const syncDuration = () => setDuration(audio.duration || 0);
    const syncPlaying = () => setIsPlaying(!audio.paused);
    const syncPaused = () => setIsPlaying(false);
    const handleEnded = () => {
      const nextIndex = getNextTrackIndex(currentIndex, tracks.length);

      if (nextIndex === currentIndex) {
        setIsPlaying(false);
        setCurrentTime(0);
        return;
      }

      shouldResumeRef.current = true;
      setCurrentIndex(nextIndex);
    };

    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("play", syncPlaying);
    audio.addEventListener("pause", syncPaused);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("play", syncPlaying);
      audio.removeEventListener("pause", syncPaused);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (shouldResumeRef.current) {
      shouldResumeRef.current = false;
      let didRequestPlayback = false;
      const resumePlayback = () => {
        if (didRequestPlayback) {
          return;
        }

        didRequestPlayback = true;
        void audio.play().catch(() => {
          setIsPlaying(false);
        });
      };
      const resumeTimer = window.setTimeout(resumePlayback, 0);

      audio.addEventListener("canplay", resumePlayback, { once: true });

      return () => {
        window.clearTimeout(resumeTimer);
        audio.removeEventListener("canplay", resumePlayback);
      };
    }
  }, [currentIndex]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    void audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      play();
    } else {
      pause();
    }
  }, [pause, play]);

  const playTrack = useCallback((index: number) => {
    shouldResumeRef.current = true;
    setCurrentIndex(index);
  }, []);

  const previous = useCallback(() => {
    shouldResumeRef.current = true;
    setCurrentIndex((index) => getPreviousTrackIndex(index));
  }, []);

  const next = useCallback(() => {
    shouldResumeRef.current = true;
    setCurrentIndex((index) => getNextTrackIndex(index, tracks.length));
  }, []);

  const seekToPercent = useCallback((percent: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) {
      return;
    }

    audio.currentTime = (percent / 100) * audio.duration;
    setCurrentTime(audio.currentTime);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.title = currentTrack.title;
    }

    if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") {
      return;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: "the rogue orchestra",
      album: "the rogue orchestra",
      artwork: [
        {
          src: artworkUrl(),
          sizes: "853x1844",
          type: "image/png"
        }
      ]
    });
  }, [currentTrack]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) {
      return;
    }

    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || !navigator.mediaSession.setActionHandler) {
      return;
    }

    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", pause);
    navigator.mediaSession.setActionHandler("previoustrack", previous);
    navigator.mediaSession.setActionHandler("nexttrack", next);

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
    };
  }, [next, pause, play, previous]);

  return {
    audioRef,
    currentIndex,
    currentTrack,
    currentTime,
    duration,
    isPlaying,
    next,
    pause,
    play,
    playTrack,
    previous,
    seekToPercent,
    togglePlay
  };
}
