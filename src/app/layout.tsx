import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Providers } from "@/components";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={cn("bg-white text-slate-900 antialiased", inter.className)}
      lang="en"
    >
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
