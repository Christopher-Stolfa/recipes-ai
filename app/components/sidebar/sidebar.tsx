"use client";
import React, { useContext } from "react";
import styles from "./sidebar.module.scss";
import Link from "next/link";

const Sidebar: React.FC = () => {
  return (
    <div className={`${styles.sidebar}`}>
      <div className={styles.menuContent}>
        <menu className={styles.menuList}>
          <Link href="/">
            <li className={styles.menuItem}>Home</li>
          </Link>
          <Link href="/create">
            <li className={styles.menuItem}>Create Recipe</li>
          </Link>
          {/* {recipes?.map(({ id, path, title }) => (
            <Link key={id} href={path}>
              <li className={styles.menuItem}>{title}</li>
            </Link>
          ))} */}
        </menu>
      </div>
    </div>
  );
};

export default Sidebar;
