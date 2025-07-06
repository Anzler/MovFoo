"use client";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Results() {
  const search = useSearchParams();
  const s = search.get("s");

  const { data, error, isLoading } = useSWR(
    s ? `${process.env.NEXT_PUBLIC_API_URL}/api/quiz/watch/results?s=${s}` : null,
    fetcher
  );

  if (isLoading) return <p>Loading results…</p>;
  if (error) return <p>Couldn’t load results.</p>;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Your Picks</h2>
      <ul className="grid grid-cols-2 gap-4">
        {data.results.map((m: any) => (
          <li key={m.id} className="border rounded p-2">
            <img src={m.poster_url} alt="" className="rounded mb-2" />
            <p className="font-medium">{m.title}</p>
            <p className="text-sm text-gray-600">{m.year}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

