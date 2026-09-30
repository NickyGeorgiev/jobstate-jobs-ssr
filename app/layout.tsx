import type { Metadata } from "next";

import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getThemeSettings } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Обяви за работа — Jobstate",
  description:
    "Актуални обяви за работа от фирми, които търсят служители чрез Jobstate.",
  metadataBase: new URL("https://jobs.jobstate.net"),
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  // И двете теми се зареждат винаги (без cookies()), за да може страницата да е
  // статична/кеширана (ISR). Коя от двете се вижда се избира в браузъра
  // от малкия скрипт по-долу, преди първото изрисуване — просто превключва
  // data-theme, CSS-ът за двете вече е на страницата.
  const { dark: darkTheme, light: lightTheme } = await getThemeSettings();

  const toCss = (values: Record<string, string>) =>
    Object.entries(values)
      .map(([key, value]) => `--${key}:${value}`)
      .join(";");

  const darkThemeCss = toCss(darkTheme);
  const lightThemeCss = toCss(lightTheme);

  return (
    <html
      lang="bg"
      data-theme="dark"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=document.cookie.match(/(?:^|; )theme=(light|dark)/);document.documentElement.setAttribute('data-theme',m?m[1]:'dark')}catch(e){}",
          }}
        />
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
        <style
          dangerouslySetInnerHTML={{
            __html: `:root:not([data-theme="light"]){${darkThemeCss}} :root[data-theme="light"]{${lightThemeCss}}`,
          }}
        />

        <Navbar />

        <div style={{ flex: 1 }}>
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}