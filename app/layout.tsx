import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SupabaseProvider } from "@/components/providers/supabase-provider";

const inter = Inter({ subsets: ["latin"] });

// This is the root layout that will be server-side rendered
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <SupabaseProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
