const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function fetchWatchlist() {
  const res = await fetch(`${API_BASE}/watchlist`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

