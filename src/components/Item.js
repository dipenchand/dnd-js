'use client'

import React, { useEffect } from "react";

export const Item = React.memo(
  React.forwardRef(
    (
      {
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        handleProps,
        height,
        index,
        listeners,
        sorting,
        style,
        transition,
        transform,
        value,
        selected,
        ...props
      },
      ref
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = "grabbing";

        return () => {
          document.body.style.cursor = "";
        };
      }, [dragOverlay]);

      const wrapperClasses = [
        "Wrapper",
        fadeIn ? "fadeIn" : "",
        sorting ? "sorting" : "",
        dragOverlay ? "dragOverlay" : ""
      ]
        .filter(Boolean)
        .join(" ");

      const itemClasses = [
        "Item",
        dragging ? "dragging" : "",
        dragOverlay ? "dragOverlay" : "",
        color ? "color" : "",
        selected ? "selected" : ""
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <li
          className={`${wrapperClasses}`}
          style={
            {
              transition: [transition]
                .filter(Boolean)
                .join(", "),
              "--translate-y": transform?.y
                ? `${Math.round(transform.y)}px`
                : "0",
              "--color": color
            }
          }
          ref={ref}
        >
          <div
            className={itemClasses}
            style={style}
            {...listeners}
            {...props}
            tabIndex={0}
          >
            {value}
          </div>
        </li>
      );
    }
  )
);
