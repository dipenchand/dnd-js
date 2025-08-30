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

export function renderContainerDragOverlay(containerId, columns, getItemStyles, wrapperStyle, renderItem) {
    return (<Container
        label={`Column ${containerId}`}
        columns={columns}
        style={{
            height: "100%",
        }}
        shadow
        unstyled={false}
    >
        {[...Array(5)].map((_, index) => (<Item
            key={index}
            value={`dummy-${index}`}
            handle={true}
            style={getItemStyles({
                containerId,
                overIndex: -1,
                index,
                value: `dummy-${index}`,
                isDragging: true,
                isSorting: true,
                isDragOverlay: true,
            })}
            color={getColor(`dummy-${index}`)}
            wrapperStyle={wrapperStyle({index})}
            renderItem={renderItem}
        />))}
    </Container>);
}