export default [
    {
        type: "project",
        name: "Project 1",
        client: "Client 1",
        program: "Program 1",
        children: [
            {
                type: "Task", name: "Task A1",
                children: [
                    { type: "User", name: "User 1" }, // No render means default display
                    {
                        type: "User",
                        name: "User 2",
                        render: {
                            name: renderUserName("User 2"),
                            client: renderClientName("Client A")
                        },
                        client: "Client A"
                    }]
            },
            { type: "Task", name: "Task A2" }

        ]
    },
    {
        type: "Program",
        name: "Program B",
        children: [
            {
                type: "Project",
                name: "Project B1",
                client: "Client B",
                children: [
                    { type: "Task", name: "Task B1" },
                    { type: "Task", name: "Task B2" }
                ]
            },
            {
                type: "Project",
                name: "Project B2",
                children: [
                    { type: "Task", name: "Task B3" },
                    { type: "Task", name: "Task B4" }
                ]
            }
        ]
    }

];

function renderUserName(userName) {
    return `<span class="user-icon">👤</span>${userName}`;
}
function renderClientName(clientName) {
    return `<span class="client-icon">🏢</span>${clientName}`;
}
