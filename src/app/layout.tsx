import type { Metadata } from "next";
import { Providers } from "@/providers/Providers";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
    title: "Developer Intelligence Dashboard",
    description: "Production-grade GitHub repository and developer search with real-time insights.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen flex flex-col antialiased">
                <Providers>
                    <Header />
                    <div className="flex-1 flex flex-col">{children}</div>
                    <footer className="w-full py-6 mt-auto border-t border-white/10 text-center text-xs text-content-muted backdrop-blur-md">
                        <p>
                            Developer Intelligence Dashboard · Data directly from the GitHub REST API
                        </p>
                    </footer>
                </Providers>
            </body>
        </html>
    );
}

