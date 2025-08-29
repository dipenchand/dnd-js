import React, { forwardRef } from "react";

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
      "Container",
      unstyled ? "unstyled" : "",
      horizontal ? "horizontal" : "",
      hover ? "hover" : "",
      placeholder ? "placeholder" : "",
      scrollable ? "scrollable" : "",
      shadow ? "shadow" : ""
    ]
      .filter(Boolean)
      .join(" ");

    const sharedProps = {
      ...props,
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
            {label}
          </div>
        ) : null}
        {placeholder ? children : <ul>{children}</ul>}
      </div>
    );
  }
);
