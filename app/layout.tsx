import type { Metadata } from "next";
import { cookies } from "next/headers";

import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getDarkTheme } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Обяви за работа — Jobstate",
  description:
    "Актуални обяви за работа от фирми, които търсят служители чрез Jobstate.",
  metadataBase: new URL("https://jobs.jobstate.net"),
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const cookieStore = await cookies();

  const theme = cookieStore.get("theme")?.value === "light"
    ? "light"
    : "dark";

  const darkTheme = theme === "dark"
    ? await getDarkTheme()
    : {};

  return (
    <html
      lang="bg"
      data-theme={theme}
      className="h-full antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </head>

      <body className="min-h-full flex flex-col">
        {theme === "dark" && (
          <style
            dangerouslySetInnerHTML={{
              __html: Object.entries(darkTheme)
                .map(
                  ([key, value]) =>
                    `:root{--${key}:${value}}`
                )
                .join(""),
            }}
          />
        )}

        <Navbar />

        <div style={{ flex: 1 }}>
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}