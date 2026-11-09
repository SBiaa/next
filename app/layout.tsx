import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Tracker } from "@/components/Tracker";
import { GoogleTagManager } from "@/components/GoogleTagManager";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "600", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Next — Marketing, vídeo, design e tecnologia",
  description:
    "Marketing, vídeo, design e tecnologia pra colocar o seu comércio no próximo nível. Ideia, gravação, execução e entrega — tudo com a Next.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={outfit.variable}>
      <body>
        {children}
        <Tracker />
        <GoogleTagManager />
      </body>
    </html>
  );
}
