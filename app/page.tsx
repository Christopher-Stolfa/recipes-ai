"use client";
import { Button, Input } from "antd";
import styles from "./page.module.scss";
import { useForm, Resolver, Controller } from "react-hook-form";
import { useDebounceCallback, useReadLocalStorage } from "usehooks-ts";
import { useCallback, useContext, useEffect, useState } from "react";
import { RecipesContext } from "./contexts/recipes-context/recipes-context";
import { IRecipe } from "@/types";
import RecipeCard from "./components/recipe-card/recipe-card";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface IFormValues {
  searchInput: string;
}

const Home: React.FC = () => {
  const router = useRouter();
  const { recipes } = useContext(RecipesContext);
  const { control, handleSubmit, setValue, watch } = useForm<IFormValues>({
    defaultValues: {
      searchInput: "",
    },
  });
  const [searchedRecipes, setSearchedRecipes] = useState<IRecipe[]>([]);

  const watchedValue = watch("searchInput");

  const handleSearch = useCallback(
    (searchInput = "") => {
      console.log(searchInput);
      const filteredRecipes = recipes?.filter((recipe) =>
        recipe?.title?.toLowerCase()?.includes(searchInput?.toLowerCase())
      );
      setSearchedRecipes(filteredRecipes);
    },
    [recipes]
  );

  const debounceSearch = useDebounceCallback(handleSearch, 300);

  const onSubmit = handleSubmit(({ searchInput }) =>
    debounceSearch(searchInput)
  );

  const handleNewRecipe = () => router.push("/create", { scroll: false });

  useEffect(() => {
    debounceSearch(watchedValue);
  }, [watchedValue, debounceSearch, handleSubmit]);

  return (
    <div className={styles.container}>
      <form className={styles.searchbox} onSubmit={onSubmit}>
        <Controller
          name="searchInput"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="searchInput">Search</label>
              <div className={styles.flexRow}>
                <Input
                  {...field}
                  role="searchbox"
                  placeholder="Search for recipes..."
                />
                <Button onClick={handleNewRecipe}>Create</Button>
              </div>
            </div>
          )}
        />
      </form>
      <div className={styles.cardGrid}>
        {searchedRecipes?.map((recipe, i) => (
          <RecipeCard recipe={recipe} key={`recipe-card-${recipe.id}`} />
        ))}
      </div>
    </div>
  );
};

export default Home;
