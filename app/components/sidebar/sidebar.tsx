"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/app/hooks/use-sidebar";
import styles from "./Sidebar.module.scss";
import Link from "next/link";
import { useReadLocalStorage } from "usehooks-ts";
import { ILocalStorageData } from "@/types";

interface IRecipePath {
  path: string;
  title: string;
}

const Sidebar: React.FC = () => {
  const { isOpen } = useSidebar();
  const storage = useReadLocalStorage<ILocalStorageData>("culinaryai");
  const [recipePaths, setRecipePaths] = useState<IRecipePath[]>([]);

  useEffect(() => {
    const newPaths = Object.keys(storage?.recipes ?? [])
      .reverse()
      .map((key) => ({
        path: `/recipe/${key}`,
        title: storage?.recipes?.[key]?.title ?? "",
      }));
    setRecipePaths(newPaths);
  }, [storage]);

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
