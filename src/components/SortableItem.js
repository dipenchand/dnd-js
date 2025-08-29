import {Item} from "@/components/Item";
import {useSortable} from "@dnd-kit/sortable";
import {useEffect, useState} from "react";
import {getColor} from "@/utilities";

export default function SortableItem({
                          disabled,
                          id,
                          index,
                          renderItem,
                          style,
                          containerId,
                          getIndex,
                          wrapperStyle,
                      }) {
    const {
        setNodeRef,
        listeners,
        isDragging,
        isSorting,
        over,
        overIndex,
        transform,
        transition,
    } = useSortable({
        id,
    });
    const mounted = useMountStatus();
    const mountedWhileDragging = isDragging && !mounted;

    return (
        <Item
            ref={disabled ? undefined : setNodeRef}
            value={id}
            dragging={isDragging}
            sorting={isSorting}
            index={index}
            wrapperStyle={wrapperStyle({index})}
            style={style({
                index,
                value: id,
                isDragging,
                isSorting,
                overIndex: over ? getIndex(over.id) : overIndex,
                containerId,
            })}
            color={getColor(id)}
            transition={transition}
            transform={transform}
            fadeIn={mountedWhileDragging}
            listeners={listeners}
            renderItem={renderItem}
        />
    );
}

function useMountStatus() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsMounted(true), 500);

        return () => clearTimeout(timeout);
    }, []);

    return isMounted;
}
