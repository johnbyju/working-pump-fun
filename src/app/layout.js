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
  title: "$BAGS Coin | We Work For Our Bags",
  description: "Welcome to $BAGS, the community-driven memecoin where we work for our bags! Get the Contract Address (CA), track charts, and participate in our interactive bag builder.",
  keywords: ["$BAGS", "Bags Coin", "We Work For Our Bags", "Crypto Bags", "Meme Coin", "Solana Bags", "Community Coin"],
  authors: [{ name: "Bags Core Team" }],
  openGraph: {
    title: "$BAGS Coin | We Work For Our Bags",
    description: "Welcome to $BAGS, the community-driven memecoin where we work for our bags! Join the movement, copy the CA, and start clicking.",
    url: "https://johnbyju.github.io/coin-website",
    siteName: "$BAGS Coin",
    images: [
      {
        url: "/assets/images/mascot.png",
        width: 1024,
        height: 1024,
        alt: "$BAGS Cyber Bag Mascot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "$BAGS Coin | We Work For Our Bags",
    description: "Welcome to $BAGS, the community-driven memecoin where we work for our bags! Join the movement, copy the CA, and start clicking.",
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
