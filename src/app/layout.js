import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Working Coin | $WORKIN - We Work For Our Bags",
  description: "Welcome to Working Coin ($WORKIN), the community-driven memecoin where we work for our bags! Get the Contract Address (CA), track charts, and play the interactive split clicker.",
  keywords: ["$WORKIN", "Working Coin", "ORKIN", "We Work For Our Bags", "Crypto Bags", "Meme Coin", "Solana Working", "Community Coin"],
  authors: [{ name: "Working Core Team" }],
  openGraph: {
    title: "Working Coin | $WORKIN - We Work For Our Bags",
    description: "Welcome to Working Coin ($WORKIN), the community-driven memecoin where we work for our bags! Join the movement, copy the CA, and start working.",
    url: "https://johnbyju.github.io/coin-website",
    siteName: "Working Coin",
    images: [
      {
        url: "/assets/images/mascot.png",
        width: 1024,
        height: 1024,
        alt: "$WORKIN Coin Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Working Coin | $WORKIN - We Work For Our Bags",
    description: "Welcome to Working Coin ($WORKIN), the community-driven memecoin where we work for our bags! Join the movement, copy the CA, and start working.",
    images: ["/assets/images/mascot.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="app-container">
          <div className="bg-mesh" aria-hidden="true" />
          {children}
        </div>
      </body>
    </html>
  );
}
