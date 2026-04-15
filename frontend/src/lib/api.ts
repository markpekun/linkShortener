const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export interface ShortenRequest {
  original_url: string;
}

export interface ShortenResponse {
  short_url: string;
}

export async function shortenUrl(url: string): Promise<ShortenResponse> {
  const res = await fetch(`${API_BASE}/shorten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ original_url: url } satisfies ShortenRequest),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Something went wrong" }));
    throw new Error(error.message || `Error ${res.status}`);
  }

  return res.json();
}
