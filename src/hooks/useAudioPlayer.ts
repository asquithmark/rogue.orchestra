import { useCallback, useEffect, useRef, useState } from "react";
import { tracks } from "../data/tracks";
import { getNextTrackIndex, getPreviousTrackIndex } from "../lib/player";

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
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentIndex]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, []);

  const playTrack = useCallback((index: number) => {
    shouldResumeRef.current = true;
    setCurrentIndex(index);
  }, []);

  const previous = useCallback(() => {
    setCurrentIndex((index) => getPreviousTrackIndex(index));
  }, []);

  const next = useCallback(() => {
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

  return {
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
  };
}
