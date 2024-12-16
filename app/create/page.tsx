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
import useRecipeForm from "../hooks/use-recipe-form/use-recipe-form";
import { TRecipeFormMealType } from "../contexts/recipe-form-context/types";
import Chip from "../components/chip/chip";

registerLocale(countryLocale);

const countryList = getNames("en", {
  select: "official",
});

const countryArray = Object.keys(countryList).map((isoCode) => ({
  label: countryList[isoCode],
  value: countryList[isoCode],
  isoCode,
}));

const mealTypeOptions: { label: string; value: TRecipeFormMealType }[] = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Brunch", value: "brunch" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
];

const CreateRecipeForm: React.FC = () => {
  const {
    onSubmit,
    chat: { isLoading },
    form: { control },
  } = useRecipeForm();
  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <div className={styles.content}>
        <h1 className={styles.title}>Discover your next meal</h1>
        <div className={styles.options}>
          <Chip isChecked={false}>Recipe Name</Chip>
          <Chip isChecked={false}>Breakfast</Chip>
          <Chip isChecked={false}>Lunch</Chip>
          <Chip isChecked={false}>Dinner</Chip>
          <Chip isChecked={false}>Serving Size</Chip>
          <Chip isChecked={false}>Cooking Time</Chip>
          <Chip isChecked={false}>Countries</Chip>
          <Chip isChecked={false}>Difficulty</Chip>
          <Chip isChecked={false}>Filter Allergies</Chip>
          <Chip isChecked={false}>Specific Instructions</Chip>
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
                disabled={isLoading}
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
          disabled={isLoading}
          loading={isLoading}
          htmlType="submit"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default CreateRecipeForm;
