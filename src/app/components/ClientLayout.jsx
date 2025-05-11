'use client';

import { ThemeProvider } from 'next-themes';
import ThemeCom from './ThemeCom';
import Header from './Header';
import Footer from './Footer';

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
      <ThemeCom>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </ThemeCom>
    </ThemeProvider>
  );
}
