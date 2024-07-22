type RecipeStep = {
  step: number;
  title: string;
  time: string;
  instructions: string[];
};

export interface IRecipe {
  title: string;
  ingredients: string[];
  steps: RecipeStep[];
  word_count: number;
  chat_response: string;
}
