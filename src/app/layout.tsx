import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "eFootball Academy — Learn • Train • Master",
  description:
    "eFootball Academy is a global eFootball coaching and intelligence platform for player analysis, statistics, training, tactics, experiments and expert coaching.",
  applicationName: "eFootball Academy",
  keywords: [
    "eFootball",
    "eFootball coaching",
    "football intelligence",
    "player analysis",
    "eFootball tactics",
    "eFootball builds",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
