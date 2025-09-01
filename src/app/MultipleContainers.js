"use client";

import React, { useId, useRef, useState } from "react";
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

import { createRange } from "@/utilities";
import DroppableContainer from "@/components/DroppableContainer";
import SortableItem from "@/components/SortableItem";
import { renderSortableItemDragOverlay } from "@/components/OverlayItems";

export function MultipleContainers({
  cancelDrop,
  enquiries,
  sets,
  getItemStyles = () => ({}),
  strategy = verticalListSortingStrategy,
}) {
  const [items, setItems] = useState(enquiries);
  const [containers, setContainers] = useState(sets);
  const [selectedId, setSelectedId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const recentlyMovedToNewContainer = useRef(false);
  const id = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  // console.log(items)

  const handleItemClick = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };
  const findContainer = (enquiryId) => {
    const item = items.find((item) => item.id === enquiryId);
    const container = containers.find(
      (container) => container.id === item.containerId
    );
    // console.log(container)
    return container;
  };

  const getIndex = (enquiryId) => {
    const container = findContainer(enquiryId);

    if (!container) {
      return -1;
    }

    return containers.indexOf(container);
  };

  const onDragCancel = () => {
    setActiveId(null);
  };

  const getItemById = (enquiryId) => {
    // const container = findContainer(enquiryId);
    // if (!container) return null;
    return items.find((item) => item.id === enquiryId) || null;
  };

  function handleDragOver(event) {
    const { active, over } = event;
    const overId = over?.id;

    if (overId == null || !items.some((item) => item.id === active.id)) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (!overContainer || !activeContainer) {
      return;
    }

    if (activeContainer.id !== overContainer.id) {
      // setItems((prev) => {
      //     const activeItem = prev.find((it) => it.id === active.id);
      //     if (!activeItem) return prev;

      //     // Remove active from its current position
      //     const withoutActive = prev.filter((it) => it.id !== active.id);

      //     // Determine insertion index within over container
      //     const overItems = withoutActive.filter((it) => it.containerId === overContainer.id);
      //     const overIndex = overItems.findIndex((it) => it.id === overId);

      //     const isBelowOverItem =
      //         over &&
      //         active.rect.current?.translated &&
      //         active.rect.current.translated.top >
      //         over.rect.top + over.rect.height;

      //     const modifier = isBelowOverItem ? 1 : 0;
      //     const insertAt = overIndex >= 0 ? overIndex + modifier : overItems.length;

      //     const updatedActive = { ...activeItem, containerId: overContainer.id };
      //     console.log('updatedActive', updatedActive);

      //     const notOverContainer = withoutActive.filter((it) => it.containerId !== overContainer.id);
      //     const targetList = overItems.slice();
      //     targetList.splice(insertAt, 0, updatedActive);

      //     recentlyMovedToNewContainer.current = true;
      //     return [...notOverContainer, ...targetList];
      // });
      setItems((items) => {
        const activeItems = items.filter(
          (it) => it.containerId === activeContainer.id
        );
        const overItems = items.filter(
          (it) => it.containerId === overContainer.id
        );

        const overIndex = overItems.findIndex((it) => it.id === overId);
        const activeIndex = activeItems.findIndex((it) => it.id === active.id);

        let newIndex;

        if (items.some((it) => it.id === overId)) {
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
        // const moveItemResult = moveItem(
        //   items,
        //   activeContainer,
        //   overContainer,
        //   active,
        //   activeIndex,
        //   newIndex
        // );
        // return moveItemResult;

        // return {
        //     ...items,
        // [activeContainer.id]: items[activeContainer].filter(
        //     (item) => item.id !== active.id
        // ),
        // [overContainer.id]: [
        //     ...items[overContainer].slice(0, newIndex),
        //     items[activeContainer][activeIndex],
        //     ...items[overContainer].slice(
        //         newIndex,
        //         items[overContainer].length
        //     ),
        // ],
        // };
        return [
          ...items.filter(
            (item) =>
              !(
                item.containerId === activeContainer.id && item.id === active.id
              )
          ),
          ...items
            .filter((item) => item.containerId === overContainer.id)
            .slice(0, newIndex),
          { ...active, containerId: overContainer.id },
          ...items
            .filter((item) => item.containerId === overContainer.id)
            .slice(newIndex),
        ];
      });
    }
  }


  function handleDragStart(event) {
    const { active } = event;
    setActiveId(active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeItem = items.find((it) => it.id === active.id);
    if (!activeItem) {
      setActiveId(null);
      return;
    }

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);
    console.log('overContainer', overContainer);
    console.log('activeContainer', activeContainer);
    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }

    // Reorder within the same container or move across containers
    setItems((prev) => {
      const withoutActive = prev.filter((it) => it.id !== active.id);

      // Determine target container list and target index
      const targetId = over.id;
      const targetIsItem = prev.some((it) => it.id === targetId);
      const targetContainerId = overContainer.id;

      const targetList = withoutActive.filter(
        (it) => it.containerId === targetContainerId
      );
      const overIndex = targetIsItem
        ? targetList.findIndex((it) => it.id === targetId)
        : targetList.length; // drop at end if over a container

      // If staying in same container, we want the active's index within that list
      const sameContainer = activeContainer.id === targetContainerId;
      const fromList = sameContainer
        ? prev.filter((it) => it.containerId === targetContainerId)
        : [];
      const activeIndexInFrom = sameContainer
        ? fromList.findIndex((it) => it.id === active.id)
        : -1;

      if (sameContainer) {
        // Reorder within container
        const reordered = arrayMove(fromList, activeIndexInFrom, overIndex);
        const others = withoutActive.filter(
          (it) => it.containerId !== targetContainerId
        );
        return [...others, ...reordered];
      }

      // Moving across containers
      const updatedActive = { ...activeItem, containerId: targetContainerId };
      const before = withoutActive.filter(
        (it) => it.containerId !== targetContainerId
      );
      const target = targetList.slice();
      target.splice(overIndex, 0, updatedActive);
      return [...before, ...target];
    });

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
          items={containers.map((it) => it.id)}
          strategy={verticalListSortingStrategy}
        >
          {containers.map((container) => (
            <DroppableContainer
              key={container.id}
              id={container.id}
              label={container.name}
              items={items.filter((item) => item.containerId === container.id)}
            >
              <SortableContext
                items={items
                  .filter((item) => item.containerId === container.id)
                  .map((item) => item.id)}
                strategy={strategy}
              >
                {items
                  .filter((item) => item.containerId === container.id)
                  .map((item, index) => {
                    return (
                      <SortableItem
                        key={item.id}
                        id={item.id}
                        index={index}
                        item={item}
                        style={getItemStyles}
                        getIndex={getIndex}
                        selected={selectedId === item.id}
                        onClick={() => handleItemClick(item.id)}
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
