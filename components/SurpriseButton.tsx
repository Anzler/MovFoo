'use client';

import { useRouter } from 'next/navigation';

interface SurpriseButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export default function SurpriseButton({ to, children, className }: SurpriseButtonProps) {
  const router = useRouter();
  return (
    <button
      className={className}
      type="button"
      onClick={() => router.push(to)}
    >
      {children}
    </button>
  );
}

