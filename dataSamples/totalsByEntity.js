export default {
    groups: [
        {
            id: 1, name: "01-01-2024",
            columns: [
                { id: "estimated", name: "Estimated" },
                { id: "actual", name: "Actual" }]
        },
        {
            id: 2, name: "08-02-2024",
            columns: [
                { id: "estimated", name: "Estimated" },
                { id: "actual", name: "Actual" }]
        },
        {
            id: 3, name: "Sum of Periods",
            columns: [
                { id: "estimated", name: "Estimated" },
                { id: "actual", name: "Actual" }]
        }
    ],
    rows: [
        {
            type: "project",
            name: "Project 1",
            render: renderProjectName("Project 1"),
            values: [
                {
                    groupId: 1,
                    values: [
                        { columnId: "estimated", value: 2520, render: renderDuration(2520) },
                        { columnId: "actual", value: 2040, render: renderDuration(2040) }
                    ]
                },
                {
                    groupId: 2,
                    values: [
                        { columnId: "estimated", value: 2520, render: renderDuration(2520) },
                        { columnId: "actual", value: 2040, render: renderDuration(2040) }]
                },
                {
                    groupId: 3,
                    values: [
                        { columnId: "estimated", value: 5040, render: renderDuration(5040) },
                        { columnId: "actual", value: 4080, render: renderDuration(4080) }
                    ]
                }
            ],
            children: [
                {
                    type: "Task", name: "Task name 1",
                    // no render means it will display the 'name' property
                    values: [
                        {
                            groupId: 1,
                            values: [
                                { columnId: "estimated", value: 1320, render: renderDuration(1320) },
                                { columnId: "actual", value: 1320, render: renderDuration(1320) }
                            ]
                        },
                        {
                            groupId: 2,
                            values: [
                                { columnId: "estimated", value: 1320, render: renderDuration(1320) },
                                { columnId: "actual", value: 1320, render: renderDuration(1320) }
                            ]
                        },
                        {
                            groupId: 3,
                            values: [
                                { columnId: "estimated", value: 2640, render: renderDuration(2640) },
                                { columnId: "actual", value: 2640, render: renderDuration(2640) }
                            ]
                        }
                    ],
                    children: [
                        {
                            type: "User", name: "User name 1", render: renderUserName("User name 1"),
                            values: [
                                {
                                    groupId: 1,
                                    values: [
                                        { columnId: "estimated", value: 600, render: renderDuration(600) },
                                        { columnId: "actual", value: 540, render: renderDuration(540) }
                                    ]
                                },
                                {
                                    groupId: 2,
                                    values: [
                                        { columnId: "estimated", value: 600, render: renderDuration(600) },
                                        { columnId: "actual", value: 540, render: renderDuration(540) }
                                    ]
                                },
                                {
                                    groupId: 3,
                                    values: [
                                        { columnId: "estimated", value: 1200, render: renderDuration(1200) },
                                        { columnId: "actual", value: 1080, render: renderDuration(1080) }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "User", name: "User name 2", render: renderUserName("User name 2"),
                            values: [
                                {
                                    groupId: 1,
                                    values: [
                                        { columnId: "estimated", value: 720, render: renderDuration(720) },
                                        { columnId: "actual", value: 780, render: renderDuration(780) }
                                    ]
                                },
                                {
                                    groupId: 2,
                                    values: [
                                        { columnId: "estimated", value: 720, render: renderDuration(720) },
                                        { columnId: "actual", value: 780, render: renderDuration(780) }
                                    ]
                                },
                                {
                                    groupId: 3,
                                    values: [
                                        { columnId: "estimated", value: 1440, render: renderDuration(1440) },
                                        { columnId: "actual", value: 1560, render: renderDuration(1560) }
                                    ]
                                }
                            ]
                        }]
                },
                {
                    type: "Task", name: "Task name 2",
                    // no render means it will display the 'name' property
                    values: [
                        {
                            groupId: 1,
                            values: [
                                { columnId: "estimated", value: 1200, render: renderDuration(1200) },
                                { columnId: "actual", value: 720, render: renderDuration(720) }
                            ]
                        },
                        {
                            groupId: 2,
                            values: [
                                { columnId: "estimated", value: 1200, render: renderDuration(1200) },
                                { columnId: "actual", value: 720, render: renderDuration(720) }
                            ]
                        },
                        {
                            groupId: 3,
                            values: [
                                { columnId: "estimated", value: 2400, render: renderDuration(2400) },
                                { columnId: "actual", value: 1440, render: renderDuration(1440) }
                            ]
                        }
                    ],
                    children: [
                        {
                            type: "User", name: "User name 1", render: renderUserName("User name 1"),
                            values: [
                                {
                                    groupId: 1,
                                    values: [
                                        { columnId: "estimated", value: 1200, render: renderDuration(1200) },
                                        { columnId: "actual", value: 720, render: renderDuration(720) }
                                    ]
                                },
                                {
                                    groupId: 2,
                                    values: [
                                        { columnId: "estimated", value: 1200, render: renderDuration(1200) },
                                        { columnId: "actual", value: 720, render: renderDuration(720) }
                                    ]
                                },
                                {
                                    groupId: 3,
                                    values: [
                                        { columnId: "estimated", value: 2400, render: renderDuration(2400) },
                                        { columnId: "actual", value: 1440, render: renderDuration(1440) }
                                    ]
                                }
                            ]
                        }]
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
}