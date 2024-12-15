import { RecipeFormContext } from "@/app/contexts/recipe-form-context/recipe-form-context";
import { IRecipeFormValues } from "@/app/contexts/recipe-form-context/types";
import { useContext, useEffect, useState } from "react";

const initialOptionsShown = {
  countries: false,
  additionalDetails: false,
  difficulty: false,
  prepTime: false,
  breakfast: false,
  brunch: false,
  lunch: false,
  dinner: false,
  servings: false,
  allergies: false,
};

const useRecipeForm = () => {
  const context = useContext(RecipeFormContext);
  const [optionsShown, setOptionsShown] = useState(initialOptionsShown);

  if (!context) {
    throw new Error("useChatContext must be used within the RecipeProvider");
  }

  const { form, chat } = context;
  const { handleSubmit, watch } = form;
  const { handleSubmit: handleApiSubmit, setInput } = chat;

  const onSubmit = handleSubmit(() => {
    handleApiSubmit();
  });

  useEffect(() => {
    watch(
      ({
        countries,
        additionalDetails,
        difficulty,
        prepTime,
        breakfast,
        brunch,
        lunch,
        dinner,
        servings,
        allergies,
      }: IRecipeFormValues) => {
        setInput(
          `The recipe must be relevant to the following params:
            allergies=${allergies}
            It is critical that the recipe accounts for food allergies otherwise people will die.
            prepTime=${prepTime} minutes.
            The recipe must contain the same time limit for cooking as the inputted prepTime.
            additionalDetails=${additionalDetails}.
            countries=${countries?.join(", ")}.
            The difficulty of the recipe is a range between 1 and 10, 1 being the easiest and 10 being the hardest.
            difficulty=${difficulty}.
            The recipe should be breakfast, brunch, lunch, or dinner if their values are true.
            breakfast=${breakfast}.
            brunch=${brunch}.
            lunch=${lunch}.
            dinner=${dinner}.
            numberOfServings=${servings}
            `
        );
      }
    );
  }, [watch, setInput]);

  return { form, chat, onSubmit };
};

export default useRecipeForm;
