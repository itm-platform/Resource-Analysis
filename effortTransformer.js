export class EffortTransformer {
    constructor(data) {
        this.data = data;
        this.setCapacity0ToRepeatedIntervalAndUsers();
    }

    setCapacity0ToRepeatedIntervalAndUsers() {
        const seen = new Map();  // To store and track combinations of UserId and IntervalId

        this.data.Entities.forEach(entity => {
            entity.WorkItems.forEach(workItem => {
                workItem.AssignedEfforts.forEach(assignedEffort => {
                    assignedEffort.Intervals.forEach(interval => {
                        const key = assignedEffort.UserId + '-' + interval.IntervalId;
                        if (!seen.has(key)) {
                            // First encounter, keep the Capacity as is and mark as seen
                            seen.set(key, true);
                        } else {
                            // Already seen, set Capacity to 0
                            interval.Capacity = 0;
                        }
                    });
                });
            });
        });
    }

    transformToIntervalsByEntity() {
        const groups = this.buildIntervalGroups();
        const rows = this.buildEntitiesRows();
        return { groups, rows };
    }
    transformToIntervalsByUser() {
        const groups = this.buildIntervalGroups(true); // Pass true to include capacity
        const rows = this.buildUserRowsWithEntities();
        this.setCapacityToUndefinedForNonUsers(rows);
        return { groups, rows };
    }
    // interval by user
    setCapacityToUndefinedForNonUsers(rows) {
        function updateCapacity(item) {
            // Only process the items that are not of type 'user'
            if (item.type !== 'user') {
                item.values.forEach(group => {
                    group.values.forEach(value => {
                        if (value.columnId === 'capacity') {
                            value.value = undefined;
                            value.render.params.value = undefined;
                        }
                    });
                });
            }
    
            // Recurse into children if they exist
            if (item.children && item.children.length > 0) {
                item.children.forEach(child => updateCapacity(child));
            }
        }
    
        rows.forEach(row => {
            updateCapacity(row);
        });
    }

    buildUserRowsWithEntities() {
        return this.data.Users.map(user => {
            const userRow = {
                type: "user",
                name: user.Name,
                render: { func: "renderUserName", params: { name: user.Name } },
                values: [],
                children: this.aggregateUserEntities(user.Id)
            };
            userRow.values = this.aggregateUserValuesAcrossEntities(userRow.children);
            return userRow;
        });
    }


    aggregateUserEntities(userId) {
        let entities = [];

        this.data.Entities.forEach(entity => {
            entity.WorkItems.forEach(workItem => {
                workItem.AssignedEfforts.forEach(assignedEffort => {
                    if (assignedEffort.UserId === userId) {
                        const entityIndex = entities.findIndex(e => e.name === entity.Name);
                        if (entityIndex === -1) {
                            entities.push({
                                type: entity.EntityType,
                                name: entity.Name,
                                subType: entity.EntitySubType,
                                render: { func: "renderEntityName", params: { name: entity.Name, entityType: entity.EntityType, entitySubType: entity.EntitySubType } },
                                children: [this.buildWorkItemRow(workItem, assignedEffort)],
                                values: []
                            });
                        } else {
                            entities[entityIndex].children.push(this.buildWorkItemRow(workItem, assignedEffort));
                        }
                    }
                });
            });
        });

        entities.forEach(entity => {
            entity.values = this.aggregateWorkItemValues(entity.children);
        });

        return entities;
    }

    buildWorkItemRow(workItem, assignedEffort) {
        return {
            type: "workItem",
            name: workItem.Name,
            values: this.buildIntervalValuesWithCapacity(assignedEffort.Intervals)
        };
    }

    // interval by user
    
    buildIntervalGroups(includeCapacity = false) {
        const intervals = this.data.Intervals || [];
        const groups = intervals.map(interval => ({
            id: interval.IntervalId,
            name: interval.IntervalName,
            columns: [
                ...(includeCapacity ? [{ id: "capacity", name: "Capacity" }] : []),
                { id: "estimated", name: "Estimated" },
                { id: "actual", name: "Actual" }
            ] 
        }));
        groups.push({
            id: intervals.length + 1,
            name: "Sum of Periods",
            columns: [
                ...(includeCapacity ? [{ id: "capacity", name: "Capacity" }] : []),
                { id: "estimated", name: "Estimated" },
                { id: "actual", name: "Actual" }
            ]
        });
        return groups;
    }

    buildEntitiesRows() {
        return this.data.Entities.map(entity => {
            const workItems = this.buildWorkItemRows(entity.WorkItems);
            const entityRow = {
                type: entity.EntityType,
                name: entity.Name,
                subType: entity.EntitySubType,
                render: { func: "renderEntityName", params: { name: entity.Name, entityType: entity.EntityType, entitySubType: entity.EntitySubType } },
                values: this.aggregateEntityValues(workItems),
                children: workItems
            };
            return entityRow;
        });
    }

    buildWorkItemRows(workItems) {
        return workItems.map(workItem => {
            const userRows = this.buildUserRows(workItem.AssignedEfforts);
            const workItemRow = {
                type: "workItem",
                name: workItem.Name,
                values: this.aggregateWorkItemValues(userRows),
                children: userRows
            };
            return workItemRow;
        });
    }

    buildUserRows(assignedEfforts) {
        const userMap = this.buildUserMap();
        return assignedEfforts.map(effort => {
            const values = this.buildIntervalValues(effort.Intervals);
            const userRow = {
                type: "User",
                name: userMap.get(effort.UserId) || `User ${effort.UserId}`, // Corrected to use mapped user names
                render: { func: "renderUserName", params: { name: userMap.get(effort.UserId) || `User ${effort.UserId}` } },
                values
            };
            return userRow;
        });
    }

    buildUserMap() {
        const userMap = new Map();
        this.data.Users.forEach(user => {
            userMap.set(user.Id, user.Name);
        });
        return userMap;
    }

    buildIntervalValues(intervals) {
        const intervalValues = intervals.map(interval => ({
            groupId: parseInt(interval.IntervalId),
            values: [
                { columnId: "estimated", value: interval.EstimatedEffort, render: { func: "renderDuration", params: { value: interval.EstimatedEffort } } },
                { columnId: "actual", value: interval.ActualEffort, render: { func: "renderDuration", params: { value: interval.ActualEffort } } }
            ]
        }));

        // Sum values across all intervals
        const sumValues = intervals.reduce((acc, cur) => ({
            estimated: acc.estimated + cur.EstimatedEffort,
            actual: acc.actual + cur.ActualEffort
        }), { estimated: 0, actual: 0 });

        intervalValues.push({
            groupId: intervals.length + 1,
            values: [
                { columnId: "estimated", value: sumValues.estimated, render: { func: "renderDuration", params: { value: sumValues.estimated } } },
                { columnId: "actual", value: sumValues.actual, render: { func: "renderDuration", params: { value: sumValues.actual } } }
            ]
        });

        return intervalValues;
    }

    aggregateEntityValues(workItems) {
        const flatValues = workItems.flatMap(workItem => workItem.values);
        return this.sumValuesByGroup(flatValues);
    }

    aggregateWorkItemValues(userRows) {
        const flatValues = userRows.flatMap(user => user.values);
        return this.sumValuesByGroup(flatValues);
    }
    sumValuesByGroup(values) {
        const groupMap = new Map();
        for (const valueGroup of values) {
            for (const value of valueGroup.values) {
                const existing = groupMap.get(valueGroup.groupId) || {};
                existing[value.columnId] = (existing[value.columnId] || 0) + value.value;
                groupMap.set(valueGroup.groupId, existing);
            }
        }

        return Array.from(groupMap).map(([groupId, columns]) => ({
            groupId,
            values: Object.keys(columns).map(columnId => ({
                columnId,
                value: columns[columnId],
                render: { func: "renderDuration", params: { value: columns[columnId] } }
            }))
        }));
    }
    buildIntervalValuesWithCapacity(intervals) {
        const intervalValues = intervals.map(interval => ({
            groupId: parseInt(interval.IntervalId),
            values: [
                { columnId: "capacity", value: interval.Capacity, render: { func: "renderDuration", params: { value: interval.Capacity } } },
                { columnId: "estimated", value: interval.EstimatedEffort, render: { func: "renderDuration", params: { value: interval.EstimatedEffort } } },
                { columnId: "actual", value: interval.ActualEffort, render: { func: "renderDuration", params: { value: interval.ActualEffort } } }
            ]
        }));

        // Sum values across all intervals for the summary group
        const sumValues = intervals.reduce((acc, cur) => ({
            capacity: acc.capacity + cur.Capacity,
            estimated: acc.estimated + cur.EstimatedEffort,
            actual: acc.actual + cur.ActualEffort
        }), { capacity: 0, estimated: 0, actual: 0 });

        intervalValues.push({
            groupId: intervals.length + 1,
            values: [
                { columnId: "capacity", value: sumValues.capacity, render: { func: "renderDuration", params: { value: sumValues.capacity } } },
                { columnId: "estimated", value: sumValues.estimated, render: { func: "renderDuration", params: { value: sumValues.estimated } } },
                { columnId: "actual", value: sumValues.actual, render: { func: "renderDuration", params: { value: sumValues.actual } } }
            ]
        });

        return intervalValues;
    }
    aggregateUserValuesAcrossEntities(entities) {
        // Similar to other aggregation methods, summing values across all entity groups
        const flatValues = entities.flatMap(entity => entity.values);
        return this.sumValuesByGroup(flatValues);
    }
}
