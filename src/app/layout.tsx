import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "../components/providers";
import { layoutConfig } from "../config/layout.config";
import Header from "../components/UI/layout/header";
import { SessionProvider } from "next-auth/react";
import { auth } from "../auth/auth";
import "./globals.css";
import AppLoader from "../hoc/app-loader";
import Title from "../components/UI/layout/title";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Татарская кухня",
  description: `Рецепты татарской кухни с пошаговыми инструкциями и фотографиями. 
  Узнайте, как приготовить традиционные блюда татарской кухни, 
  такие как эчпочмак, кыстыбый, чак-чак и многое другое.`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SessionProvider session={session}>
            <AppLoader>
              <Header />
              <main className="flex flex-col w-full justify-start">
                <Title />

                {children}
              </main>
              <footer
                className="flex justify-center items-center"
                style={{ height: layoutConfig.footerHeight }}
              >
                Footer
              </footer>
            </AppLoader>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
