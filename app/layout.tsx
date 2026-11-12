import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SubscriptionProvider } from "@/context/subscription-context";
import { ThemeProvider } from "@/context/theme-context";
import { I18nProvider } from "@/context/i18n-context";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SubSentra - Your Money, Under Control",
  description: "SubSentra: Smart subscription manager, savings simulator, and investment growth tracker.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <I18nProvider>
            <SubscriptionProvider>
              {children}
            </SubscriptionProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
