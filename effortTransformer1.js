// effortTransformer.js
// TODO - A - In the ByEntity views, add a switch task/user to user/task
export class EffortTransformer {
    constructor(data) {
        this.data = JSON.parse(JSON.stringify(data));
    }
    _getUserById(userId) {
        return this.data.Users.find(u => u.Id === userId) || {
            Id: userId,
            Name: `user ${userId}`,
            UserImageUrl: '',
            CategoryId: ''
        };
    }
    transformToIntervals(groupBy) {
        this._setCapacity0ToRepeatedIntervalAndUsers();
        const groups = this._buildIntervalGroups(groupBy === 'user'); // Include capacity if grouping by user

        if (groupBy === 'entity') {
            return { groups, rows: this._buildEntityRows() };
        } else if (groupBy === 'user') {
            const rows = this._buildUserRowsWithEntities();
            this._setCapacityToUndefinedForNonUsers(rows);
            return { groups, rows };
        } else {
            throw new Error("Invalid groupBy value. Must be 'entity' or 'user'.");
        }
    }

    _buildEntityRows() {
        return this.data.Entities.map(entity => {
            const workItems = entity.WorkItems.map(workItem => {
                const userRows = this._buildUserRows(workItem);
                return {
                    type: "workItem",
                    name: workItem.Name,
                    values: this._aggregateWorkItemValues(userRows),
                    children: userRows
                };
            });

            return {
                type: entity.EntityType,
                name: entity.Name,
                subType: entity.EntitySubType,
                render: this._renderEntityName(entity),
                values: this._aggregateEntityValues(workItems),
                children: workItems
            };
        });
    }

    _buildUserRowsWithEntities() {
        return this.data.Users.map(user => {
            const userProjects = this._aggregateUserEntities(user.Id);
            const userTotals = this._aggregateUserValuesAcrossEntities(userProjects);
            return this._createUserRow(user, { values: userTotals, children: userProjects });
        });
    }

    _setCapacityToUndefinedForNonUsers(rows) {
        rows.forEach(row => {
            if (row.type !== 'user') {
                row.values.forEach(group => {
                    group.values.forEach(value => {
                        if (value.columnId === 'capacity') {
                            value.value = undefined;
                            value.render.params.value = undefined;
                        }
                    });
                });

                if (row.children) {
                    row.children.forEach(child => this._setCapacityToUndefinedForNonUsers([child]));
                }
            }
        });
    }
    
    _aggregateWorkItemValues(workItemRows) {
        return workItemRows.reduce((acc, row) => {
            row.values.forEach(value => {
                acc[value.columnId] = (acc[value.columnId] || 0) + value.value;
            });
            return acc;
        }, {});
    }
    
    _aggregateEntityValues(entityRows) {
        return entityRows.reduce((acc, row) => {
            row.values.forEach(value => {
                acc[value.columnId] = (acc[value.columnId] || 0) + value.value;
            });
            return acc;
        }, {});
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
    _createUserRow(user, additionalValues = {}) {
        return {
            type: "user",
            id: user.Id,
            name: user.Name,
            imageUrl: user.UserImageUrl,
            categoryId: user.CategoryId,
            render: {
                func: "renderUserName",
                params: {
                    id: user.Id,
                    name: user.Name,
                    imageUrl: user.UserImageUrl,
                    categoryId: user.CategoryId
                }
            },
            ...additionalValues
        };
    }
    _buildWorkItemRow(workItem, assignedEffort) {
        const buildIntervalValuesWithCapacity=(intervals)=> {
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
        return {
            type: "workItem",
            name: workItem.Name,
            values: buildIntervalValuesWithCapacity(assignedEffort.Intervals)
        };
    }

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
