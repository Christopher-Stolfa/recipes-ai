import RecipeForm from "@/app/components/recipe-form/recipe-form";
import styles from "./page.module.scss";

const Home = () => {
  return (
    <div className={styles.container}>
      <RecipeForm />
    </div>
  );
};

export default Home;
