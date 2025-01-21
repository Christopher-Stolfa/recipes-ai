import React from "react";
import styles from "./recipe-drawer.module.scss";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Drawer, theme } from "antd";

interface IRecipeDrawerProps {
  isChecked: boolean;
  onClick: () => void;
  icon?: IconDefinition;
  label: string;
}

const RecipeDrawer: React.FC<React.PropsWithChildren<IRecipeDrawerProps>> = ({
  onClick,
  isChecked,
  icon,
  label,
  children,
}) => {
  const { token } = theme?.useToken();
  const containerStyle: React.CSSProperties = {
    backgroundColor: token?.colorFillAlter,
    border: `1px solid ${token?.colorBorderSecondary}`,
    borderRadius: token?.borderRadiusLG,
  };
  return (
    <div style={containerStyle} className={styles["root"]}>
      <div className={styles["button-container"]}>
        <button
          onClick={onClick}
          className={isChecked ? styles["checked"] : styles["unchecked"]}
        >
          {icon && <FontAwesomeIcon size="2x" icon={icon} />} {label}
        </button>
      </div>
      <Drawer
        width="75%"
        placement="right"
        closable={false}
        onClose={onClick}
        open={isChecked}
        getContainer={false}
      >
        {children}
      </Drawer>
    </div>
  );
};

export default RecipeDrawer;
