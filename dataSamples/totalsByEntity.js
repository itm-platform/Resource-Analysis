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
            type: "project",
            name: "Project 1",
            render: { func: "renderEntityName",  params: { name: "Project 1", EntityType: "project", EntitySubType: "waterfall"}},
            values: [
                {
                    groupId: 1,
                    values: [
                        { columnId: "estimated", value: 18210, render: { func: "renderDuration", params: { value: 18210}} },
                        { columnId: "actual", value: 17505, render: { func: "renderDuration", params: { value: 17505}} }
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
                                { columnId: "estimated", value: 14310, render: { func: "renderDuration", params: { value: 14310}} },
                                { columnId: "actual", value: 14955, render: { func: "renderDuration", params: { value: 14955}} }
                            ]
                        }
                    ],
                    children: [
                        {
                            type: "User", name: "User name 1", render: { func: "renderUserName",  params: { name: "User name 1"}},
                            values: [
                                {
                                    groupId: 1,
                                    values: [
                                        { columnId: "estimated", value: 8400, render: { func: "renderDuration", params: { value: 8400}} },
                                        { columnId: "actual", value: 9645, render: { func: "renderDuration", params: { value: 9645}} }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "User", name: "User name 2", render: { func: "renderUserName",  params: { name: "User name 2"}},
                            values: [
                                {
                                    groupId: 1,
                                    values: [
                                        { columnId: "estimated", value: 5910, render: { func: "renderDuration", params: { value: 5910}} },
                                        { columnId: "actual", value: 5310, render: { func: "renderDuration", params: { value: 5310}} }
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
                                { columnId: "estimated", value: 3900, render: { func: "renderDuration", params: { value: 3900}} },
                                { columnId: "actual", value: 2550, render: { func: "renderDuration", params: { value: 2550}} }
                            ]
                        }
                    ],
                    children: [
                        {
                            type: "User", name: "User name 1", render: { func: "renderUserName",  params: { name: "User name 1"}},
                            values: [
                                {
                                    groupId: 1,
                                    values: [
                                        { columnId: "estimated", value: 3900, render: { func: "renderDuration", params: { value: 3900}} },
                                        { columnId: "actual", value: 2550, render: { func: "renderDuration", params: { value: 2550}} }
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