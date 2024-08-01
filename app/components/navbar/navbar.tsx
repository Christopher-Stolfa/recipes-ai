"use client";
import React from "react";
import { useSidebar } from "@/app/hooks/use-sidebar";
import styles from "./navbar.module.scss";
import Link from "next/link";

const Navbar: React.FC = () => {
  const { toggle } = useSidebar();

  return (
    <div className={styles.navbar}>
      <button className={styles.menuButton} onClick={toggle}>
        ☰
      </button>
      <Link className={styles.title} href="/">
        Culinary AI
      </Link>
    </div>
  );
};

export default Navbar;
