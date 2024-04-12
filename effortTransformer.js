export class EffortTransformer {
    constructor(data) {
        this.data = data;
        this._setCapacity0ToRepeatedIntervalAndUsers();
    }



    transformToIntervalsByEntity() {
        const groups = this._buildIntervalGroups();
        const rows = this._buildEntitiesRows();
        return { groups, rows };
    }
    transformToIntervalsByUser() {
        const groups = this._buildIntervalGroups(true); // Pass true to include capacity
        const rows = this._buildUserRowsWithEntities();
        this._setCapacityToUndefinedForNonUsers(rows);
        return { groups, rows };
    }
    _setCapacity0ToRepeatedIntervalAndUsers() {
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
    // interval by user
    _setCapacityToUndefinedForNonUsers(rows) {
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

    _buildUserRowsWithEntities() {
        return this.data.Users.map(user => {
            const userRow = {
                type: "user",
                name: user.Name,
                render: { func: "renderUserName", params: { name: user.Name } },
                values: [],
                children: this._aggregateUserEntities(user.Id)
            };
            userRow.values = this._aggregateUserValuesAcrossEntities(userRow.children);
            return userRow;
        });
    }
    _buildWorkItemRow(workItem, assignedEffort) {
        return {
            type: "workItem",
            name: workItem.Name,
            values: this._buildIntervalValuesWithCapacity(assignedEffort.Intervals)
        };
    }
    // interval by user
    
    _buildIntervalGroups(includeCapacity = false) {
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
    _buildIntervalValuesWithCapacity(intervals) {
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

    _buildEntitiesRows() {
        return this.data.Entities.map(entity => {
            const workItems = this._buildWorkItemRows(entity.WorkItems);
            const entityRow = {
                type: entity.EntityType,
                name: entity.Name,
                subType: entity.EntitySubType,
                render: { func: "renderEntityName", params: { name: entity.Name, entityType: entity.EntityType, entitySubType: entity.EntitySubType } },
                values: this._aggregateEntityValues(workItems),
                children: workItems
            };
            return entityRow;
        });
    }

    _buildWorkItemRows(workItems) {
        return workItems.map(workItem => {
            const userRows = this._buildUserRows(workItem.AssignedEfforts);
            const workItemRow = {
                type: "workItem",
                name: workItem.Name,
                values: this._aggregateWorkItemValues(userRows),
                children: userRows
            };
            return workItemRow;
        });
    }

    _buildUserRows(assignedEfforts) {
        const userMap = this._buildUserMap();
        return assignedEfforts.map(effort => {
            const values = this._buildIntervalValues(effort.Intervals);
            const userRow = {
                type: "User",
                name: userMap.get(effort.UserId) || `User ${effort.UserId}`, // Corrected to use mapped user names
                render: { func: "renderUserName", params: { name: userMap.get(effort.UserId) || `User ${effort.UserId}` } },
                values
            };
            return userRow;
        });
    }

    _buildUserMap() {
        const userMap = new Map();
        this.data.Users.forEach(user => {
            userMap.set(user.Id, user.Name);
        });
        return userMap;
    }

    _buildIntervalValues(intervals) {
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

    _aggregateEntityValues(workItems) {
        const flatValues = workItems.flatMap(workItem => workItem.values);
        return this._sumValuesByGroup(flatValues);
    }

    _aggregateUserEntities(userId) {
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
                                children: [this._buildWorkItemRow(workItem, assignedEffort)],
                                values: []
                            });
                        } else {
                            entities[entityIndex].children.push(this._buildWorkItemRow(workItem, assignedEffort));
                        }
                    }
                });
            });
        });

        entities.forEach(entity => {
            entity.values = this._aggregateWorkItemValues(entity.children);
        });

        return entities;
    }
    _aggregateWorkItemValues(userRows) {
        const flatValues = userRows.flatMap(user => user.values);
        return this._sumValuesByGroup(flatValues);
    }

    _aggregateUserValuesAcrossEntities(entities) {
        // Similar to other aggregation methods, summing values across all entity groups
        const flatValues = entities.flatMap(entity => entity.values);
        return this._sumValuesByGroup(flatValues);
    }
    _sumValuesByGroup(values) {
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

}
