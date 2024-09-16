"use client";
import React, { useContext } from "react";
import { useSidebar } from "@/app/hooks/use-sidebar";
import styles from "./sidebar.module.scss";
import Link from "next/link";
import { RecipesContext } from "@/app/context/recipes-context";

const Sidebar: React.FC = () => {
  const { isOpen } = useSidebar();
  const { recipes } = useContext(RecipesContext);

  return (
    <div
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      <div className={styles.menuContent}>
        <menu className={styles.menuList}>
          <Link href="/">
            <li className={styles.menuItem}>Home</li>
          </Link>
          {recipes?.map(({ id, path, title }) => (
            <Link key={id} href={path}>
              <li className={styles.menuItem}>{title}</li>
            </Link>
          ))}
        </menu>
      </div>
    </div>
  );
};

export default Sidebar;
