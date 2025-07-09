import Link from 'next/link';
import SurpriseButton from '@/components/SurpriseButton';

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column – Movies */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">What do you want to watch?</h2>

          <div className="flex flex-col gap-4">
            <Link href="/quiz/movie">
              <button className="w-full bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded px-4 py-2 font-semibold">
                🎬 Movies & TV Shows
              </button>
            </Link>

            <label className="inline-flex items-center text-sm text-gray-600">
              <input type="checkbox" disabled className="mr-2" />
              Show only Movies & TV Shows
            </label>

            <SurpriseButton
              to="/quiz/movie/surprise"
              className="w-full border border-gray-300 rounded px-4 py-2 hover:bg-gray-100"
            >
              Surprise Me
            </SurpriseButton>

            <Link href="/movies/watchlist">
              <button className="w-full border border-gray-300 rounded px-4 py-2 hover:bg-gray-100">
                Currently Watching
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column – Food */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">What do you want to eat?</h2>

          <div className="flex flex-col gap-4">
            <Link href="/quiz/food">
              <button className="w-full bg-green-100 hover:bg-green-200 border border-green-300 rounded px-4 py-2 font-semibold">
                🍽️ Food
              </button>
            </Link>

            <label className="inline-flex items-center text-sm text-gray-600">
              <input type="checkbox" disabled className="mr-2" />
              Show only Food
            </label>

            <SurpriseButton
              to="/quiz/food/surprise"
              className="w-full border border-gray-300 rounded px-4 py-2 hover:bg-gray-100"
            >
              Surprise Me
            </SurpriseButton>
          </div>
        </div>
      </div>
    </main>
  );
}

