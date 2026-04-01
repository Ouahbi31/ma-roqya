import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import InstallPrompt from '../InstallPrompt';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden w-full">
      <Header />
      <main className="flex-1 w-full overflow-x-hidden pb-16 md:pb-0">{children}</main>
      <Footer />
      <InstallPrompt />
    </div>
  );
}
