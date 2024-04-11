export default {
    groups: [
        {
            id: 1, name: "Total",
            columns: [
                { id: "estimated", name: "Estimated" },
                { id: "actual", name: "Actual" }]
        }
    ],
    rows: [
        {
            type: "user", name: "User name 1",
            render: renderUserName("User name 1"),
            values: [
                {
                    groupId: 1,
                    values: [
                        { columnId: "estimated", value: 44010, render: renderDuration(44010) },
                        { columnId: "actual", value: 39105, render: renderDuration(39105) }
                    ]
                }
            ],
            children: [
                { 
                    type: "Project", name: "Project name 1",
                    render: renderProjectName("Project name 1"),
                    values: [
                        {
                            groupId: 1,
                            values: [

                                { columnId: "estimated", value: 12300, render: renderDuration(12300) },
                                { columnId: "actual", value: 12195, render: renderDuration(12195) }
                            ]
                        }
                    ],
                    children: [
                        {
                            type: "Task", name: "Task name 1",
                            values: [
                                {
                                    groupId: 1,
                                    values: [

                                        { columnId: "estimated", value: 8400, render: renderDuration(8400) },
                                        { columnId: "actual", value: 9645, render: renderDuration(9645) }
                                    ]
                                }
                            ],

                        },
                        {
                            type: "Task", name: "Task name 2",
                            values: [
                                {
                                    groupId: 1,
                                    values: [

                                        { columnId: "estimated", value: 3900, render: renderDuration(3900) },
                                        { columnId: "actual", value: 2550, render: renderDuration(2550) }
                                    ]
                                }
                            ],

                        }
                    ]
                }



            ]
        },
        {
            type: "user", name: "User name 2",
            render: renderUserName("User name 2"),
            values: [
                {
                    groupId: 1,
                    values: [
                        { columnId: "estimated", value: 13710, render: renderDuration(13710) },
                        { columnId: "actual", value: 20910, render: renderDuration(20910) }
                    ]
                }
            ],
            children: [{
                type: "Project", name: "Project name 1",
                render: renderProjectName("Project name 1"),
                values: [
                    {
                        groupId: 1,
                        values: [

                            { columnId: "estimated", value: 5910, render: renderDuration(5910) },
                            { columnId: "actual", value: 5310, render: renderDuration(5310) }
                        ]
                    }
                ],
                children: [
                    {
                        type: "Task", name: "Task name 1",
                        values: [
                            {
                                groupId: 1,
                                values: [{ columnId: "estimated", value: 5910, render: renderDuration(5910) },
                                { columnId: "actual", value: 5310, render: renderDuration(5310) }
                                ]
                            }
                        ],

                    }

                ]
            },
            {
                type: "Project", name: "Project name 2",
                render: renderProjectName("Project name 2"),
                values: [
                    {
                        groupId: 1,
                        values: [

                            { columnId: "estimated", value: 7800, render: renderDuration(7800) },
                            { columnId: "actual", value: 15600, render: renderDuration(15600) }
                        ]
                    }
                ],
                children: [
                    {
                        type: "Task", name: "Task name 3",
                        values: [
                            {
                                groupId: 1,
                                values: [
                                    { columnId: "estimated", value: 7800, render: renderDuration(7800) },
                                    { columnId: "actual", value: 15600, render: renderDuration(15600) }
                                ]
                            }
                        ],
                    }

                ]
            }
            ]
        },
        {
            type: "user", name: "User name 3",
            render: renderUserName("User name 3"),
            values: [
                {
                    groupId: 1,
                    values: [
                        { columnId: "estimated", value: 18000, render: renderDuration(18000) },
                        { columnId: "actual", value: 6000, render: renderDuration(6000) }
                    ]
                }
            ],
            children: [
                {
                    type: "Project", name: "Project name 2",
                    render: renderProjectName("Project name 2"),
                    values: [
                        {
                            groupId: 1,
                            values: [

                                { columnId: "estimated", value: 18000, render: renderDuration(18000) },
                                { columnId: "actual", value: 6000, render: renderDuration(6000) }
                            ]
                        }
                    ],
                    children: [
                        {
                            type: "Task", name: "Task name 3",
                            values: [
                                {
                                    groupId: 1,
                                    values: [

                                        { columnId: "estimated", value: 18000, render: renderDuration(18000) },
                                        { columnId: "actual", value: 6000, render: renderDuration(6000) }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

function renderUserName(userName) {
    return `<span class="user-icon">👤</span>${userName}`;
}
function renderProjectName(projectName) {
    return `<span class="project-icon">📁</span>${projectName}`;
}
function renderDuration(duration) {
    return `${duration / 60} h.`;
};
