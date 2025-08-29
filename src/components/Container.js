import React, { forwardRef } from "react";

import styles from "./Container.module.scss";

export const Container = forwardRef(
  (
    {
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      label,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      ...props
    },
    ref
  ) => {
    const classes = [
      styles.Container,
      unstyled ? styles.unstyled : "",
      horizontal ? styles.horizontal : "",
      hover ? styles.hover : "",
      placeholder ? styles.placeholder : "",
      scrollable ? styles.scrollable : "",
      shadow ? styles.shadow : ""
    ]
      .filter(Boolean)
      .join(" ");

    const sharedProps = {
      ...props,
      style: {
        ...style,
        columns
      },
      className: classes
    };

    return (
      <div {...sharedProps} ref={ref}>
        {label ? (
          <div className={styles.Header}>
            {label}
          </div>
        ) : null}
        {placeholder ? children : <ul>{children}</ul>}
      </div>
    );
  }
);
