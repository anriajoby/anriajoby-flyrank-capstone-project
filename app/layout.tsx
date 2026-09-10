import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Frontend Capstone",
  description: "Foundations for an AI-enhanced frontend application.",
};

const navigation = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Chat" },
  { href: "/history", label: "History" },
  { href: "/health", label: "Health" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-white">
          <nav
            aria-label="Main navigation"
            className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <Link href="/" className="text-lg font-semibold">
              AI Frontend Capstone
            </Link>

            <div className="flex flex-wrap gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-slate-100 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>

        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
