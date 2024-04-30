// effortTransformer.js
// TODO - A - In the ByEntity views, add a switch task/user to user/task
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
            const userProjects = this.#getUserProjectsForTotals(user.Id);
            const userTotals = this.#aggregateTotals(userProjects);
            return this.#createUserRow(user, { values: userTotals, children: userProjects });
        });
        return rows;
    }
    #transformByEntity(intervalsOrTotals) {
        const isIntervals = intervalsOrTotals === 'intervals';

        const buildEntityRows = this.data.Entities.map(entity => {
            const workItems = entity.WorkItems.map(workItem => {
                const userRows = workItem.AssignedEfforts.map(effort => {
                    const user = this.#getUserById(effort.UserId);
                    const values = isIntervals ? this.#buildIntervalValues(effort.Intervals) :
                        [{
                            groupId: 1,
                            values: [
                                { columnId: "estimated", value: effort.TotalUserWorkItemEffort.EstimatedEffort, render: { func: "renderDuration", params: { value: effort.TotalUserWorkItemEffort.EstimatedEffort } } },
                                { columnId: "actual", value: effort.TotalUserWorkItemEffort.AcceptedEffort, render: { func: "renderDuration", params: { value: effort.TotalUserWorkItemEffort.AcceptedEffort } } }
                            ]
                        }];
                    return this.#createUserRow(user, { values });
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
                render: this.#renderEntity(entity),
                values: entityValues,
                children: workItems
            };
        });

        return buildEntityRows;
    }

    #transformIntervalsByUser() {
        const buildUserRowsWithEntities = () => this.data.Users.map(user => {
            const userProjects = this.#aggregateUserEntities(user.Id);
            const userTotals = this.#aggregateUserValuesAcrossEntities(userProjects);
            return this.#createUserRow(user, { values: userTotals, children: userProjects });
        });

        const rows = buildUserRowsWithEntities();
        this.#setCapacityToUndefinedForNonUsers(rows);
        return rows;
    }

    #getUserById(userId) {
        return this.data.Users.find(u => u.Id === userId) || {
            Id: userId,
            Name: `user ${userId}`,
            UserImageUrl: '',
            CategoryId: ''
        };
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
    #getUserProjectsForTotals(userId) {
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
                    type: "project",
                    name: entity.Name,
                    render: { func: "renderEntityName", params: { name: entity.Name, entityType: entity.EntityType, entitySubType: entity.EntitySubType } },
                    values: projectTotals,
                    children: projectWorkItems
                });
            }
        });

        return projects;
    }
    #renderEntity(entity) {
        return {
            func: "renderEntityName",
            params: {
                name: entity.Name,
                entityType: entity.EntityType,
                entitySubType: entity.EntitySubType
            }
        };
    };
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

    transformToTotalsByEntity() {
        const groups = this.#buildTotalsGroups();

        const rows = this.data.Entities.map(entity => {
            const mapEntity = (workItem) => {
                const userRows = workItem.AssignedEfforts.map(assignedEffort => {
                    const user = this.#getUserById(assignedEffort.UserId);
                    const totals = assignedEffort.TotalUserWorkItemEffort;
                    const values = [{
                        groupId: 1,
                        values: [
                            { columnId: "estimated", value: totals.EstimatedEffort, render: { func: "renderDuration", params: { value: totals.EstimatedEffort } } },
                            { columnId: "actual", value: totals.AcceptedEffort, render: { func: "renderDuration", params: { value: totals.AcceptedEffort } } }
                        ]
                    }];
                    return this.#createUserRow(user, { values });
                });

                const workItemTotals = this.#aggregateWorkItemValues(userRows);
                return {
                    type: "workItem",
                    name: workItem.Name,
                    values: workItemTotals,
                    children: userRows
                };
            };

            const workItemRows = entity.WorkItems.map(mapEntity);

            const entityTotals = this.#aggregateEntityValues(workItemRows);
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

    #aggregateTotals(rows) {
        return this.#sumValuesByGroup(rows.flatMap(row => row.values));
    }

    #aggregateWorkItemValues(userRows) {
        const flatValues = userRows.flatMap(user => user.values);
        return this.#sumValuesByGroup(flatValues);
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
    #createUserRow(user, additionalValues = {}) {
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
    #buildWorkItemRow(workItem, assignedEffort) {
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
    #aggregateEntityValues(workItems) {
        const flatValues = workItems.flatMap(workItem => workItem.values);
        return this.#sumValuesByGroup(flatValues);
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
                                render: { func: "renderEntityName", params: { name: entity.Name, entityType: entity.EntityType, entitySubType: entity.EntitySubType } },
                                children: [this.#buildWorkItemRow(workItem, assignedEffort)],
                                values: []
                            });
                        } else {
                            entities[entityIndex].children.push(this.#buildWorkItemRow(workItem, assignedEffort));
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
    #aggregateUserValuesAcrossEntities(entities) {
        // Similar to other aggregation methods, summing values across all entity groups
        const flatValues = entities.flatMap(entity => entity.values);
        return this.#sumValuesByGroup(flatValues);
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
}
