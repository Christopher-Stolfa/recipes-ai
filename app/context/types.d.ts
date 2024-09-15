import { IRecipe } from "@/types";

export interface ISidebarContextProps {
  isOpen: boolean;
  toggle: () => void;
}

export interface IRecipesContextProps {
  recipes: IRecipe[];
}
