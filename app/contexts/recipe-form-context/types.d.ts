import { UseChatHelpers } from "ai/react";

export type TRecipeFormMealType = "breakfast" | "brunch" | "lunch" | "dinner";

export interface IRecipeFormValues {
  countries: typeof countryArray;
  allergies: string;
  additionalDetails: string;
  difficulty: number;
  prepTime: number;
  servings: number;
  breakfast: boolean;
  brunch: boolean;
  lunch: boolean;
  dinner: boolean;
  vegan: boolean;
  vegetarian: boolean;
}

type TChatProps = UseChatHelpers & {
  experimental_addToolResult: ({
    toolCallId,
    result,
  }: {
    toolCallId: string;
    result: any;
  }) => void;
  addToolResult: ({
    toolCallId,
    result,
  }: {
    toolCallId: string;
    result: any;
  }) => void;
};

type TForm = UseFormReturn<IRecipeFormValues, any, undefined>;

export interface IRecipeFormProps {
  chat: TChatProps;
  form: TForm;
  defaultValues: IRecipeFormValues;
}

type TRecipeFormValueKey = keyof IRecipeFormValues;

type TOptionState = {
  [OptionName in keyof IFormValues]: boolean;
};
