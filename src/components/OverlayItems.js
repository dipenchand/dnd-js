import {Item} from "@/components/Item";
import {getColor} from "@/utilities";
import {Container} from "@/components/Container";

import React from "react";

export function renderSortableItemDragOverlay(
    id, getItemStyles, findContainer, getIndex, wrapperStyle, renderItem) {
    return (<Item
        value={id}
        handle={true}
        style={getItemStyles({
            containerId: findContainer(id),
            overIndex: -1,
            index: getIndex(id),
            value: id,
            isSorting: true,
            isDragging: true,
            isDragOverlay: true,
        })}
        color={getColor(id)}
        wrapperStyle={wrapperStyle({index: getIndex(id)})}
        renderItem={renderItem}
        dragOverlay
    />);
}
