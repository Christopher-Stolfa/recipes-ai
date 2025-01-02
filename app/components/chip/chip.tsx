import React from "react";
import styles from "./chip.module.scss";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IChipProps {
  isChecked: boolean;
  onClick: () => void;
  icon?: IconDefinition;
}

const Chip: React.FC<React.PropsWithChildren<IChipProps>> = ({
  onClick,
  isChecked,
  icon,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={isChecked ? styles["checked"] : styles["unchecked"]}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </button>
  );
};

export default Chip;
