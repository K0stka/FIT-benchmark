import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { branding } from "@/lib/branding";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: branding.name,
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="cs"
			suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased`}>
				<SessionProvider>
					<ThemeProvider attribute="class">
						{children}
						<Toaster
							position="top-right"
							richColors
						/>
					</ThemeProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
