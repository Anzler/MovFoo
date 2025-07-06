import "../globals.css";

export const metadata = { title: "Watch Quiz | MovFoo" };

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-xl p-6">{children}</main>;
}

