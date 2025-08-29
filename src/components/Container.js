import React, { forwardRef } from "react";
import classNames from "classnames";

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
    const sharedProps = {
      ...props,
      style: {
        ...style,
        "--columns": columns
      },
      className: classNames(
        styles.Container,
        unstyled && styles.unstyled,
        horizontal && styles.horizontal,
        hover && styles.hover,
        placeholder && styles.placeholder,
        scrollable && styles.scrollable,
        shadow && styles.shadow
      )
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
