const youtubeHostPattern = /(^|\.)youtube\.com$|(^|\.)youtube-nocookie\.com$|(^|\.)youtu\.be$/;

export function getYouTubeEmbedUrl(url: string | undefined): string | null {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (!youtubeHostPattern.test(host)) {
      return null;
    }

    const videoId = host === "youtu.be" ? parsed.pathname.slice(1).split("/")[0] : parsed.searchParams.get("v");

    if (!videoId || !/^[A-Za-z0-9_-]{6,}$/.test(videoId)) {
      return null;
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  } catch {
    return null;
  }
}
