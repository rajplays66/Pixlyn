import { Caveat, Nunito } from "next/font/google";
import "./globals.css";

const handwritten = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-handwritten",
});

const body = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata = {
  title: "Pixlyn",
  description: "A personal photo journal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${handwritten.variable} ${body.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
