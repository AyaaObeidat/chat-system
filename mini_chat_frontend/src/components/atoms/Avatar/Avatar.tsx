// src/components/atoms/Avatar/Avatar.tsx

import React from "react";
import styles from "./Avatar.module.css";

interface AvatarProps {
  backgroundColor?: string;
  className?: string;
  initial?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  initial = " ",
  backgroundColor = "var(--quiqflow-color-primary)",
  className ,
}) => {
  return (
    <div className={`${styles.avatar} ${className}`} style={{ backgroundColor }}>
      {initial.toUpperCase()}
    </div>
  );
};

export default Avatar;
