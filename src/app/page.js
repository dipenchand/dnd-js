'use client'

import {MultipleContainers} from "@/app/MultipleContainers";
import { rectSortingStrategy } from "@dnd-kit/sortable";

export default function Home() {
    const enquirySets = [
        {id: 1, name: "Set X", enquiries: [
                {id: 1, enquiry: 'Enquiry A'},
                {id: 2, enquiry: 'Enquiry B'}
            ]
        },
        {id: 2, name: "Set Y", enquiries: [
                {id: 3, enquiry: 'Enquiry C'},
                {id: 4, enquiry: 'Enquiry D'}
            ]
        },
        {id: 3, name: "Set Z", enquiries: [
                {id: 5, enquiry: 'Enquiry E'},
                {id: 6, enquiry: 'Enquiry F'}
            ]
        },
    ]
    return (
        <div className="p-2">
            <MultipleContainers
                itemCount={5}
                strategy={rectSortingStrategy}
                vertical
                enquirySets={enquirySets}
            />
        </div>
    );
}
