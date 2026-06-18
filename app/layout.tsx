import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "monshop — Premium байгалийн арьс арчилгаа",
  description:
    "Байгалийн найрлагатай, dermatologist шалгасан, харгислалгүй premium арьс арчилгааны бараа.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${poppins.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <SmoothScroll>
            <ScrollProgress />
            {children}
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
