export class EffortTransformer {
    constructor(data) {
        this.data = JSON.parse(JSON.stringify(data));
    }

    transformToIntervalsByEntity() {
        this._setCapacity0ToRepeatedIntervalAndUsers();
        const groups = this._buildIntervalGroups();

        const buildEntitiesRows=()=> {
            const buildWorkItemRows=(workItems)=> {
                return workItems.map(workItem => {
                    const buildUserRows=(assignedEfforts) =>{
                        const userMap = this._buildUserMap();
                        return assignedEfforts.map(effort => {
                            const values = this._buildIntervalValues(effort.Intervals);
                            const userRow = {
                                type: "user",
                                id: effort.UserId,
                                name: userMap.get(effort.UserId)?.name || `user ${effort.UserId}`,
                                imageUrl: userMap.get(effort.UserId)?.imageUrl,
                                categoryId: userMap.get(effort.UserId)?.categoryId,
                                render: { 
                                    func: "renderUserName", 
                                    params: { 
                                        name: userMap.get(effort.UserId)?.name || `user ${effort.UserId}`,
                                        imageUrl: userMap.get(effort.UserId)?.imageUrl,
                                        categoryId: userMap.get(effort.UserId)?.categoryId
                                    } 
                                },
                                values
                            };
                            return userRow;
                        });
                    }
                    const userRows = buildUserRows(workItem.AssignedEfforts);
                    const workItemRow = {
                        type: "workItem",
                        name: workItem.Name,
                        values: this._aggregateWorkItemValues(userRows),
                        children: userRows
                    };
                    return workItemRow;
                });
            }
            return this.data.Entities.map(entity => {
                const workItems = buildWorkItemRows(entity.WorkItems);
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
        const rows = buildEntitiesRows();
        return { groups, rows };
    }
    transformToIntervalsByUser() {
        this._setCapacity0ToRepeatedIntervalAndUsers();
        const groups = this._buildIntervalGroups(true); // Pass true to include capacity

        const buildUserRowsWithEntities = () => {
            return this.data.Users.map(user => {
                const userRow = {
                    type: "user",
                    id: user.Id, // Add user Id
                    name: user.Name,
                    imageUrl: user.UserImageUrl, // Add user image URL
                    categoryId: user.CategoryId, // Add user category ID
                    render: { 
                        func: "renderUserName", 
                        params: {
                            name: user.Name,
                            imageUrl: user.UserImageUrl, // Include in render params
                            categoryId: user.CategoryId // Include in render params
                        }
                    },
                    values: [],
                    children: this._aggregateUserEntities(user.Id)
                };
                userRow.values = this._aggregateUserValuesAcrossEntities(userRow.children);
                return userRow;
            });
        };
        const rows = buildUserRowsWithEntities();
        const setCapacityToUndefinedForNonUsers= (rows) =>{
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
        setCapacityToUndefinedForNonUsers(rows);
        return { groups, rows };
    }

    transformToTotalsByEntity() {
        const groups = this._buildTotalsGroups();
    
        const rows = this.data.Entities.map(entity => {
            const mapEntity = (workItem) => {
                const mapAssignedEffortsToUserRowForTotalsByEntity = (workItem, assignedEffort) => {
                    const getUserById = (userId) => {
                        // Find the user or return default properties
                        const defaultUser = { Id: userId, Name: `user ${userId}`, UserImageUrl: '', CategoryId: '' };
                        return this.data.Users.find(user => user.Id === userId) || defaultUser;
                    };
                    const user = getUserById(assignedEffort.UserId);
                    const totals = assignedEffort.TotalUserWorkItemEffort;
                    return {
                        type: "user",
                        id: user.Id,
                        name: user.Name,
                        imageUrl: user.UserImageUrl,
                        categoryId: user.CategoryId,
                        render: { 
                            func: "renderUserName", 
                            params: { 
                                name: user.Name,
                                imageUrl: user.UserImageUrl,
                                categoryId: user.CategoryId
                            }
                        },
                        values: [{
                            groupId: 1,
                            values: [
                                { columnId: "estimated", value: totals.EstimatedEffort, render: { func: "renderDuration", params: { value: totals.EstimatedEffort } } },
                                { columnId: "actual", value: totals.AcceptedEffort, render: { func: "renderDuration", params: { value: totals.AcceptedEffort } } }
                            ]
                        }]
                    };
                }
                const userRows = workItem.AssignedEfforts.map(mapAssignedEffortsToUserRowForTotalsByEntity.bind(this, workItem));
    
                const workItemTotals = this._aggregateTotals(userRows);
                return {
                    type: "workItem",
                    name: workItem.Name,
                    values: workItemTotals,
                    children: userRows
                };
            };
    
            const workItemRows = entity.WorkItems.map(mapEntity);
    
            const entityTotals = this._aggregateTotals(workItemRows);
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
            return {
                type: "user",
                id: user.Id, // Include user ID
                name: user.Name,
                imageUrl: user.UserImageUrl, // Include user image URL
                categoryId: user.CategoryId, // Include user category ID
                render: { 
                    func: "renderUserName", 
                    params: { 
                        name: user.Name,
                        imageUrl: user.UserImageUrl, // Include in render params
                        categoryId: user.CategoryId // Include in render params
                    }
                },
                values: userTotals,
                children: userProjects
            };
        });
    
        return { groups, rows };
    }
    
    _aggregateTotals(rows) {
        return this._sumValuesByGroup(rows.flatMap(row => row.values));
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

    _buildUserMap() {
        const userMap = new Map();
        this.data.Users.forEach(user => {
            userMap.set(user.Id, {
                name: user.Name,
                imageUrl: user.UserImageUrl,
                categoryId: user.CategoryId
            });
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
