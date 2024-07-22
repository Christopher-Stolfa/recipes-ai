"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/app/hooks/use-sidebar";
import styles from "./Sidebar.module.scss";
import Link from "next/link";

interface IRecipePath {
  path: string;
  title: string;
}

const Sidebar: React.FC = () => {
  const { isOpen } = useSidebar();
  const [recipePaths, setRecipePaths] = useState<IRecipePath[]>([]);

  const getRecipeKeys = () => {
    const storedData = localStorage.getItem("culinaryai");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const newPaths = Object.keys(parsedData.recipes).map((key) => ({
        path: `/recipe/${key}`,
        title: parsedData.recipes[key].title,
      }));
      setRecipePaths(newPaths);
    }
  };

  useEffect(() => {
    getRecipeKeys();
    const handleStorageChange = (event: StorageEvent) => {
      console.log("storage change");
      if (event.key === "culinaryai") {
        getRecipeKeys();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  return (
    <div
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      <div className={styles.menuContent}>
        <menu className={styles.menuList}>
          <Link href="/">
            <li className={styles.menuItem}>Home</li>
          </Link>
          {recipePaths?.map((recipePath) => (
            <Link key={recipePath?.path} href={recipePath?.path}>
              <li className={styles.menuItem}>{recipePath?.title}</li>
            </Link>
          ))}
        </menu>
      </div>
    </div>
  );
};

export default Sidebar;
