'use client'

import React, {useId, useRef, useState} from "react";
import {
    closestCorners,
    DndContext,
    DragOverlay,
    MouseSensor,
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
import {renderSortableItemDragOverlay} from "@/components/OverlayItems";

export function MultipleContainers({
                                       itemCount = 3,
                                       cancelDrop,
                                       enquirySets,
                                       items: initialItems,
                                       getItemStyles = () => ({}),
                                       strategy = verticalListSortingStrategy,
                                   }) {
    const [items, setItems] = useState(
        initialItems ?? {
            A: createRange(itemCount, (index) => `A${index + 1}`),
            B: createRange(itemCount, (index) => `B${index + 1}`),
            C: createRange(itemCount, (index) => `C${index + 1}`),
        }
    );
    const [containers, setContainers] = useState(
        Object.keys(items)
    );
    // console.log(enquirySets)
    const [selectedId, setSelectedId] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const recentlyMovedToNewContainer = useRef(false);
    const id = useId()
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    );

    const handleItemClick = (id) => {
        setSelectedId((prev) => (prev === id ? null : id));
    };
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
        setActiveId(null);
    };

    function handleDragOver(event) {
        const {active, over} = event;
        const overId = over?.id;

        if (overId == null || active.id in items) {
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

        const overContainer = findContainer(overId);

        if (overContainer && overId) {
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
            <div>
                <SortableContext
                    items={[...containers]}
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
                                            key={value}
                                            id={value}
                                            index={index}
                                            style={getItemStyles}
                                            getIndex={getIndex}
                                            selected={selectedId === value}
                                            onClick={() => handleItemClick(value)}
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
                    ? renderSortableItemDragOverlay(
                        activeId,
                        getItemStyles,
                        findContainer,
                        getIndex,
                        selectedId === activeId
                      )
                    : null}
            </DragOverlay>
        </DndContext>
    );
}
