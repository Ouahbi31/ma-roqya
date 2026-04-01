import type { ReactNode } from 'react';
import CoachingHeader from './CoachingHeader';
import Footer from './Footer';

interface CoachingLayoutProps {
  children: ReactNode;
}

export default function CoachingLayout({ children }: CoachingLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden w-full">
      <CoachingHeader />
      <main className="flex-1 w-full overflow-x-hidden pb-16 md:pb-0">{children}</main>
      <Footer />
    </div>
  );
}
