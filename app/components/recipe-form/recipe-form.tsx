"use client";
import { OPEN_AI } from "@/app/constants/endpoints";
import { ILocalStorageData, IRecipe, IRecipes } from "@/types";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm, Resolver, SubmitHandler, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Select, Button } from "antd";
import { getNames, registerLocale } from "i18n-iso-countries";
import countryLocale from "i18n-iso-countries/langs/en.json";
registerLocale(countryLocale);
const countryList = getNames("en", {
  select: "official",
});
const countryArray = Object.keys(countryList).map((isoCode) => ({
  label: countryList[isoCode],
  value: countryList[isoCode],
  isoCode,
}));
type IFormValues = {
  countries: typeof countryArray;
};

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
  const { control, handleSubmit, formState, watch } = useForm<IFormValues>({
    resolver,
  });
  const router = useRouter();
  const {
    setInput,
    handleSubmit: handleApiSubmit,
    isLoading: chatEndpointIsLoading,
  } = useChat({
    api: OPEN_AI,
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
    watch(({ countries }) => {
      setInput(
        `The recipe must be relevant to the following params:
        countries=${countries?.join(", ")}
        `
      );
    });
  }, [watch, setInput]);

  return (
    <form onSubmit={onSubmit}>
      <Controller
        name="countries"
        control={control}
        render={({ field }) => (
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
        )}
      />
      <Button
        disabled={chatEndpointIsLoading}
        loading={chatEndpointIsLoading}
        htmlType="submit"
      >
        Submit
      </Button>
    </form>
  );
};

export default RecipeForm;
