"use client";
import React, { createContext, ReactNode } from "react";
import { IRecipesContextProps } from "../recipes-context/types";

import { GENERATE_RECIPE } from "@/app/constants/endpoints";
import { ILocalStorageData, IRecipe } from "@/types";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";
import { useForm, Resolver } from "react-hook-form";
import { useLocalStorage } from "usehooks-ts";
import { IRecipeFormProps, IRecipeFormValues } from "./types";

const resolver: Resolver<IRecipeFormValues> = async (values) => {
  return {
    values: values.countries ? values : {},
    errors: !values.countries
      ? {
          countries: {
            type: "required",
            message: "This is required.",
          },
        }
      : {},
  };
};

export const RecipeFormContext = createContext<IRecipeFormProps | undefined>(
  undefined
);

export const RecipeFormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const defaultValues: IRecipeFormValues = {
    countries: [],
    allergies: "",
    additionalDetails: "",
    difficulty: 3,
    servings: 2,
    prepTime: 25,
    breakfast: false,
    brunch: false,
    lunch: true,
    dinner: true,
    vegan: false,
    vegetarian: false,
  };

  const router = useRouter();
  const storage = useLocalStorage<ILocalStorageData>("culinaryai", {
    recipes: {},
  });
  const form = useForm<IRecipeFormValues>({
    resolver,
    defaultValues,
  });
  const chat = useChat({
    api: GENERATE_RECIPE,
    async onResponse(response) {
      try {
        const newRecipe: IRecipe = await response.clone().json();
        storage[1]((prev) => {
          const nextObject = { recipes: { ...prev.recipes } };
          nextObject.recipes[newRecipe.id] = newRecipe;
          return nextObject;
        });
        router.push(newRecipe.path);
      } catch (error) {
        console.error(error);
      } finally {
      }
    },
    streamMode: "text",
    onError: (e) => {
      console.error(e.message);
    },
  });

  return (
    <RecipeFormContext.Provider value={{ chat, form, defaultValues }}>
      {children}
    </RecipeFormContext.Provider>
  );
};

export default RecipeFormProvider;
