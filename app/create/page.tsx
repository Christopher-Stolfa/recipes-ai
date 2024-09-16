"use client";
import { GENERATE_RECIPE } from "@/app/constants/endpoints";
import { ILocalStorageData, IRecipe, IRecipes } from "@/types";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm, Resolver, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Select, Button, Slider, Checkbox, InputNumber } from "antd";
import { getNames, registerLocale } from "i18n-iso-countries";
import countryLocale from "i18n-iso-countries/langs/en.json";
import TextArea from "antd/es/input/TextArea";
import styles from "./page.module.scss";
import { useLocalStorage } from "usehooks-ts";
registerLocale(countryLocale);

enum EMealType {
  breakfast = "breakfast",
  brunch = "brunch",
  lunch = "lunch",
  dinner = "dinner",
}

type IFormValues = {
  countries: typeof countryArray;
  allergies: string;
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

const Home: React.FC = () => {
  const storage = useLocalStorage<ILocalStorageData>("culinaryai", {
    recipes: {},
  });
  const { control, handleSubmit, setValue, watch } = useForm<IFormValues>({
    resolver,
    defaultValues: {
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
        allergies,
      }) => {
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

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <div className={styles.content}>
        <h1 className={styles.title}>Discover your next meal</h1>
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
          <label htmlFor="servings">Serving Size</label>
          <Controller
            name="servings"
            control={control}
            render={({ field }) => (
              <InputNumber
                addonAfter="servings"
                {...field}
                width={16}
                placeholder="Number of servings..."
              />
            )}
          />
        </div>
        <div>
          <label htmlFor="prepTime">Total cooking time</label>
          <Controller
            name="prepTime"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                addonAfter="mins"
                width={16}
                placeholder="Total cooking time..."
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
          name="allergies"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="allergies">Food Allergies</label>
              <TextArea
                {...field}
                rows={2}
                placeholder="List your food allergies if any..."
              />
            </div>
          )}
        />
        <Controller
          name="additionalDetails"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="additionalDetails">Additional Details</label>
              <TextArea
                {...field}
                rows={2}
                placeholder="Any special instructions such as dietary restrictions or additional details for your recipe..."
              />
            </div>
          )}
        />
        <Button
          className={styles.submitBtn}
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

export default Home;
