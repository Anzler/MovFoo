// app/page.tsx
import StartButtons from '@/components/StartButtons';

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <StartButtons />
      </div>
    </main>
  );
}

