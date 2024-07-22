"use client";
import Chatbox from "@/app/components/chatbox/chatbox";
import { IRecipe } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
      const storedRecipe = localStorage.getItem(id as string);
      if (storedRecipe) {
        setRecipe(JSON.parse(storedRecipe) as IRecipe);
      } else {
        router.replace("/404");
      }
    }
  }, [id, router]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <h1>{recipe?.title}</h1>
      <div>
        <h2>Ingredients</h2>
        <ul>
          {recipe?.ingredients?.map((ingredient) => (
            <li key={ingredient}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div>
        <ul>
          {recipe?.steps?.map((stepData) => (
            <li key={`${recipe?.title}-step-${stepData?.step}`}>
              <h2>{stepData?.title}</h2>
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
      </div>
    </main>
  );
};

export default Recipe;
