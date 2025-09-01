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
                                       cancelDrop,
                                       getItemStyles = () => ({}),
                                       strategy = verticalListSortingStrategy,
                                   }) {
    const [items, setItems] = useState(
        {
            A: [{id: 1, name: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt'},
              {id: 2, name: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam'}],
            B: [
              {id: 3, name: 'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat'},
              {id: 4, name: 'cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident'}
            ],
            C: [
              {id: 5, name: 'cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'},
              {id: 6, name: 'ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'}
            ],
        }
    );
    const [containers, setContainers] = useState(
        Object.keys(items)
    );
    console.log(items)
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

        return Object.keys(items).find((key) =>
            items[key].some((item) => item.id === id)
        );
    };

    const getIndex = (id) => {
        const container = findContainer(id);

        if (!container) {
            return -1;
        }

        return items[container].findIndex((item) => item.id === id);
    };

    const onDragCancel = () => {
        setActiveId(null);
    };

    const getItemById = (id) => {
        const container = findContainer(id);
        if (!container) return null;
        return items[container].find((it) => it.id === id) || null;
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
                const overIndex = overItems.findIndex((it) => it.id === overId);
                const activeIndex = activeItems.findIndex((it) => it.id === active.id);

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
                        (item) => item.id !== active.id
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
            const activeIndex = items[activeContainer].findIndex((it) => it.id === active.id);
            const overIndex = items[overContainer].findIndex((it) => it.id === overId);

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
                            <SortableContext items={items[containerId].map((it) => it.id)} strategy={strategy}>
                                {items[containerId].map((value, index) => {
                                    return (
                                        <SortableItem
                                            key={value.id}
                                            id={value.id}
                                            index={index}
                                            item={value}
                                            style={getItemStyles}
                                            getIndex={getIndex}
                                            selected={selectedId === value.id}
                                            onClick={() => handleItemClick(value.id)}
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
                        selectedId === activeId,
                        getItemById
                      )
                    : null}
            </DragOverlay>
        </DndContext>
    );
}
