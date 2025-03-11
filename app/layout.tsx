import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { redirect } from 'next/navigation'
import { createClient } from '@/supabase/server'

export const metadata: Metadata = {
  title: "chat",
  description: "chat",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
