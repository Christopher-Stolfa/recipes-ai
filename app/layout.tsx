import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/app/components/navbar/navbar";
import MainContent from "@/app/components/main-content/main-content";
import "./globals.css";
import { RecipesProvider } from "./contexts/recipes-context/recipes-context";
import RecipeFormProvider from "./contexts/recipe-form-context/recipe-form-context";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Culinary AI",
  description: "Generate intuitive recipes",
};

interface IRootLayoutProps {
  children: React.ReactNode;
}

// TODO: Remove OR repurpose the sidebar navigation. Move options to the top navbar
const RootLayout = ({ children }: IRootLayoutProps) => (
  <html lang="en">
    <body className={inter.className}>
      <RecipesProvider>
        <RecipeFormProvider>
          <Navbar />
          <MainContent>{children}</MainContent>
        </RecipeFormProvider>
      </RecipesProvider>
    </body>
  </html>
);

export default RootLayout;
