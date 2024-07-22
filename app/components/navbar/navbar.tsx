"use client";
import React from "react";
import { useSidebar } from "@/app/hooks/use-sidebar";
import styles from "./Navbar.module.scss";

const Navbar: React.FC = () => {
  const { toggle } = useSidebar();

  return (
    <div className={styles.navbar}>
      <button className={styles.menuButton} onClick={toggle}>
        ☰
      </button>
      <div className={styles.title}>Culinary AI</div>
    </div>
  );
};

export default Navbar;
