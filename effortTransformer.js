// effortTransformer.js
// TODO - C - Refactor to keep it DRY
export class EffortTransformer {
    constructor(data) {
        this.data = JSON.parse(JSON.stringify(data));
    }
    transformToIntervals(groupBy, groupEntityBy) {
        this.#setCapacity0ToRepeatedIntervalAndUsers();
        const groups = this.#buildIntervalGroups(groupBy === 'user'); // Include capacity if grouped by user

        if (groupBy === 'entity') {
            return { groups, rows: this.#transformByEntity('intervals', groupEntityBy) };
        } else if (groupBy === 'user') {
            return { groups, rows: this.#transformIntervalsByUser() };
        } else {
            throw new Error('Invalid groupBy value. Use "entity" or "user".');
        }
    }

    transformToTotals(groupBy, groupEntityBy) {
        const groups = this.#buildTotalsGroups();
        if (groupBy === 'entity') {
            return { groups, rows: this.#transformByEntity('totals', groupEntityBy) };
        } else if (groupBy === 'user') {
            return { groups, rows: this.#transformTotalsByUser() };
        } else {
            throw new Error('Invalid groupBy value. Use "entity" or "user".');
        }
    }

    #transformTotalsByUser() {
        const rows = this.data.Users.map(user => {
            const userProjects = this.#getUserEntityForTotals(user.Id);
            const userTotals = this.#aggregateTotals(userProjects);
            return this.#buildUserObject(user, { values: userTotals, children: userProjects });
        });
        return rows;
    }
    #transformByEntity(intervalsOrTotals, groupEntityBy = 'workItem') {
        const isIntervals = intervalsOrTotals === 'intervals';
    
        const buildEntityRows = this.data.Entities.map(entity => {
            if (groupEntityBy === 'workItem') {
                return this.#groupEntityByWorkItem(entity, isIntervals);
            } else if (groupEntityBy === 'user') {
                return this.#groupEntityByUser(entity, isIntervals);
            } else {
                throw new Error('Invalid groupEntityBy value. Use "workItem" or "user".');
            }
        });
    
        return buildEntityRows;
    }
    #groupEntityByWorkItem(entity, isIntervals) {
        const workItems = entity.WorkItems.map(workItem => {
            const userRows = workItem.AssignedEfforts.map(effort => {
                const user = this.#getUserById(effort.UserId);
                const values = isIntervals ? this.#buildIntervalValues(effort.Intervals) : [{
                    groupId: 1,
                    values: [
                        { columnId: "estimated", value: effort.TotalUserWorkItemEffort.EstimatedEffort, render: { func: "renderDuration", params: { value: effort.TotalUserWorkItemEffort.EstimatedEffort } } },
                        { columnId: "actual", value: effort.TotalUserWorkItemEffort.AcceptedEffort, render: { func: "renderDuration", params: { value: effort.TotalUserWorkItemEffort.AcceptedEffort } } }
                    ]
                }];
                return this.#buildUserObject(user, { values });
            });
    
            const workItemValues = this.#aggregateWorkItemValues(userRows);
            return {
                type: "workItem",
                name: workItem.Name,
                values: workItemValues,
                children: userRows
            };
        });
    
