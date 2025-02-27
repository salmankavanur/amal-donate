import { Outfit } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route"; // Verify this path
import { redirect } from "next/navigation";
import {SessionProvider} from "../lib/Context/SessionContext"

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  // Safeguard against undefined session or role
  if (!session || !["Super Admin", "Manager", "Admin"].includes(session?.user?.role)) {
    redirect("/auth/admin/signin");
  }

  return (

    <div className={`${outfit.variable} dark:bg-gray-900`}>
      <SessionProvider session={session}>
      <ThemeProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
      </SessionProvider>
    </div>
  
  );
}