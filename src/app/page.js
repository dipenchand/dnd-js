'use client'

import {MultipleContainers} from "@/app/MultipleContainers";
import { rectSortingStrategy } from "@dnd-kit/sortable";

export default function Home() {
    return (
        <div className="p-2 mx-auto w-100">
            <MultipleContainers
                itemCount={5}
                strategy={rectSortingStrategy}
                vertical
            />
        </div>
    );
}
