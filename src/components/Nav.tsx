"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "@/components/AuthButton";

const LINKS = [
  { href: "/", label: "소개" },
  { href: "/quiz", label: "문제 풀기" },
  { href: "/wrong-notes", label: "오답노트" },
  { href: "/board", label: "게시판" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-black/10 dark:border-white/10 sticky top-0 bg-[var(--background)]/90 backdrop-blur z-10">
      <nav className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3 gap-3">
        <Link href="/" className="font-bold text-lg tracking-tight shrink-0">
          LawQuiz
        </Link>
        <ul className="flex gap-1 sm:gap-2 flex-1">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-foreground/70 hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <AuthButton />
      </nav>
    </header>
  );
}
