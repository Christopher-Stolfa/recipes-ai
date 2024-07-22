"use client";
import React from "react";
import { useSidebar } from "@/app/hooks/use-sidebar";
import styles from "./Sidebar.module.scss";
import { IRecipe } from "@/types";

const Sidebar: React.FC = () => {
  const { isOpen } = useSidebar();
  return (
    <div
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      <div className={styles.menuContent}>
        <menu className={styles.menuList}>
          <li className={styles.menuItem}>Home</li>
        </menu>
      </div>
    </div>
  );
};

export default Sidebar;
