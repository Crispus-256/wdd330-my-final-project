import {
  DEFAULT_TREND_QUERY,
  YOUTUBE_API_BASE_URL
} from "./constants.mjs";

export default class TrendServices {
  constructor(baseUrl = YOUTUBE_API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  }

  async getTrendArticles(query = DEFAULT_TREND_QUERY, limit = 4) {
    if (!this.apiKey) {
      console.warn("VITE_YOUTUBE_API_KEY is missing. Unable to fetch YouTube trends.");
      return [];
    }

    const endpoint = `${this.baseUrl}?part=snippet&type=video&maxResults=${limit}&q=${encodeURIComponent(
      query
    )}&key=${this.apiKey}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Trend API request failed with status ${response.status}`);
      }

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
            item.snippet?.thumbnails?.medium?.url ||
            item.snippet?.thumbnails?.default?.url ||
            ""
        }));
    } catch (error) {
      console.error("Unable to fetch data from YouTube API:", error);
      return [];
    }
  }
}
