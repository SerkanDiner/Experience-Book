'use client';

import { ThemeProvider } from 'next-themes';
import ThemeCom from './ThemeCom';
import Header from './Header';
import Footer from './Footer';

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider attribute="class"  defaultTheme="light" enableSystem={true}>
      <ThemeCom>
        <Header />
        {children}
        <Footer />
      </ThemeCom>
    </ThemeProvider>
  );
}
