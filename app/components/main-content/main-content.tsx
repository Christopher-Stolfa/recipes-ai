"use client";
import Sidebar from "../sidebar/sidebar";
import styles from "./main-content.module.scss";

const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.container}>
    <Sidebar />
    <main className={styles.main}>{children}</main>
  </div>
);

export default MainContent;
