import type { Metadata } from "next";
import { Press_Start_2P, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arcade Vault",
  description: "Plataforma retro de juegos en línea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${pressStart2P.variable} ${jetBrainsMono.variable}`}>
      <body>
        <div className="av-bg" />
        <div className="av-noise" />
        <Nav />
        <main className="av-main">{children}</main>
        <footer style={{ borderTop: "1px solid var(--line)", padding: "20px 32px", textAlign: "center", color: "var(--ink-faint)", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em" }}>
          © 2026 ARCADE VAULT · HECHO CON PIXELES Y NEÓN · v2.6.0
        </footer>
      </body>
    </html>
  );
}
