export default {
    Intervals: [
        {
            IntervalId: 1,
            IntervalName: "01-01-2024",
            StartDate: "2024-01-01T00:00:00",
            EndDate: "2024-01-07T23:59:59"
        },
        {
            IntervalId: 2,
            IntervalName: "08-01-2024",
            StartDate: "2024-01-08T00:00:00",
            EndDate: "2024-01-14T23:59:59"
        }
    ],
    Entities: [
        {
            EntityType: "project",
            EntitySubType: "waterfall",
            Id: "project1",
            Name: "Project name 1",
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
                    Id: "task1",
                    Name: "Task name 1",
                    AssignedEfforts: [
                        {
                            UserId: "user1",
                            Intervals: [
                                {
                                    IntervalId: 1,
                                    EstimatedEffort: 600,
                                    ActualEffort: 540,
                                    Capacity: 2400
                                },
                                {
                                    IntervalId: 2,
                                    EstimatedEffort: 600,
                                    ActualEffort: 540,
                                    Capacity: 720
                                }
                            ]
                        },
                        {
                            UserId: "user2",
                            Intervals: [
                                {
                                    IntervalId: 1,
                                    EstimatedEffort: 720,
                                    ActualEffort: 780,
                                    Capacity: 2400
                                },
                                {
                                    IntervalId: 2,
                                    EstimatedEffort: 720,
                                    ActualEffort: 780,
                                    Capacity: 2400
                                }
                            ]
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
                            Intervals: [
                                {
                                    IntervalId: 1,
                                    EstimatedEffort: 1200,
                                    ActualEffort: 720,
                                    Capacity: 2400
                                },
                                {
                                    IntervalId: 2,
                                    EstimatedEffort: 1200,
                                    ActualEffort: 720,
                                    Capacity: 720
                                }
                            ]
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
                            Intervals: [
                                {
                                    IntervalId: 1,
                                    EstimatedEffort: 780,
                                    ActualEffort: 1560,
                                    Capacity: 2400
                                },
                                {
                                    IntervalId: 2,
                                    EstimatedEffort: 780,
                                    ActualEffort: 1560,
                                    Capacity: 2400
                                }
                            ],
                        },
                        {
                            UserId: "user3",
                            Intervals: [
                                {
                                    IntervalId: 1,
                                    EstimatedEffort: 1800,
                                    ActualEffort: 600,
                                    Capacity: 2400
                                },
                                {
                                    IntervalId: 2,
                                    EstimatedEffort: 1800,
                                    ActualEffort: 600,
                                    Capacity: 2400
                                }
                            ],
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
}