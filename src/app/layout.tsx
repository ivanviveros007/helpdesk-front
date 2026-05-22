import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/layout/Providers";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Helpdesk AI",
  description: "Sistema inteligente de mesa de ayuda con IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full bg-slate-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
