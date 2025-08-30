import {Item} from "@/components/Item";
import {useSortable} from "@dnd-kit/sortable";

export default function SortableItem({
                          id,
                          index,
                          style,
                          getIndex,
                          item,
                          selected,
                          onClick,
                      }) {
    const {
        setNodeRef,
        listeners,
        isDragging,
        isSorting,
        over,
        overIndex,
        transform,
        transition,
    } = useSortable({
        id,
    });

    return (
        <Item
            ref={setNodeRef}
            value={item.name}
            dragging={isDragging}
            sorting={isSorting}
            index={index}
            style={style({
                index,
                value: item.name,
                isDragging,
                isSorting,
                overIndex: over ? getIndex(over.id) : overIndex,
            })}
            transition={transition}
            transform={transform}
            listeners={listeners}
            selected={selected}
            onClick={onClick}
        />
    );
}
