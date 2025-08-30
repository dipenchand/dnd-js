import {Item} from "@/components/Item";

import React from "react";

export function renderSortableItemDragOverlay(
    id, getItemStyles, findContainer, getIndex, selected) {
    return (<Item
        value={id}
        handle={true}
        style={getItemStyles({
            containerId: findContainer(id),
            index: getIndex(id),
        })}
        selected={selected}
        dragOverlay
    />);
}
