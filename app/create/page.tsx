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
import RecipeDrawer from "../components/recipe-drawer/recipe-drawer";

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
    optionsShown,
    optionsMap,
    handleOptionClick,
  } = useRecipeForm();

  const countryOption = optionsMap?.countries;
  const additionalDetailsOption = optionsMap?.additionalDetails;
  const difficultyOption = optionsMap?.difficulty;
  const preptimeOption = optionsMap?.prepTime;
  const servingsOption = optionsMap?.servings;
  const allergiesOption = optionsMap?.allergies;

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <div className={styles.content}>
        <h1 className={styles.title}>Discover your next meal</h1>
        <div className={styles.options}>
          {countryOption && (
            <RecipeDrawer
              icon={countryOption?.icon}
              key={countryOption?.label}
              isChecked={countryOption?.isChecked}
              label={countryOption?.label}
              onClick={() => handleOptionClick(countryOption?.name)}
            >
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
            </RecipeDrawer>
          )}
          {servingsOption && (
            <RecipeDrawer
              icon={servingsOption?.icon}
              key={servingsOption?.label}
              isChecked={servingsOption?.isChecked}
              label={servingsOption?.label}
              onClick={() => handleOptionClick(servingsOption?.name)}
            >
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
            </RecipeDrawer>
          )}
          {preptimeOption && (
            <RecipeDrawer
              icon={preptimeOption?.icon}
              key={preptimeOption?.label}
              isChecked={preptimeOption?.isChecked}
              label={preptimeOption?.label}
              onClick={() => handleOptionClick(preptimeOption?.name)}
            >
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
            </RecipeDrawer>
          )}
          {difficultyOption && (
            <RecipeDrawer
              icon={difficultyOption?.icon}
              key={difficultyOption?.label}
              isChecked={difficultyOption?.isChecked}
              label={difficultyOption?.label}
              onClick={() => handleOptionClick(difficultyOption?.name)}
            >
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
            </RecipeDrawer>
          )}
          {allergiesOption && (
            <RecipeDrawer
              icon={allergiesOption?.icon}
              key={allergiesOption?.label}
              isChecked={allergiesOption?.isChecked}
              label={allergiesOption?.label}
              onClick={() => handleOptionClick(allergiesOption?.name)}
            >
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
            </RecipeDrawer>
          )}
          {additionalDetailsOption && (
            <RecipeDrawer
              icon={additionalDetailsOption?.icon}
              key={additionalDetailsOption?.label}
              isChecked={additionalDetailsOption?.isChecked}
              label={additionalDetailsOption?.label}
              onClick={() => handleOptionClick(additionalDetailsOption?.name)}
            >
              <Controller
                name="additionalDetails"
                control={control}
                render={({ field }) => (
                  <div>
                    <label htmlFor="additionalDetails">
                      Additional Details
                    </label>
                    <TextArea
                      {...field}
                      rows={2}
                      placeholder="Any special instructions such as dietary restrictions or additional details for your recipe..."
                    />
                  </div>
                )}
              />
            </RecipeDrawer>
          )}
        </div>
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
