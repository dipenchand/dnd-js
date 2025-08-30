import {Item} from "@/components/Item";
import {useSortable} from "@dnd-kit/sortable";
import {getColor} from "@/utilities";

export default function SortableItem({
                          disabled,
                          id,
                          index,
                          renderItem,
                          style,
                          getIndex,
                          wrapperStyle,
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
            ref={disabled ? undefined : setNodeRef}
            value={id}
            dragging={isDragging}
            sorting={isSorting}
            index={index}
            wrapperStyle={wrapperStyle({index})}
            style={style({
                index,
                value: id,
                isDragging,
                isSorting,
                overIndex: over ? getIndex(over.id) : overIndex,
            })}
            color={getColor(id)}
            transition={transition}
            transform={transform}
            listeners={listeners}
            renderItem={renderItem}
        />
    );
}
