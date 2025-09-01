'use client'

import {MultipleContainers} from "@/app/MultipleContainers";
import { rectSortingStrategy } from "@dnd-kit/sortable";

export default function Home() {
    // const enquirySets = [
    //     {id: 1, name: "Set X", enquiries: [
    //             {id: 1, enquiry: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt'},
    //             {id: 2, enquiry: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam'}
    //         ]
    //     },
    //     {id: 2, name: "Set Y", enquiries: [
    //             {id: 3, enquiry: 'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat'},
    //             {id: 4, enquiry: 'cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident'}
    //         ]
    //     },
    //     {id: 3, name: "Set Z", enquiries: [
    //             {id: 5, enquiry: 'cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'},
    //             {id: 6, enquiry: 'ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'}
    //         ]
    //     },
    // ]
    const enquiries = [
                {id: 1, containerId: 1, enquiry: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt'},
                {id: 2, containerId: 1, enquiry: 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam'},
                {id: 3, containerId: 1, enquiry: 'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat'},
                {id: 4, containerId: 2, enquiry: 'cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident'},
                {id: 5, containerId: 3, enquiry: 'cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'},
                {id: 6, containerId: 3, enquiry: 'ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'}
    ]

    const containers = [
        {id: 1, name: 'Set X'},
        {id: 2, name: 'Set Y'},
        {id: 3, name: 'Set Z'}
    ]
    return (
        <div className="p-2">
            <MultipleContainers
                strategy={rectSortingStrategy}
                sets={containers}
                enquiries={enquiries}
            />
        </div>
    );
}
