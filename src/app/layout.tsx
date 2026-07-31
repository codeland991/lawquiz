import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LawQuiz - 법 조문 OX 암기 퀴즈",
  description:
    "현행 법령 조문 기반의 OX 암기 문제를 자동으로 생성·출제하는 국가공인 자격증 수험생용 학습 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="text-center text-xs text-foreground/50 py-6">
          LawQuiz · 법 조문 OX 암기 학습 서비스
        </footer>
      </body>
    </html>
  );
}
