'use client'

import React, {useId, useRef, useState} from "react";
import {unstable_batchedUpdates} from "react-dom";
import {
    closestCorners,
    DndContext,
    DragOverlay,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {createRange} from "@/utilities";
import DroppableContainer from "@/components/DroppableContainer";
import SortableItem from "@/components/SortableItem";
import {renderContainerDragOverlay, renderSortableItemDragOverlay} from "@/components/OverlayItems";

export const TRASH_ID = "void";
const PLACEHOLDER_ID = "placeholder";

export function MultipleContainers({
                                       itemCount = 3,
                                       cancelDrop,
                                       enquirySets,
                                       items: initialItems,
                                       getItemStyles = () => ({}),
                                       wrapperStyle = () => ({}),
                                       renderItem,
                                       strategy = verticalListSortingStrategy,
                                   }) {
    const [items, setItems] = useState(
        () =>
            initialItems ?? {
                A: createRange(itemCount, (index) => `A${index + 1}`),
                B: createRange(itemCount, (index) => `B${index + 1}`),
                C: createRange(itemCount, (index) => `C${index + 1}`),
            }
    );
    const [containers, setContainers] = useState(
        Object.keys(items)
    );
    console.log(enquirySets)
    const [activeId, setActiveId] = useState(null);
    const recentlyMovedToNewContainer = useRef(false);
    const isSortingContainer = activeId ? containers.includes(activeId) : false;
    const id = useId()
    const [clonedItems, setClonedItems] = useState(null);
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    );
    const findContainer = (id) => {
        if (id in items) {
            return id;
        }

        return Object.keys(items).find((key) => items[key].includes(id));
    };

    const getIndex = (id) => {
        const container = findContainer(id);

        if (!container) {
            return -1;
        }

        return items[container].indexOf(id);
    };

    const onDragCancel = () => {
        if (clonedItems) {
            // Reset items to their original state in case items have been
            // Dragged across containers
            setItems(clonedItems);
        }

        setActiveId(null);
        setClonedItems(null);
    };

    function handleDragOver(event) {
        const {active, over} = event;
        const overId = over?.id;

        if (overId == null || overId === TRASH_ID || active.id in items) {
            return;
        }

        const overContainer = findContainer(overId);
        const activeContainer = findContainer(active.id);

        if (!overContainer || !activeContainer) {
            return;
        }

        if (activeContainer !== overContainer) {
            setItems((items) => {
                const activeItems = items[activeContainer];
                const overItems = items[overContainer];
                const overIndex = overItems.indexOf(overId);
                const activeIndex = activeItems.indexOf(active.id);

                let newIndex;

                if (overId in items) {
                    newIndex = overItems.length + 1;
                } else {
                    const isBelowOverItem =
                        over &&
                        active.rect.current.translated &&
                        active.rect.current.translated.top >
                        over.rect.top + over.rect.height;

                    const modifier = isBelowOverItem ? 1 : 0;

                    newIndex =
                        overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
                }

                recentlyMovedToNewContainer.current = true;

                return {
                    ...items,
                    [activeContainer]: items[activeContainer].filter(
                        (item) => item !== active.id
                    ),
                    [overContainer]: [
                        ...items[overContainer].slice(0, newIndex),
                        items[activeContainer][activeIndex],
                        ...items[overContainer].slice(
                            newIndex,
                            items[overContainer].length
                        ),
                    ],
                };
            });
        }
    }

    function handleDragStart(event) {
        const {active} = event;
        setActiveId(active.id);
        setClonedItems(items);
    }

    function handleDragEnd(event) {
        const {active, over} = event;
        if (active.id in items && over?.id) {
            setContainers((containers) => {
                const activeIndex = containers.indexOf(active.id);
                const overIndex = containers.indexOf(over.id);

                return arrayMove(containers, activeIndex, overIndex);
            });
        }

        const activeContainer = findContainer(active.id);

        if (!activeContainer) {
            setActiveId(null);
            return;
        }

        const overId = over?.id;

        if (overId == null) {
            setActiveId(null);
            return;
        }

        if (overId === TRASH_ID) {
            setItems((items) => ({
                ...items,
                [activeContainer]: items[activeContainer].filter(
                    (id) => id !== activeId
                ),
            }));
            setActiveId(null);
            return;
        }

        if (overId === PLACEHOLDER_ID) {
            const newContainerId = getNextContainerId();

            unstable_batchedUpdates(() => {
                setContainers((containers) => [...containers, newContainerId]);
                setItems((items) => ({
                    ...items,
                    [activeContainer]: items[activeContainer].filter(
                        (id) => id !== activeId
                    ),
                    [newContainerId]: [active.id],
                }));
                setActiveId(null);
            });
            return;
        }

        const overContainer = findContainer(overId);

        if (overContainer) {
            const activeIndex = items[activeContainer].indexOf(active.id);
            const overIndex = items[overContainer].indexOf(overId);

            if (activeIndex !== overIndex) {
                setItems((items) => ({
                    ...items,
                    [overContainer]: arrayMove(
                        items[overContainer],
                        activeIndex,
                        overIndex
                    ),
                }));
            }
        }

        setActiveId(null);
    }

    return (
        <DndContext
            id={id}
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            cancelDrop={cancelDrop}
            onDragCancel={onDragCancel}
        >
            <div
                style={{
                    display: "inline-grid",
                    boxSizing: "border-box",
                    padding: 20,
                    gridAutoFlow: "row",
                }}
            >
                <SortableContext
                    items={[...containers, PLACEHOLDER_ID]}
                    strategy={verticalListSortingStrategy}
                >
                    {containers.map((containerId) => (
                        <DroppableContainer
                            key={containerId}
                            id={containerId}
                            label={`Set ${containerId}`}
                            items={items[containerId]}
                        >
                            <SortableContext items={items[containerId]} strategy={strategy}>
                                {items[containerId].map((value, index) => {
                                    return (
                                        <SortableItem
                                            disabled={isSortingContainer}
                                            key={value}
                                            id={value}
                                            index={index}
                                            style={getItemStyles}
                                            wrapperStyle={wrapperStyle}
                                            getIndex={getIndex} containerId={""}
                                        />
                                    );
                                })}
                            </SortableContext>
                        </DroppableContainer>
                    ))}
                </SortableContext>
            </div>
            <DragOverlay>
                {activeId
                    ? containers.includes(activeId)
                        ? renderContainerDragOverlay(activeId, getItemStyles, findContainer, getIndex, wrapperStyle, renderItem)
                        : renderSortableItemDragOverlay(activeId, getItemStyles, findContainer, getIndex, wrapperStyle, renderItem)
                    : null}
            </DragOverlay>
        </DndContext>
    );

    function getNextContainerId() {
        const containerIds = Object.keys(items);
        const lastContainerId = containerIds[containerIds.length - 1];

        return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
    }
}
