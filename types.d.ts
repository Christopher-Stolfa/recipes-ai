type RecipeStep = {
  step: number;
  title: string;
  time: string;
  instructions: string[];
};

export interface IRecipe {
  title: string;
  description: string;
  ingredients: string[];
  steps: RecipeStep[];
  word_count: number;
  chat_response: string;
}

export interface IRecipes {
  [key: string]: IRecipe;
}
export interface ILocalStorageData {
  recipes: IRecipes;
}
