"use client";
import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
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

  const mapRecipes = useCallback(() => {
    const nextRecipes: IRecipe[] = [];
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

  useEffect(mapRecipes, [mapRecipes]);

  return (
    <RecipesContext.Provider value={{ recipes }}>
      {children}
    </RecipesContext.Provider>
  );
};
