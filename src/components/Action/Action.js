import React, { forwardRef } from "react";

import styles from "./Action.module.scss";

export const Action = forwardRef(
  ({ active, className, cursor, style, ...props }, ref) => {
    const combinedClassName = [styles.Action, className]
      .filter(Boolean)
      .join(" ");
    return (
      <button
        ref={ref}
        {...props}
        className={combinedClassName}
        tabIndex={0}
        style={
          {
            ...style,
            cursor,
            "--fill": active?.fill,
            "--background": active?.background
          }
        }
      />
    );
  }
);
