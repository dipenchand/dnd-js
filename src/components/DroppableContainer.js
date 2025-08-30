import {defaultAnimateLayoutChanges, useSortable} from "@dnd-kit/sortable";
import {Container} from "@/components/Container";
import {CSS} from "@dnd-kit/utilities";
import React from "react";

const animateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({...args, wasDragging: true});

export default function DroppableContainer({
                                children,
                                columns = 1,
                                disabled,
                                id,
                                items,
                                style,
                                ...props
                            }) {
    const {
        active,
        attributes,
        isDragging,
        listeners,
        over,
        setNodeRef,
        transition,
        transform,
    } = useSortable({
        id,
        data: {
            type: "container",
            children: items,
        },
        animateLayoutChanges,
    });
    const isOverContainer = over
        ? (id === over.id && active?.data.current?.type !== "container") ||
        items.some((item) => item.id === over.id)
        : false;

    return (
        <Container
            ref={disabled ? undefined : setNodeRef}
            style={{
                ...style,
                transition,
                transform: CSS.Translate.toString(transform),
                opacity: isDragging ? 0.5 : undefined,
            }}
            hover={isOverContainer}
            handleProps={{
                ...attributes,
                ...listeners,
            }}
            columns={columns}
            {...props}
        >
            {children}
        </Container>
    );
}