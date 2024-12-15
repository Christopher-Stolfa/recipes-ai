"use client";
import React from "react";
import styles from "./navbar.module.scss";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <div className={styles.navbar}>
      <Link className={styles.title} href="/">
        Culinary AI
      </Link>
    </div>
  );
};

export default Navbar;
