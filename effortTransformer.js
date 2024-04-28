// effortTransformer.js
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
    
    transformToIntervalsByEntity() {
        this._setCapacity0ToRepeatedIntervalAndUsers();
        const groups = this._buildIntervalGroups();
    
        const buildEntitiesRows = () => {
            const buildWorkItemRows = (workItems) => {
                return workItems.map(workItem => {
                    const buildUserRows = (assignedEfforts) => {
                        return assignedEfforts.map(effort => {
                            const user = this._getUserById(effort.UserId);  // Replace here
                            const values = this._buildIntervalValues(effort.Intervals);
                            return this._createUserRow(user, {values});
                        });
                    };
                    
                    const userRows = buildUserRows(workItem.AssignedEfforts);
                    const workItemRow = {
                        type: "workItem",
                        name: workItem.Name,
                        values: this._aggregateWorkItemValues(userRows),
                        children: userRows
                    };
                    return workItemRow;
                });
            };
            return this.data.Entities.map(entity => {
                const workItems = buildWorkItemRows(entity.WorkItems);
                const entityRow = {
                    type: entity.EntityType,
                    name: entity.Name,
                    subType: entity.EntitySubType,
                    render: {
                        func: "renderEntityName",
                        params: {
                            name: entity.Name,
                            entityType: entity.EntityType,
                            entitySubType: entity.EntitySubType
                        }
                    },
                    values: this._aggregateEntityValues(workItems),
                    children: workItems
                };
                return entityRow;
            });
        };
        const rows = buildEntitiesRows();
        return { groups, rows };
    }
    
    transformToIntervalsByUser() {
        this._setCapacity0ToRepeatedIntervalAndUsers();
        const groups = this._buildIntervalGroups(true); // Pass true to include capacity
    
        const buildUserRowsWithEntities = () => {
            return this.data.Users.map(user => {
                const userProjects = this._aggregateUserEntities(user.Id);
                const userTotals = this._aggregateUserValuesAcrossEntities(userProjects);
                return this._createUserRow(user, { values: userTotals, children: userProjects });
            });
        };
        const rows = buildUserRowsWithEntities();
        
        const setCapacityToUndefinedForNonUsers = (rows) => {
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
        };
        setCapacityToUndefinedForNonUsers(rows);
        return { groups, rows };
    }
    
    transformToTotalsByEntity() {
        const groups = this._buildTotalsGroups();
    
        const rows = this.data.Entities.map(entity => {
            const mapEntity = (workItem) => {
                const userRows = workItem.AssignedEfforts.map(assignedEffort => {
                    const user = this._getUserById(assignedEffort.UserId);
                    const totals = assignedEffort.TotalUserWorkItemEffort;
                    const values = [{
                        groupId: 1,
                        values: [
                            { columnId: "estimated", value: totals.EstimatedEffort, render: { func: "renderDuration", params: { value: totals.EstimatedEffort } } },
                            { columnId: "actual", value: totals.AcceptedEffort, render: { func: "renderDuration", params: { value: totals.AcceptedEffort } } }
                        ]
                    }];
                    return this._createUserRow(user, { values });
                });
    
                const workItemTotals = this._aggregateWorkItemValues(userRows);
                return {
                    type: "workItem",
                    name: workItem.Name,
                    values: workItemTotals,
                    children: userRows
                };
            };
    
            const workItemRows = entity.WorkItems.map(mapEntity);
    
            const entityTotals = this._aggregateEntityValues(workItemRows);
            return {
                type: entity.EntityType,
                name: entity.Name,
                render: { func: "renderEntityName", params: { name: entity.Name, entityType: entity.EntityType, entitySubType: entity.EntitySubType } },
                values: entityTotals,
                children: workItemRows
            };
        });
    
        return { groups, rows };
    }
    
    transformToTotalsByUser() {
        const groups = this._buildTotalsGroups();
    
        const createWorkItemValueForTotals = (workItem, assignedEffort) => {
            const totals = assignedEffort.TotalUserWorkItemEffort;
            const values = [{
                groupId: 1,
                values: [
                    { columnId: "estimated", value: totals.EstimatedEffort, render: { func: "renderDuration", params: { value: totals.EstimatedEffort } } },
                    { columnId: "actual", value: totals.AcceptedEffort, render: { func: "renderDuration", params: { value: totals.AcceptedEffort } } }
                ]
            }];
            return {
                type: "workItem",
                name: workItem.Name,
                values: values
            };
        };
    
        const getUserProjectsForTotals = (userId) => {
            let projects = [];
            this.data.Entities.forEach(entity => {
                const projectWorkItems = entity.WorkItems.reduce((acc, workItem) => {
                    workItem.AssignedEfforts.filter(effort => effort.UserId === userId)
                        .forEach(assignedEffort => {
                            acc.push(createWorkItemValueForTotals(workItem, assignedEffort));
                        });
                    return acc;
                }, []);
    
                if (projectWorkItems.length > 0) {
                    const projectTotals = this._aggregateTotals(projectWorkItems);
                    projects.push({
                        type: "project",
                        name: entity.Name,
                        render: { func: "renderEntityName", params: { name: entity.Name, entityType: entity.EntityType, entitySubType: entity.EntitySubType } },
                        values: projectTotals,
                        children: projectWorkItems
                    });
                }
            });
    
            return projects;
        };
    
        const rows = this.data.Users.map(user => {
            const userProjects = getUserProjectsForTotals(user.Id);
            const userTotals = this._aggregateTotals(userProjects);
            return this._createUserRow(user, { values: userTotals, children: userProjects });
        });
    
        return { groups, rows };
    }
    _aggregateTotals(rows) {
        return this._sumValuesByGroup(rows.flatMap(row => row.values));
    }
    _aggregateUserValues(userRows) {
        return userRows.reduce((acc, row) => {
            // Example of aggregating values; adjust according to actual structure and requirements
            row.values.forEach(value => {
                acc[value.columnId] = (acc[value.columnId] || 0) + value.value;
            });
            return acc;
        }, {});
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

    _buildTotalsGroups() {
        return [
            {
                id: 1,
                name: "Total",
                columns: [
                    { id: "estimated", name: "Estimated" },
                    { id: "actual", name: "Actual" }
                ]
            }
        ];
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
