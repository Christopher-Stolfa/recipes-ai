import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/app/context/sidebar-context";
import Navbar from "@/app/components/navbar/navbar";
import MainContent from "@/app/components/main-content/main-content";
import "./globals.css";
import { RecipesProvider } from "./context/recipes-context";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Culinary AI",
  description: "Generate intuitive recipes",
};

interface IRootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: IRootLayoutProps) => (
  <html lang="en">
    <body className={inter.className}>
      <RecipesProvider>
        <SidebarProvider>
          <Navbar />
          <MainContent>{children}</MainContent>
        </SidebarProvider>
      </RecipesProvider>
    </body>
  </html>
);

export default RootLayout;
