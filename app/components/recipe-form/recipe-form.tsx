"use client";
import { GENERATE_RECIPE } from "@/app/constants/endpoints";
import { ILocalStorageData, IRecipe, IRecipes } from "@/types";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm, Resolver, SubmitHandler, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Select, Button, Slider, Checkbox, Input } from "antd";
import { getNames, registerLocale } from "i18n-iso-countries";
import countryLocale from "i18n-iso-countries/langs/en.json";
import TextArea from "antd/es/input/TextArea";
import styles from "./recipe-form.module.scss";
registerLocale(countryLocale);

enum EMealType {
  breakfast = "breakfast",
  brunch = "brunch",
  lunch = "lunch",
  dinner = "dinner",
}

type IFormValues = {
  countries: typeof countryArray;
  additionalDetails: string;
  difficulty: number;
  prepTime: number;
  servings: number;
  [EMealType.breakfast]: boolean;
  [EMealType.brunch]: boolean;
  [EMealType.lunch]: boolean;
  [EMealType.dinner]: boolean;
};

const countryList = getNames("en", {
  select: "official",
});

const countryArray = Object.keys(countryList).map((isoCode) => ({
  label: countryList[isoCode],
  value: countryList[isoCode],
  isoCode,
}));

const mealTypeOptions: { label: string; value: EMealType }[] = [
  { label: "Breakfast", value: EMealType.breakfast },
  { label: "Brunch", value: EMealType.brunch },
  { label: "Lunch", value: EMealType.lunch },
  { label: "Dinner", value: EMealType.dinner },
];

const resolver: Resolver<IFormValues> = async (values) => {
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

const RecipeForm: React.FC = () => {
  const { control, handleSubmit, setValue, watch } = useForm<IFormValues>({
    resolver,
    defaultValues: {
      countries: [],
      additionalDetails: "",
      difficulty: 3,
      servings: 2,
      breakfast: false,
      brunch: false,
      lunch: true,
      dinner: true,
    },
  });
  const router = useRouter();
  const {
    setInput,
    handleSubmit: handleApiSubmit,
    isLoading: chatEndpointIsLoading,
  } = useChat({
    api: GENERATE_RECIPE,
    async onResponse(response) {
      try {
        const responseJson: IRecipe = await response.clone().json();
        const id = uuidv4();
        let recipes: IRecipes = {};
        const storedData = localStorage.getItem("culinaryai");
        if (storedData) {
          const storageData: ILocalStorageData = JSON.parse(storedData);
          recipes = storageData?.recipes ?? {};
        }
        recipes[id] = responseJson;
        localStorage.setItem("culinaryai", JSON.stringify({ recipes }));
        router.push(`/recipe/${id}`);
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

  const onSubmit = handleSubmit((formValues) => {
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
      }) => {
        setInput(
          `The recipe must be relevant to the following params:
        additionalDetails=${additionalDetails}.
        countries=${countries?.join(", ")}.
        The difficulty of the recipe is a range between 1 and 10, 1 being the easiest and 10 being the hardest.
        difficulty=${difficulty}.
        prepTime=${prepTime} minutes.
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

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <div className={styles.content}>
        <div>
          <label>Select the type of meal</label>
          <div>
            {mealTypeOptions.map((option) => (
              <Controller
                key={option.value}
                name={option.value}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e) => setValue(option.value, e.target.checked)}
                  >
                    {option.label}
                  </Checkbox>
                )}
              />
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="servings">Number of servings</label>
          <Controller
            name="servings"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                width={16}
                placeholder="Any special instructions or additional details for your recipe..."
              />
            )}
          />
        </div>
        <Controller
          name="countries"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="countries">Countries of influence</label>
              <Select
                {...field}
                disabled={chatEndpointIsLoading}
                mode="multiple"
                allowClear
                style={{
                  width: "100%",
                }}
                placeholder="Please select"
                options={countryArray}
              />
            </div>
          )}
        />
        <Controller
          name="difficulty"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="difficulty">Recipe difficulty</label>
              <Slider
                {...field}
                marks={{
                  1: 1,
                  2: 2,
                  3: 3,
                  4: 4,
                  5: 5,
                  6: 6,
                  7: 7,
                  8: 8,
                  9: 9,
                  10: 10,
                }}
                min={1}
                max={10}
              />
            </div>
          )}
        />
        <Controller
          name="prepTime"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="prepTime">Total cooking time</label>
              <Slider
                {...field}
                marks={{
                  5: 5,
                  15: 15,
                  30: 30,
                  45: 45,
                  60: 60,
                  75: 75,
                  90: 90,
                  105: 105,
                  120: 120,
                }}
                min={5}
                max={120}
                step={5}
                defaultValue={30}
                tooltip={{ formatter: (value) => `${value} min` }}
              />
            </div>
          )}
        />
        <Controller
          name="additionalDetails"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              rows={2}
              placeholder="Any special instructions such as dietary restrictions or additional details for your recipe..."
            />
          )}
        />
        <Button
          disabled={chatEndpointIsLoading}
          loading={chatEndpointIsLoading}
          htmlType="submit"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default RecipeForm;