        const entityValues = this.#aggregateEntityValues(workItems);
        return {
            type: entity.EntityType,
            name: entity.Name,
            subType: entity.EntitySubType,
            render: this.#builtRenderEntityObject(entity),
            values: entityValues,
            children: workItems
        };
    }
    #groupEntityByUser(entity, isIntervals) {
        let userMap = new Map();
    
        entity.WorkItems.forEach(workItem => {
            workItem.AssignedEfforts.forEach(effort => {
                const user = this.#getUserById(effort.UserId);
                if (!userMap.has(user.Id)) {
                    userMap.set(user.Id, {
                        user: user,
                        workItems: []
                    });
                }
                const values = isIntervals ? this.#buildIntervalValues(effort.Intervals) :
                    [{
                        groupId: 1,
                        values: [
                            { columnId: "estimated", value: effort.TotalUserWorkItemEffort.EstimatedEffort, render: { func: "renderDuration", params: { value: effort.TotalUserWorkItemEffort.EstimatedEffort } } },
                            { columnId: "actual", value: effort.TotalUserWorkItemEffort.AcceptedEffort, render: { func: "renderDuration", params: { value: effort.TotalUserWorkItemEffort.AcceptedEffort } } }
                        ]
                    }];
                userMap.get(user.Id).workItems.push({
                    type: "workItem",
                    name: workItem.Name,
                    values: values
                });
            });
        });
    
        const userRows = Array.from(userMap.values()).map(({ user, workItems }) => {
            const userValues = this.#aggregateWorkItemValues(workItems); // This method needs to be adapted to handle single user aggregation
            return this.#buildUserObject(user, {
                values: userValues,
                children: workItems
            });
        });
    
        return {
            type: entity.EntityType,
            name: entity.Name,
            subType: entity.EntitySubType,
            render: this.#builtRenderEntityObject(entity),
            values: this.#aggregateEntityValues(userRows), // Adapted to handle user aggregation
            children: userRows
        };
    }

    #transformIntervalsByUser() {
        const buildUserRowsWithEntities = () => this.data.Users.map(user => {
            const userProjects = this.#aggregateUserEntities(user.Id);
            const userTotals = this.#aggregateUserValuesAcrossEntities(userProjects);
            return this.#buildUserObject(user, { values: userTotals, children: userProjects });
        });

        const rows = buildUserRowsWithEntities();
        this.#setCapacityToUndefinedForNonUsers(rows);
        return rows;
    }

    #createWorkItemValueForTotals(workItem, assignedEffort) {
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
    }
    #getUserEntityForTotals(userId) {
        let projects = [];
        this.data.Entities.forEach(entity => {
            const projectWorkItems = entity.WorkItems.reduce((acc, workItem) => {
                workItem.AssignedEfforts.filter(effort => effort.UserId === userId)
                    .forEach(assignedEffort => {
                        acc.push(this.#createWorkItemValueForTotals(workItem, assignedEffort));
                    });
                return acc;
            }, []);

            if (projectWorkItems.length > 0) {
                const projectTotals = this.#aggregateTotals(projectWorkItems);
                projects.push({
                    type: entity.EntityType,
                    name: entity.Name,
                    render: this.#builtRenderEntityObject(entity),
                    values: projectTotals,
                    children: projectWorkItems
                });
            }
        });

        return projects;
    }
    #builtRenderEntityObject(entity) {
        return {
            func: "renderEntityName",
            params: {
                name: entity.Name,
                entityType: entity.EntityType,
                entitySubType: entity.EntitySubType
            }
        };
    };

    #buildUserObject(user, additionalValues = {}) {
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
    #buildWorkItemObject(workItem, assignedEffort) {
        const buildIntervalValuesWithCapacity = (intervals) => {
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
        };
        return {
            type: "workItem",
            name: workItem.Name,
            values: buildIntervalValuesWithCapacity(assignedEffort.Intervals)
        };
    }

    #buildTotalsGroups() {
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

    #buildIntervalGroups(includeCapacity = false) {
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
    #buildIntervalValues(intervals) {
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

    #aggregateValues(items, valueExtractor) {
        const flatValues = items.flatMap(valueExtractor);
        return this.#sumValuesByGroup(flatValues);
    }
    
    #aggregateEntityValues(workItems) {
        return this.#aggregateValues(workItems, workItem => workItem.values);
    }
    
    #aggregateTotals(rows) {
        return this.#aggregateValues(rows, row => row.values);
    }
    
    #aggregateWorkItemValues(userRows) {
        return this.#aggregateValues(userRows, user => user.values);
    }
    
    #aggregateUserValuesAcrossEntities(entities) {
        return this.#aggregateValues(entities, entity => entity.values);
    }
    
    #aggregateUserEntities(userId) {
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
                                render: this.#builtRenderEntityObject(entity),
                                children: [this.#buildWorkItemObject(workItem, assignedEffort)],
                                values: []
                            });
                        } else {
                            entities[entityIndex].children.push(this.#buildWorkItemObject(workItem, assignedEffort));
                        }
                    }
                });
            });
        });

        entities.forEach(entity => {
            entity.values = this.#aggregateWorkItemValues(entity.children);
        });

        return entities;
    }
    #sumValuesByGroup(values) {
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
    #setCapacityToUndefinedForNonUsers(rows) {
        function updateCapacity(item) {
            if (item.type !== 'user') {
                item.values.forEach(group => group.values.forEach(value => {
                    if (value.columnId === 'capacity') {
                        value.value = undefined;
                        value.render.params.value = undefined;
                    }
                }));
            }
            item.children?.forEach(updateCapacity);
        }
        rows.forEach(updateCapacity);
    }
    #setCapacity0ToRepeatedIntervalAndUsers() {
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
    #getUserById(userId) {
        return this.data.Users.find(u => u.Id === userId) || {
            Id: userId,
            Name: `user ${userId}`,
            UserImageUrl: '',
            CategoryId: ''
        };
    }
}
