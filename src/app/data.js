export const initialColumns = {
    open: [
        {
            id: 1,
            title: "Email follow-up with Charlotte Haynes",
            users: ["https://i.pravatar.cc/32?img=1"],
            tags: ["green"],
        },
        {
            id: 2,
            title: "Team meeting",
            users: ["https://i.pravatar.cc/32?img=2", "https://i.pravatar.cc/32?img=3"],
            tags: ["blue"],
        },
    ],
    inProgress: [
        {
            id: 3,
            title: "Send the pricing quote",
            users: ["https://i.pravatar.cc/32?img=4"],
            tags: ["blue"],
        },
    ],
    toDo: [
        {
            id: 4,
            title: "Call follow-up with Ola Lowe and Florence Simmons",
            users: ["https://i.pravatar.cc/32?img=5", "https://i.pravatar.cc/32?img=6"],
            tags: ["green"],
        },
        { id: 5, title: "Send the pricing quote", users: ["https://i.pravatar.cc/32?img=2"], tags: ["blue"] },
        {
            id: 6,
            title: "Quarterly Sales Meeting",
            users: ["https://i.pravatar.cc/32?img=5", "https://i.pravatar.cc/32?img=6"],
            tags: ["green"],
        },
    ],
    completed: [
        { id: 7, title: "Send the proposal document", users: ["https://i.pravatar.cc/32?img=1"], tags: ["blue"] },
        { id: 8, title: "Quarterly Sales Meeting", users: ["https://i.pravatar.cc/32?img=3"], tags: ["red"] },
    ],
};

export const columnNames = {
    open: "Open",
    inProgress: "In Progress",
    toDo: "To Do",
    completed: "Completed",
};
