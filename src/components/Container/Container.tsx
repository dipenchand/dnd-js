import React, { forwardRef } from "react";
import classNames from "classnames";

import styles from "./Container.module.scss";

export interface Props {
  children: React.ReactNode;
  columns?: number;
  label?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  onClick?(): void;
  onRemove?(): void;
}

export const Container = forwardRef<HTMLDivElement | HTMLButtonElement, Props>(
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
    }: Props,
    ref
  ) => {
    const sharedProps = {
      ...props,
      style: {
        ...style,
        "--columns": columns
      } as React.CSSProperties,
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
      <div {...sharedProps} ref={ref as React.Ref<HTMLDivElement>}>
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
