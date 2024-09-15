"use client";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { IRecipesContextProps, ISidebarContextProps } from "./types";
import { useReadLocalStorage } from "usehooks-ts";
import { ILocalStorageData, IRecipe } from "@/types";

export const RecipesContext = createContext<IRecipesContextProps>({
  recipes: [],
});

export const RecipesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const storage = useReadLocalStorage<ILocalStorageData>("culinaryai");
  const [recipes, setRecipes] = useState<IRecipe[]>([]);

  useEffect(() => {
    let nextRecipes: IRecipe[] = [];
    Object.keys(storage?.recipes ?? [])
      .reverse()
      .forEach((key) => {
        const nextRecipe = storage?.recipes?.[key];
        if (nextRecipe) {
          nextRecipes?.push(nextRecipe);
        }
      });
    setRecipes(nextRecipes);
  }, [storage]);

  return (
    <RecipesContext.Provider value={{ recipes }}>
      {children}
    </RecipesContext.Provider>
  );
};
