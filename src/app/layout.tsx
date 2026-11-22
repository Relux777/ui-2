// biome-ignore-all lint/security/noDangerouslySetInnerHtml: Trusted inline bootstrap scripts generated exclusively from local constants.
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import HeaderComponent from "@/components/header";
import NavBarComponent from "@/components/navbar";
import BackgroundComponent from "@/components/background";

import { SCROLL_SCRIPT } from "@/config/scroll-state";
import { TEXT_SIZE_SCRIPT } from "@/config/text-size";

import { ThemeProvider } from "@/providers/theme-provider";
import { THEME_COLOR_SCRIPT, THEME_COLORS, THEME_KEY } from "@/config/theme";

import "@/assets/scss/RenDit_UI.scss";
import "@/assets/scss/generated/rendit-code.css";

export const metadata: Metadata = {
  applicationName: "RenDit UI",
  appleWebApp: {
    capable: true,
    title: "RenDit UI",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false, address: false, email: false },
};

const googleSans = localFont({
  src: "../assets/fonts/GoogleSans.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-google-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={googleSans.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_COLOR_SCRIPT }} />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{__html: `${TEXT_SIZE_SCRIPT};${SCROLL_SCRIPT};`,}} />
        <ThemeProvider storageKey={THEME_KEY}>
          <HeaderComponent />
          {children}
          <NavBarComponent />
          <BackgroundComponent />
        </ThemeProvider>
      </body>
    </html>
  );
}