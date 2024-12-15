type TRecipeFormValueKey = keyof IRecipeFormValues;

type TOptionState = {
  [OptionName in keyof IFormValues]: boolean;
};
