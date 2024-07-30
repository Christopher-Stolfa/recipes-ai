"use client";
import { IRecipe } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Hedvig_Letters_Serif } from "next/font/google";
import styles from "./page.module.scss";
import { Divider, Image } from "antd";

export const hedvigLettersSerif = Hedvig_Letters_Serif({
  subsets: ["latin"],
  display: "swap",
});

interface IRecipeProps {
  params: {
    id: string;
  };
}

const Recipe = ({ params: { id } }: IRecipeProps) => {
  const router = useRouter();
  const [recipe, setRecipe] = useState<IRecipe | null>(null);

  useEffect(() => {
    if (id) {
      const storedData = localStorage.getItem("culinaryai");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const recipeData = parsedData.recipes[id];
        if (recipeData) {
          setRecipe(recipeData);
        } else {
          router.replace("/404");
        }
      } else {
        router.replace("/404");
      }
    }
  }, [id, router]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <article className={`${hedvigLettersSerif.className} ${styles.container}`}>
      <section className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>{recipe?.title}</h1>
          <p className={styles.servingSizeTime}>Servings: {recipe?.servings}</p>
          <p className={styles.servingSizeTime}>
            Cooking time: {recipe?.time} minutes
          </p>
          <p className={styles.description}>{recipe?.description}</p>
        </div>
        <div className={styles.headerRight}>
          <Image
            className={styles.image}
            alt={recipe?.title}
            src={recipe?.imageUrl}
          />
        </div>
      </section>
      <section>
        <h2>Ingredients</h2>
        <Divider className={styles.divider} />
        <ul>
          {recipe?.ingredients?.map((ingredient) => (
            <li key={ingredient}>{ingredient}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Preparation</h2>
        <Divider className={styles.divider} />
        <ul>
          {recipe?.steps?.map((stepData) => (
            <li key={`${recipe?.title}-step-${stepData?.step}`}>
              <h3>
                Step {stepData?.step} - {stepData?.title}
              </h3>
              <small>Time: {stepData?.time}</small>
              <ul>
                {stepData?.instructions?.map((instruction, i) => (
                  <li key={`${stepData?.title}-instruction-${i}`}>
                    {instruction}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

export default Recipe;
