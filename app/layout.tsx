import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { I18nProvider } from "../providers/I18nProvider";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Luxe Estate",
  description: "Find your sanctuary.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        {/* Note: SF Pro Display is typically used as a local system font on Apple devices, relying on fallback below */}
      </head>
      <body
        className="bg-background-light dark:bg-background-dark text-nordic-dark dark:text-white font-display antialiased selection:bg-mosque selection:text-white"
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <I18nProvider initialLocale={locale}>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

