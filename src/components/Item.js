'use client'

import React, { useEffect } from "react";

import styles from "./Item.module.scss";

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
        renderItem,
        sorting,
        style,
        transition,
        transform,
        value,
        wrapperStyle,
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
        styles.Wrapper,
        fadeIn ? styles.fadeIn : "",
        sorting ? styles.sorting : "",
        dragOverlay ? styles.dragOverlay : ""
      ]
        .filter(Boolean)
        .join(" ");

      const itemClasses = [
        styles.Item,
        dragging ? styles.dragging : "",
        dragOverlay ? styles.dragOverlay : "",
        disabled ? styles.disabled : "",
        color ? styles.color : ""
      ]
        .filter(Boolean)
        .join(" ");

      return renderItem ? (
        renderItem({
          dragOverlay: Boolean(dragOverlay),
          dragging: Boolean(dragging),
          sorting: Boolean(sorting),
          index,
          fadeIn: Boolean(fadeIn),
          listeners,
          ref,
          style,
          transform,
          transition,
          value
        })
      ) : (
        <li
          className={wrapperClasses}
          style={
            {
              ...wrapperStyle,
              transition: [transition, wrapperStyle?.transition]
                .filter(Boolean)
                .join(", "),
              "--translate-x": transform
                ? `${Math.round(transform.x)}px`
                : undefined,
              "--translate-y": transform
                ? `${Math.round(transform.y)}px`
                : undefined,
              "--scale-x": transform?.scaleX
                ? `${transform.scaleX}`
                : undefined,
              "--scale-y": transform?.scaleY
                ? `${transform.scaleY}`
                : undefined,
              "--index": index,
              "--color": color
            }
          }
          ref={ref}
        >
          <div
            className={itemClasses}
            style={style}
            {...(!handle ? listeners : undefined)}
            {...props}
            tabIndex={!handle ? 0 : undefined}
          >
            {value}
          </div>
        </li>
      );
    }
  )
);
