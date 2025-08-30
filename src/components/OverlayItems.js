import {Item} from "@/components/Item";
import {getColor} from "@/utilities";

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
        color={getColor(id)}
        selected={selected}
        dragOverlay
    />);
}
