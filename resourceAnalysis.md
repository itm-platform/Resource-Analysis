I am with ITM Platform and this is the initial specification for the "Resource Analysis" feature. 



## Resource Analysis Backend
The endpoint `/resourceAnalysis` will return the estimated and actual efforts of users in tasks.
### Definitions
There are the main concepts we will use throughout the document.
Properties between `< >` denote optional
- Entity: A project or a service. Has the properties `{Id, Name, <Program:{Id, Name}>, <Client:{Id, Name}>,<StartDate>, <EndDate>}`
- WorkItem: A task or activity. Has the properties `{Id, Name, {Entity}Id, <StartDate>, <EndDate>}`
- Category: Professional category a user has `{Id, Name}`
- Estimated effort, in minutes: It can apply to a user in a task ("assigned effort") or to a category in a task or a project ("unassigned effort"). The first version will only focus on *assigned effort*, not dealing with *unassigned effort*.
- Capacity, in minutes: working time per user per day. 
- Interval: Accumulates efforts and capacities in time periods (day, week, month, or quarter)
### Request (payload)
 `intervals`:  optional; when omitted it will return totals. See the [Resources API](https://developers.itmplatform.com/documentation/#resource-capacity-get-resource-capacity-get)
 
In this example, we are requesting five weeks starting on 2024-01-01. The response will give us the efforts and capacity summarized for weeks 1 to 5.
```json
 {"intervals": {
            "startDate": "2024-01-01",
            "intervalType": "week",
            "noOfIntervals":5
        }
}
```

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
"filter":{"project":{
			"Program.Id":{"$in":[12, 23]}
		},
		"service":{
			"Program.Id":{"$in":[12, 23]}
		}
```

Projects whose start date is within a range and are assigned to clients 21 and 223
```json
"filter":{"project":{
			"StartDate":{"$bt":["2023-09-01","2023-11-30"]},
			"Client.Id":{"$in":[21, 223]}
	}}
```

Tasks with a start date between some values and only users of category 21
```json
"filter":{"task":{
			"StartDate":{"$bt":["2023-09-01","2023-11-30"]}
		},
		 "user":{
			 "Category.Id": {"$in":[21}}
		}
```
### Response
```js
{
    Intervals?: [{ IntervalId, IntervalName, StartDate, EndDate }],
    Entities: [
        {
            Id, Name, EntityType:{'project', 'service'}, 
            EntitySubType?:{'waterfall', 'agile',} 
            RequestedProperty?: { Id, Name },
            WorkItems: [
                {
                    Id, Name,
                    AssignedEfforts: [
                        {
                            UserId,
                            Intervals?: [{ IntervalId, EstimatedEffort, ActualEffort, Capacity }],
                            UserWorkItemTotals: { TotalEstimatedEffort, TotalActualEffort }
                        },
                    ],
                    UnassignedEfforts: { CategoryN: Integer, ...others},
                    WorkItemTotals: { TotalEstimatedEffort, TotalActualEffort, TotalUnassignedEffort }
                },
            ],
            EntityTotals: { TotalEstimatedEffort, TotalActualEffort, TotalUnassignedEffort }
        },
    ],
    Users: [
        { Id, Name, UserImageUrl, CategoryId },
    ],
    Categories: [
        { Id, Name },
    ]
}
```
- `Intervals` will be present if the request includes intervals. 
- Totals (such as `UserWorkItemTotals`, `WorkItemTotals`, and `EntityTotals`) will not consider intervals; they are the totals. (beware of double calculations)
- `ActualEffort` refers to the accepted effort. Consider adding reported.

[See JSON](./responseResourceAnalysis.json)

## Effort Analysis Frontend
#### Rows
e  represents an entity, "u" the user

Example 1: It will display entities (projects and services), their workItems and finally, the users
``` user at the end, grouped by pro
e.1 program
-- e.1.1 project
---- e1.1.1 tasks, nesting summaries and child tasks
------ users
-- e.2.1 service
---- e.2.1 activities
------ users
```

Example 2: It will display users first, then projects

```user at the beginning and only project
user
-- e.1 project
```

Example 2: It will display projects and categories
```only projects and categories
e.1 project
--- e.2 categories
```

The frontend (UI) should be able to group by other properties, such as clients or programs.
### Columns
Columns will display the efforts per row (entities and users)
- If there are intervals, then it will display intervals and totals. If there are no intervals, it will display totals only.
- In the JSON response we already have: Estimated effort, Actual effort, Capacity (capacity only for users and when time interval). 
- Calculated by frontend, per interval or total: actual/estimate, estimate/capacity, actual/capacity
	- Total by rows and total by columns. ::warning:: if entities or usres are filtered, totals will not add up to the top entity (for example, we filtered only a category, the total estimated or actual for a project will not be the real value. We can use a warning in the UI, but not in the API)
	- Time interval: totals (no interval) or day/week/month/quarter



Entities should be selectable to view and group by, either programmatically (eg only display projects and usrs) or manually by the user. 
All must be exportable to a spreadsheet.
Filter
- By dates
- By any of the rows
Filters can be set programmatically or manually. Manual filters can be hidden to prevent the user from seeing them

Furture. charts
