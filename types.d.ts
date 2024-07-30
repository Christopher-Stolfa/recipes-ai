type RecipeStep = {
  step: number;
  title: string;
  time: string;
  instructions: string[];
};

export interface IRecipe {
  title: string;
  description: string;
  servings: number;
  time: number;
  ingredients: string[];
  steps: RecipeStep[];
  wordCount: number;
  chatResponse: string;
  imageUrl: string;
}

export interface IRecipes {
  [key: string]: IRecipe;
}
export interface ILocalStorageData {
  recipes: IRecipes;
}
