import {Item} from "@/components/Item";
import {getColor} from "@/utilities";
import {Container} from "@/components/Container";

import React from "react";

export function renderSortableItemDragOverlay(
    id, handle, getItemStyles, findContainer, getIndex, wrapperStyle, renderItem) {
    return (<Item
        value={id}
        handle={handle}
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
        wrapperStyle={wrapperStyle({index: 0})}
        renderItem={renderItem}
        dragOverlay
    />);
}

export function renderContainerDragOverlay(containerId) {
    return (<Container
        label={`Column ${containerId}`}
        columns={columns}
        style={{
            height: "100%",
        }}
        shadow
        unstyled={false}
    >
        {items[containerId].map((item, index) => (<Item
            key={item}
            value={item}
            handle={handle}
            style={getItemStyles({
                containerId,
                overIndex: -1,
                index: getIndex(item),
                value: item,
                isDragging: false,
                isSorting: false,
                isDragOverlay: false,
            })}
            color={getColor(item)}
            wrapperStyle={wrapperStyle({index})}
            renderItem={renderItem}
        />))}
    </Container>);
}