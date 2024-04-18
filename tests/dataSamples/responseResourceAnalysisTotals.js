export default {
    Entities: [
        {
            EntityType: "project",
            EntitySubType: "waterfall",
            Id: "project1",
            Name: "Project name 1",
            WorkItems: [
                {
                    Id: "task1",
                    Name: "Task name 1",
                    AssignedEfforts: [
                        {
                            UserId: "user1",
                            TotalUserWorkItemEffort: {
                                EstimatedEffort: 8400,
                                AcceptedEffort: 9645
                            }
                        },
                        {
                            UserId: "user2",
                            TotalUserWorkItemEffort: {
                                EstimatedEffort: 5910,
                                AcceptedEffort: 5298
                            }
                        }
                    ],
                    UnassignedEfforts: {
                        Category1: 60,
                        Category2: 60
                    }
                },
                {
                    Id: "task2",
                    Name: "Task name 2",
                    AssignedEfforts: [
                        {
                            UserId: "user1",
                            TotalUserWorkItemEffort: {
                                EstimatedEffort: 3900,
                                AcceptedEffort: 2550
                            }
                        }
                    ],
                    UnassignedEfforts: {
                        Category1: 60,
                        Category2: 60
                    }
                }
            ]
        },
        {
            EntityType: "project",
            EntitySubType: "waterfall",
            Id: "project2",
            Name: "Project name 2",
            Client: {
                Id: "client1",
                Name: "Client 1"
            },
            Program: {
                Id: "program1",
                Name: "Program 1"
            },
            WorkItems: [
                {
                    Id: "task3",
                    Name: "Task name 3",
                    AssignedEfforts: [
                        {
                            UserId: "user2",
                            TotalUserWorkItemEffort: {
                                EstimatedEffort: 7800,
                                AcceptedEffort: 15600
                            }
                        },
                        {
                            UserId: "user3",
                            TotalUserWorkItemEffort: {
                                EstimatedEffort: 18000,
                                AcceptedEffort: 6000
                            }
                        }
                    ],
                    UnassignedEfforts: {
                        Category1: 60,
                        Category2: 60
                    }
                }
            ]
        }
    ],
    Users: [
        {
            Id: "user1",
            Name: "User name 1",
            UserImageUrl: "UploadData/PHOTO/16by16_30168.jpg",
            CategoryId: "category1",
        },
        {
            Id: "user2",
            Name: "User name 2",
            UserImageUrl: "UploadData/PHOTO/16by16_30169.jpg",
            CategoryId: "category1",
        },
        {
            Id: "user3",
            Name: "User name 3",
            UserImageUrl: "UploadData/PHOTO/16by16_30170.jpg",
            CategoryId: "category2",
        }
    ],
    Categories: [
        {
            Id: "category1",
            Name: "Category 1",
        }
    ]
};