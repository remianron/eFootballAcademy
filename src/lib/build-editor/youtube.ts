const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

const YOUTUBE_URL_PATTERNS = [
  /^https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?(?:[^#]*&)?v=([a-zA-Z0-9_-]{11})(?:&|#|$)/,
  /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:\?|#|$)/,
  /^https?:\/\/(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(?:\?|#|$)/,
  /^https?:\/\/(?:www\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})(?:\?|#|$)/,
  /^https?:\/\/(?:www\.|m\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?|#|$)/,
  /^https?:\/\/(?:www\.|m\.)?music\.youtube\.com\/watch\?(?:[^#]*&)?v=([a-zA-Z0-9_-]{11})(?:&|#|$)/,
];

export function extractYouTubeVideoId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (YOUTUBE_ID_PATTERN.test(value)) return value;
  for (const pattern of YOUTUBE_URL_PATTERNS) {
    const match = value.match(pattern);
    if (match) return match[1];
  }
  return null;
}