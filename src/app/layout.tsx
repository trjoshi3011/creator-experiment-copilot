import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Creator Experiment Copilot",
  description:
    "Plan, run, and analyse content experiments for short-form creators.",
};

const navLinks = [
  { href: "/setup", label: "Setup" },
  { href: "/themes", label: "Themes" },
  { href: "/studio", label: "Studio" },
] as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
          <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
            <Link href="/" className="text-base font-semibold tracking-tight">
              Experiment Copilot
            </Link>
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/setup"
                className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-12 text-sm sm:grid-cols-4">
            <div>
              <h4 className="font-medium">Product</h4>
              <ul className="mt-3 space-y-2 text-muted">
                <li>
                  <Link href="/setup" className="hover:text-foreground">
                    Setup
                  </Link>
                </li>
                <li>
                  <Link href="/themes" className="hover:text-foreground">
                    Theme Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/studio" className="hover:text-foreground">
                    Experiment Studio
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Workflow</h4>
              <ul className="mt-3 space-y-2 text-muted">
                <li>
                  <span>Paste Comments</span>
                </li>
                <li>
                  <span>Extract Themes</span>
                </li>
                <li>
                  <span>Generate Experiments</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Built With</h4>
              <ul className="mt-3 space-y-2 text-muted">
                <li>Next.js</li>
                <li>Tailwind CSS</li>
                <li>Zod</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">About</h4>
              <p className="mt-3 text-muted">
                An AI copilot that helps short-form creators turn audience
                comments into ranked content experiments.
              </p>
            </div>
          </div>
          <div className="border-t border-border">
            <p className="mx-auto max-w-5xl px-6 py-4 text-xs text-muted">
              &copy; {new Date().getFullYear()} Creator Experiment Copilot
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
