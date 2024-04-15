
# ⚠️ Work in progress Do not use yet
## Resource Analysis Backend
The endpoint `/resourceAnalysis` will return the estimated and actual efforts of users in tasks. It is similar to the existing `/resourceCapacity` but v2, admitting POST or URLEncoded Get (as we do with [/search](https://developers.itmplatform.com/documentation/#filter,-page,-sort-v2)


### Definitions
These are the main concepts we will use throughout the document.
Properties between `< >` denote optional
- Entity: A project or a service. Has the properties `{Id, Name, <Program:{Id, Name}>, <Client:{Id, Name}>,<StartDate>, <EndDate>}`
- WorkItem: A task or activity. Has the properties `{Id, Name, {Entity}Id, <StartDate>, <EndDate>}`
- Category: Professional category a user has `{Id, Name}`
- Estimated effort, in minutes: It can apply to a user in a task ("assigned effort") or to a category in a task or a project ("unassigned effort").
- Capacity, in minutes: working time per user per day. 
- Interval: Accumulates efforts and capacities in time periods (day, week, month, or quarter)
### Request (payload)
 `intervals`:  optional; when omitted it will return totals.  
In this example, we are requesting five weeks starting on 2024-01-01. The response will give us the efforts and capacity summarized for weeks 1 to 5.
```json
 {"intervals": {
    "startDate": "2024-01-01",
    "intervalType": "week",
    "noOfIntervals":5
   }
}
```
> 👉🏼 Note: In the existing `/resourceCapacity` we use numbers for `intervalType` which is misleading. 

**Filter** determines which entities and users are requested. Filters can apply to entities and users. 

1. The general form is:
    ```js
    filter:{project, service, task, activity, user}
    ```
1. When a filter is applied, it will return the main property. For example, `"ExternalClient.Id":{"$in":[*]}`  will return the `ExternalClient` property.
    > ⚠️ Confirm the format `"$in":[*]` works. This is the way to include properties in the filter.
1. If no filters are present, it will return all active entities and their users.


Examples
All projects and services of the program Ids 12 and 23
```json
"filter":{
    "project":{
		"Program.Id":{"$in":[12, 23]}
	    },
	"service":{
		"Program.Id":{"$in":[12, 23]}
	}
```

Projects whose start date is within a range and are assigned to clients 21 and 223
```json
"filter":{
    "project":{
		"StartDate":{"$bt":["2023-09-01","2023-11-30"]},
	    "Client.Id":{"$in":[21, 223]}
	}}
```

Tasks with a start date between some values and only users of category 21
```json
"filter":{
    "task":{
		"StartDate":{"$bt":["2023-09-01","2023-11-30"]}
	},
	"user":{
		 "Category.Id": {"$in":[21}}
	}
```
### Response
You can see a [full example below](#response-example). The response will include the following properties:
```js
{
    Intervals?: [{ IntervalId, IntervalName, StartDate, EndDate }],
    Entities: [
        {
            Id, Name, EntityType: 'project' | 'service', 
            EntitySubType?:'waterfall' | 'agile',
            RequestedProperty?: { Id, Name },
            WorkItems: [
                {
                    Id, Name,
                    AssignedEfforts: [
                        {
                            UserId,
                            Intervals?: [{ IntervalId, EstimatedEffort, ActualEffort, Capacity }],
                            TotalUserWorkItemEffort: { EstimatedEffort, AcceptedEffort }
                        },
                    ],
                    UnassignedEfforts: { CategoryN: Integer, ...others},
                },
            ],
        },
    ],
    Users: [
        { Id, Name, UserImageUrl, CategoryId,
        UserTotals: { TotalEstimatedEffort, TotalActualEffort, TotalCapacity } },
    ],
    Categories: [
        { Id, Name },
    ]
}
```
Explanation:
- `Intervals` will be present if the request includes intervals. StartDate and EndDate include time, although the time is always 00:00:00 for the start and 23:59:59 for the end.
- Totals (such as `UserWorkItemTotals`, `WorkItemTotals`, and `EntityTotals`) will not consider intervals; they are the totals. (beware of double calculations)
- `ActualEffort` refers to the reported effort, which can be by intervals
- `AcceptedEffort` refers to the total accepted effort for the user in the task. It can be the same as `ActualEffort` or different.

### Response example
In this example we requested two week intervals. 
```js
{
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
                            ],
                            TotalUserWorkItemEffort: {
                                EstimatedEffort: 8400,
                                AcceptedEffort: 9645
                            }
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
                            ],
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
                            ],
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
                            TotalUserWorkItemEffort: {
                                EstimatedEffort: 7800,
                                AcceptedEffort: 15600
                            }
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
            UserTotals: {
                TotalEstimatedEffort: 480,
                TotalActualEffort: 460
            }
        },
        {
            Id: "user2",
            Name: "User name 2",
            UserImageUrl: "UploadData/PHOTO/16by16_30169.jpg",
            CategoryId: "category1",
            UserTotals: {
                TotalEstimatedEffort: 240,
                TotalActualEffort: 230
            }
        },
        {
            Id: "user3",
            Name: "User name 3",
            UserImageUrl: "UploadData/PHOTO/16by16_30170.jpg",
            CategoryId: "category2",
            UserTotals: {
                TotalEstimatedEffort: 240,
                TotalActualEffort: 230
            }
        }
    ],
    Categories: [
        {
            Id: "category1",
            Name: "Category 1",
            CategoryTotals: {
                TotalEstimatedEffort: 720,
                TotalActualEffort: 690
            }
        }
    ]
}
```


