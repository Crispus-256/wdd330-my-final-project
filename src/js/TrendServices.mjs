import {
  DEFAULT_TREND_QUERY,
  YOUTUBE_API_BASE_URL
} from "./constants.mjs";

export default class TrendServices {
  constructor(baseUrl = YOUTUBE_API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    this.quotaBackoffKey = "youtubeQuotaBackoffUntil";
    this.lastFailureReason = "";
  }

  get quotaBackoffUntil() {
    const stored = Number(window.sessionStorage.getItem(this.quotaBackoffKey));
    return Number.isFinite(stored) ? stored : 0;
  }

  set quotaBackoffUntil(value) {
    window.sessionStorage.setItem(this.quotaBackoffKey, String(value));
  }

  async getTrendArticles(query = DEFAULT_TREND_QUERY, limit = 4) {
    if (!this.apiKey) {
      this.lastFailureReason = "missingKey";
      console.warn("VITE_YOUTUBE_API_KEY is missing. Unable to fetch YouTube trends.");
      return [];
    }

    if (Date.now() < this.quotaBackoffUntil) {
      this.lastFailureReason = "quotaExceeded";
      return [];
    }

    const endpoint = `${this.baseUrl}?part=snippet&type=video&maxResults=${limit}&q=${encodeURIComponent(
      query
    )}&key=${this.apiKey}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        let reason = "";
        try {
          const errorPayload = await response.json();
          reason = errorPayload?.error?.errors?.[0]?.reason || "";
        } catch {
          reason = "";
        }

        if (reason === "quotaExceeded") {
          // Pause additional API requests for this session to avoid wasting quota.
          this.quotaBackoffUntil = Date.now() + 15 * 60 * 1000;
        }

        this.lastFailureReason = reason || `http_${response.status}`;

        throw new Error(`Trend API request failed with status ${response.status}`);
      }

      this.lastFailureReason = "";

      const payload = await response.json();
      const items = payload.items || [];

      return items
        .filter((item) => item.id && item.id.videoId)
        .map((item) => ({
          id: item.id.videoId,
          title: item.snippet?.title || "Nail trend video",
          description:
            item.snippet?.description || "Watch this nail trend inspiration video.",
          link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          thumbnail:
            item.snippet?.thumbnails?.high?.url ||
            item.snippet?.thumbnails?.medium?.url ||
            item.snippet?.thumbnails?.default?.url ||
            ""
        }));
    } catch (error) {
      if (!this.lastFailureReason) {
        this.lastFailureReason = "network";
      }
      console.error("Unable to fetch data from YouTube API:", error);
      return [];
    }
  }
}
