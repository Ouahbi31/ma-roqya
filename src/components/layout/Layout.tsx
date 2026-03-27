import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import InstallPrompt from '../InstallPrompt';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <InstallPrompt />
    </div>
  );
}
