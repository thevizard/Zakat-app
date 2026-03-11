import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zakat Calculator",
  description: "Calculate and pay your Zakat easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ fontFamily: openSans.style.fontFamily }}>
      <body
        style={{ fontFamily: openSans.style.fontFamily }}
        className="antialiased"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
