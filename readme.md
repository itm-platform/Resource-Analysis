
## Resource Analysis Backend
The endpoint `/resourceAnalysis` will return the estimated and actual efforts of users in tasks. It is similar to the existing `/resourceCapacity` but v2, admitting POST or URLEncoded Get (as we do with [/search](https://developers.itmplatform.com/documentation/#filter,-page,-sort-v2))


### Definitions
These are the main concepts we will use throughout the document.
Properties between `< >` denote optional
- `Entity`: A project or a service. Has the properties `{Id, Name, <Program:{Id, Name}>, <Client:{Id, Name}>,<xx:{Id, Name}>,<StartDate>, <EndDate>}`
- `WorkItem`: A task or activity. Has the properties `{Id, Name, {Entity}Id, <StartDate>, <EndDate>}`
- `Category`: Professional category a user has `{Id, Name}`
- `Estimated effort`, in minutes: It can apply to a user in a task ("assigned effort"), or to a category in a task or a project ("unassigned effort").
- `Capacity`, in minutes: working time per user per day. 
- `Interval`: Accumulates efforts and capacities in time periods (day, week, month, or quarter)
- - `ActualEffort` refers to the reported effort, which can be by intervals
- `AcceptedEffort` refers to the total accepted effort for the user in the task. It can be the same as `ActualEffort` or different.

### Request (payload)
Interval example:
```json
{
    "analysisMode": "intervals",
    "intervals": {
        "startDate": "2024-01-01",
        "intervalType": "week",
        "noOfIntervals": 5
    },
    "filter": {
        "project": {
            "Program.Id": { "$in": [12, 23] }
        },
        "service": {
            "Program.Id": { "$in": [12, 23] }
        }
    }
}
```	
Totals example:

This is an example of "live between" filter. We're requesting that the StartDate is before the range end date and the EndDate is after the range start date.
```json
{
    "analysisMode": "totals",
    "filter": {
        "StartDate": { "$lte": "2023-11-30" },
        "EndDate": { "$gte": "2023-09-01" }
    }
}
```
#### `analysisMode` 
Can be `intervals` or `totals`. Defaults to `totals`.

#### `intervals` 
Mandatory if `analysisMode` is `intervals`.   
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

> 👉🏼 Note: Copy the current way of calculating intervals of `/resourceCapacity`: weeks are 7 days, months are sensitive to whether they have 28, 29, 03 or 31 days. 

#### `Filter` 
    filter:{project, service, user}
Optional. Determines which entities and users are requested. Filters can apply to entities (`project`, `service`) and users (`user`). 

1. The general form is:
    ```js
    filter:{project, service, user}
    ```
2. When a filter is applied, it will return the main property. For example, `{project: "ExternalClient.Id":{"$in":[*]}}`  will return the project's `ExternalClient:{Id, Name}` property.
    > ⚠️ Confirm the format `"$in":[*]` works. This is the way to include properties in the response without filtering.
3. If no filters are present, it will return all **active** entities (inactive must not be present).


**Filter examples**

All projects and services of the program Ids 12 and 23
```json
filter:{
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
	"user":{
		 "Category.Id": {"$in":[21]}}
	}
```
> 👉🏼 Note on filter and `analysisMode`: `totals`. The UI will force to filter entities by dates to prevent server overload. Depending on the final performance tests, we will decide whether to make filter mandatory and limited in the API.

### Response
The response structure will be the like so. You can see a [full example below](#response-examples). 
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
                            TotalUserWorkItemEffort?: { EstimatedEffort, AcceptedEffort }
                        },
                    ],
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
- `Intervals` will be present depending on `analysisMode`. StartDate and EndDate include time, although the time is always 00:00:00 for the start and 23:59:59 for the end.
- Totals (such as `UserWorkItemTotals`, `WorkItemTotals`, and `EntityTotals`) will not consider intervals; they are the totals. (beware of double calculations)
  
Note: we removed the unassigned efforts from the response. `UnassignedEfforts: { CategoryN: Integer, ...others},` If needed, we can add them back

#### Response testing
The response must pass the validation. 
Use the [Postman testing](https://planetary-moon-805575.postman.co/workspace/ITM-Platform~0a69d185-fab5-48c3-890b-e619b2acb113/request/26760249-d7ac2203-36ec-4e48-977e-c6f5a2ae0fc9?ctx=documentation) to validate the response.

Otherwise you can use the local JS. Simplified example:
```js
const payload = {"analysisMode": "totals"};
const result = await fetch('http://localhost:3000/resourceAnalysis', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
});
const response = await result.json();
resourceAnalysisValidator.validateResponse(response);
``` 


### Query approach
We have to use the effort tables as primary sources:

#### Used for Intervals

- Daily Estimated:` [tblWorkHourDistribute] - [intTaskId] ,[intUserId] ,[dtsDate] ,[intWorkMin]` ⚠️ No AccountID
- Daily Actuals: `[tblTaskTime] - [intTaskTimeId] ,[intAccountId] ,[intProjectId] ,[intTaskId] ,[intUserId], ,[dtsWorkdate], ,[intWorkHour], ,[intWorkMin]` ⚠️ No AccountID. Must convert HH:MM to minutes.

#### Used for Totals:

Total Estimated and Accepted: `[tblTaskUser] [intTaskUserId] ,[intTaskId] ,[intProjectUserId], ,[intEstimatedHours], ,[intEstimatedMins] ,[intActualEffortAcceptedHours] ,[intActualEffortAcceptedMins]` ⚠️ No AccountID. Must convert HH:MM to minutes.

We need to decide if filtering will happen before, after or it will be a join.

> ❓Are services in v2? If not, we can remove the `service` filter and offer the feature only for projects in the first version.


### Response examples
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
                    Name: "Task name 2 with a longuer name that exceeds usual length",
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
```

In this example we requested totals. 
```js
{
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
                    Name: "Task name 2 with a longuer name that exceeds usual length",
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
}
```


