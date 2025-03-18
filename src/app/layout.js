import localFont from "next/font/local";
import "./globals.css";
import Header from './components/Header';
import { ClerkProvider } from '@clerk/nextjs'
import ThemeCom from './components/ThemeCom';
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react"; // Import Vercel Analytics



// import FooterComponent from "./components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Experince Book",
  description: "Generated by Serkan Diner",
};

export default function RootLayout({ children }) {

  return (



    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" enableSystem={true}>
          <ThemeCom>
            
        <Header />
        
        {children}
        <Analytics /> {/* Vercel Analytics tracking globally */}
         {/* Footer - this will be shown on every page */}
         
         </ThemeCom>
         </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
