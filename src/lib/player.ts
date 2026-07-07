export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getNextTrackIndex(currentIndex: number, totalTracks: number): number {
  if (totalTracks <= 0) {
    return 0;
  }

  return clamp(currentIndex + 1, 0, totalTracks - 1);
}

export function getPreviousTrackIndex(currentIndex: number): number {
  return Math.max(currentIndex - 1, 0);
}

export function getProgressPercent(currentTime: number, duration: number): number {
  if (!Number.isFinite(currentTime) || !Number.isFinite(duration) || duration <= 0) {
    return 0;
  }

  return clamp((currentTime / duration) * 100, 0, 100);
}
