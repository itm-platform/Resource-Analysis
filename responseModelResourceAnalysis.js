export const responseModelResourceAnalysis =
{
    Intervals?: [{ IntervalId, IntervalName, StartDate, EndDate }],
    Entities: [
        {
            EntityType, Id, Name,
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
};