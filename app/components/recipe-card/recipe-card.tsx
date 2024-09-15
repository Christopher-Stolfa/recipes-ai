import { IRecipe } from "@/types";
import styles from "./recipe-card.module.scss";
import { Hedvig_Letters_Serif } from "next/font/google";
import { Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faClock,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";

const hedvigLettersSerif = Hedvig_Letters_Serif({
  subsets: ["latin"],
  display: "swap",
});

interface IProps {
  recipe: IRecipe;
  className?: string;
}

const RecipeCard = ({ recipe, className }: IProps) => {
  return (
    <div
      className={`${hedvigLettersSerif.className} ${className} ${styles.container}`}
    >
      <div>
        <h3>{recipe?.title}</h3>
      </div>
      <div className={styles.content}>
        <FontAwesomeIcon icon={faUtensils} />
        <p>Servings: {recipe?.servings}</p>
      </div>
      <div className={styles.content}>
        <FontAwesomeIcon icon={faClock} />
        <p>Cooking time: {recipe?.time} minutes</p>
      </div>
      <ul>
        {recipe?.ingredients?.slice(0, 3)?.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
        {recipe?.ingredients?.length > 2 && <li>...</li>}
      </ul>
      {/* <Tooltip color="#6B8A7A" key="#6B8A7A" title={recipe.description}>
        <FontAwesomeIcon icon={faCircleInfo} />
      </Tooltip> */}
      {/* <Tooltip color="#6B8A7A" key="#6B8A7A" title={recipe.description}>
        <FontAwesomeIcon icon={faCircleInfo} />
      </Tooltip> */}
    </div>
  );
};

export default RecipeCard;
