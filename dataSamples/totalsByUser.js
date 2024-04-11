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
            render: { func: "renderUserName",  params: { name: "User name 1"}},
            values: [
                {
                    groupId: 1,
                    values: [
                        { columnId: "estimated", value: 44010, render: { func: "renderDuration", params: { value: 44010}} },
                        { columnId: "actual", value: 39105, render: { func: "renderDuration", params: { value: 39105}} }
                    ]
                }
            ],
            children: [
                { 
                    type: "project", name: "Project name 1",
                    render: { func: "renderEntityName",  params: { name: "Project name 1", EntityType: "project", EntitySubType: "waterfall"}},
                    values: [
                        {
                            groupId: 1,
                            values: [

                                { columnId: "estimated", value: 12300, render: { func: "renderDuration", params: { value: 12300}} },
                                { columnId: "actual", value: 12195, render: { func: "renderDuration", params: { value: 12195}} }
                            ]
                        }
                    ],
                    children: [
                        {
                            type: "workItem", name: "Task name 1",
                            values: [
                                {
                                    groupId: 1,
                                    values: [

                                        { columnId: "estimated", value: 8400, render: { func: "renderDuration", params: { value: 8400}} },
                                        { columnId: "actual", value: 9645, render: { func: "renderDuration", params: { value: 9645}} }
                                    ]
                                }
                            ],

                        },
                        {
                            type: "workItem", name: "Task name 2",
                            values: [
                                {
                                    groupId: 1,
                                    values: [

                                        { columnId: "estimated", value: 3900, render: { func: "renderDuration", params: { value: 3900}} },
                                        { columnId: "actual", value: 2550, render: { func: "renderDuration", params: { value: 2550}} }
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
            render: { func: "renderUserName",  params: { name: "User name 2"}},
            values: [
                {
                    groupId: 1,
                    values: [
                        { columnId: "estimated", value: 13710, render: { func: "renderDuration", params: { value: 13710}} },
                        { columnId: "actual", value: 20910, render: { func: "renderDuration", params: { value: 20910}} }
                    ]
                }
            ],
            children: [{
                type: "Project", name: "Project name 1",
                render: { func: "renderEntityName",  params: { name: "Project name 1", EntityType: "project", EntitySubType: "waterfall"}},
                values: [
                    {
                        groupId: 1,
                        values: [

                            { columnId: "estimated", value: 5910, render: { func: "renderDuration", params: { value: 5910}} },
                            { columnId: "actual", value: 5310, render: { func: "renderDuration", params: { value: 5310}} }
                        ]
                    }
                ],
                children: [
                    {
                        type: "workItem", name: "Task name 1",
                        values: [
                            {
                                groupId: 1,
                                values: [{ columnId: "estimated", value: 5910, render: { func: "renderDuration", params: { value: 5910}} },
                                { columnId: "actual", value: 5310, render: { func: "renderDuration", params: { value: 5310}} }
                                ]
                            }
                        ],

                    }

                ]
            },
            {
                type: "Project", name: "Project name 2",
                render: { func: "renderEntityName",  params: { name: "Project name 2", EntityType: "project", EntitySubType: "waterfall"}},
                values: [
                    {
                        groupId: 1,
                        values: [

                            { columnId: "estimated", value: 7800, render: { func: "renderDuration", params: { value: 7800}} },
                            { columnId: "actual", value: 15600, render: { func: "renderDuration", params: { value: 15600}} }
                        ]
                    }
                ],
                children: [
                    {
                        type: "workItem", name: "Task name 3",
                        values: [
                            {
                                groupId: 1,
                                values: [
                                    { columnId: "estimated", value: 7800, render: { func: "renderDuration", params: { value: 7800}} },
                                    { columnId: "actual", value: 15600, render: { func: "renderDuration", params: { value: 15600}} }
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
            render: { func: "renderUserName",  params: { name: "User name 3"}},
            values: [
                {
                    groupId: 1,
                    values: [
                        { columnId: "estimated", value: 18000, render: { func: "renderDuration", params: { value: 18000}} },
                        { columnId: "actual", value: 6000, render: { func: "renderDuration", params: { value: 6000}} }
                    ]
                }
            ],
            children: [
                {
                    type: "Project", name: "Project name 2",
                    render: { func: "renderEntityName",  params: { name: "Project name 2", EntityType: "project", EntitySubType: "waterfall"}},
                    values: [
                        {
                            groupId: 1,
                            values: [

                                { columnId: "estimated", value: 18000, render: { func: "renderDuration", params: { value: 18000}} },
                                { columnId: "actual", value: 6000, render: { func: "renderDuration", params: { value: 6000}} }
                            ]
                        }
                    ],
                    children: [
                        {
                            type: "workItem", name: "Task name 3",
                            values: [
                                {
                                    groupId: 1,
                                    values: [

                                        { columnId: "estimated", value: 18000, render: { func: "renderDuration", params: { value: 18000}} },
                                        { columnId: "actual", value: 6000, render: { func: "renderDuration", params: { value: 6000}} }
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
