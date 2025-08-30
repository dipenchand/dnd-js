import React, { forwardRef } from "react";

export const Container = forwardRef(
  (
    {
      children,
      columns = 1,
      hover,
      label,
      style,
      scrollable,
      shadow,
      unstyled,
      ...props
    },
    ref
  ) => {
    // Exclude non-DOM props to avoid React warnings
    const { handleProps: _handleProps, ...restProps } = props;

    const classes = [
      "Container",
      unstyled ? "unstyled" : "",
      hover ? "hover" : "",
      scrollable ? "scrollable" : "",
      shadow ? "shadow" : ""
    ]
      .filter(Boolean)
      .join(" ");

    const sharedProps = {
      ...restProps,
      style: {
        ...style,
        "--columns": columns
      },
      className: classes
    };

    return (
      <div {...sharedProps} ref={ref}>
        {label ? (
          <div className={"Header"}>
            Set: {label}
          </div>
        ) : null}
        <ul>{children}</ul>
      </div>
    );
  }
);
