import {Item} from "@/components/Item";

import React from "react";

export function renderSortableItemDragOverlay(
    id,
    getItemStyles,
    findContainer,
    getIndex,
    selected,
    getItemById
) {
    const item = typeof getItemById === "function" ? getItemById(id) : null;
    return (
        <Item
            value={item ? item.name : id}
            handle={true}
            style={getItemStyles({
                containerId: findContainer(id),
                index: getIndex(id),
            })}
            selected={selected}
            dragOverlay
        />
    );
}
