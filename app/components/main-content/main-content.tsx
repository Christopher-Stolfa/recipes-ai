"use client";
import { FloatButton, Tooltip } from "antd";
import styles from "./main-content.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlusOutlined, HomeFilled, DownloadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const handleNavigate = (path: string) => router?.push(path);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <FloatButton.Group shape="circle" className={styles.floatButtons}>
          <Tooltip placement="right" title="Home">
            <FloatButton
              onClick={() => handleNavigate("/")}
              icon={<HomeFilled />}
            />
          </Tooltip>
          <Tooltip placement="right" title="Create new recipe">
            <FloatButton
              onClick={() => handleNavigate("/create")}
              icon={<PlusOutlined />}
            />
          </Tooltip>
          <Tooltip placement="right" title="Download recipe as a PDF">
            <FloatButton icon={<DownloadOutlined />} />
          </Tooltip>
        </FloatButton.Group>
        {children}
      </main>
    </div>
  );
};

export default MainContent;
