import { RecipeFormContext } from "@/app/contexts/recipe-form-context/recipe-form-context";
import { IRecipeFormValues } from "@/app/contexts/recipe-form-context/types";
import {
  faBiohazard,
  faClock,
  faEarthAmericas,
  faKitchenSet,
  faNewspaper,
  faUtensils,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useMemo, useState } from "react";

type TOptionName =
  | "countries"
  | "additionalDetails"
  | "difficulty"
  | "prepTime"
  | "servings"
  | "allergies";

type TOption = {
  name: TOptionName;
  label: string;
  icon: IconDefinition;
  isChecked: boolean;
};

const initialOptionsShown: TOption[] = [
  {
    name: "countries",
    label: "Countries",
    icon: faEarthAmericas,
    isChecked: false,
  },
  {
    name: "additionalDetails",
    label: "Specific Instructions",
    icon: faNewspaper,
    isChecked: false,
  },
  {
    name: "difficulty",
    label: "Difficulty",
    icon: faKitchenSet,
    isChecked: false,
  },
  { name: "prepTime", label: "Cooking Time", icon: faClock, isChecked: false },
  {
    name: "servings",
    label: "Serving Size",
    icon: faUtensils,
    isChecked: false,
  },
  {
    name: "allergies",
    label: "Filter Allergies",
    icon: faBiohazard,
    isChecked: false,
  },
];

const useRecipeForm = () => {
  const context = useContext(RecipeFormContext);
  const [optionsShown, setOptionsShown] = useState(initialOptionsShown);

  if (!context) {
    throw new Error("useChatContext must be used within the RecipeProvider");
  }

  const { form, chat } = context;
  const { handleSubmit, watch } = form;
  const { handleSubmit: handleApiSubmit, setInput } = chat;

  const optionsMap = useMemo(() => {
    return optionsShown?.reduce<Record<TOptionName, TOption>>((acc, option) => {
      acc[option.name as TOptionName] = option;
      return acc;
    }, {} as Record<TOptionName, TOption>);
  }, [optionsShown]);

  const handleOptionClick = (name: string) => {
    setOptionsShown((prev) =>
      prev?.map((option) =>
        option?.name === name
          ? { ...option, isChecked: !option?.isChecked }
          : option
      )
    );
  };

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
        servings,
        allergies,
      }: IRecipeFormValues) => {
        setInput(
          `The recipe must be relevant to the following params:
            allergies=${allergies}
            It is critical that the recipe accounts for food allergies otherwise people will die.
            prepTime=${prepTime} minutes.
            The recipe must accurately reflect the same time limit for cooking as the inputted prepTime.
            additionalDetails=${additionalDetails}.
            countries=${countries?.join(", ")}.
            The difficulty of the recipe is a range between 1 and 10, 1 being the easiest and 10 being the hardest.
            difficulty=${difficulty}.
            numberOfServings=${servings}
            `
        );
      }
    );
  }, [watch, setInput]);

  return { form, chat, onSubmit, optionsShown, optionsMap, handleOptionClick };
};

export default useRecipeForm;
