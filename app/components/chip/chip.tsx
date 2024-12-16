import React from "react";
import styles from "./chip.module.scss";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IChipProps {
  isChecked: boolean;
  icon?: IconDefinition;
}

const Chip: React.FC<React.PropsWithChildren<IChipProps>> = ({
  isChecked,
  icon,
  children,
}) => {
  return (
    <div className={styles["root"]}>
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </div>
  );
};

export default Chip;
